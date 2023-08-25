//PUBLIC ROUTE TO GET PODCASTS INFO
import nc from "next-connect";
import { getSession } from "next-auth/react";
import clientPromise from "@/lib/mongodb";
import ncoptions from "@/config/ncoptions";
import dateNowUnix from "@/utils/dates/dateNowUnix";
import { ObjectId } from "mongodb";

const handler = nc(ncoptions);

//MIDDLEWARE
handler.use(async (req, res, next) => {
  //gets session and connects to DB Client if authenticated
  try {
    //get session to check access
    const session = await getSession({ req });
    if (session) {
      req.user = session.user;
      const client = await clientPromise;
      req.db = client.db();
      next();
    } else {
      res.status(401).end("You are not authorized");
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

handler.post(async (req, res) => {
  const db = req.db;
  const user = req.user;

  const { channeltag } = req.query;
  const { query, page, sort, order, limit } = req.body;

  if (!query) return res.status(400).end("query is required");
  if (!channeltag) return res.status(400).end("channel_tag is required");

  if (!page || !sort || !order || !limit || !query) {
    res.status(400).end({
      error: "You need to provide page, sort, order, limit and query params",
    });
    return;
  }

  try {
    //search using index into transcription with the same channeltag
    const data = await db
      .collection("transcriptions")
      .aggregate([
        {
          $match: {
            channel_tag: channeltag,
          },
        },
        {
          $unwind: {
            path: "$segments",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            "segments.text": {
              $regex: query,
              $options: "i",
            },
          },
        },
        {
          $sort: {
            "segments.start": 1,
          },
        },
        {
          $facet: {
            totalSegments: [
              {
                $group: {
                  _id: null,
                  count: { $sum: 1 },
                },
              },
            ],
            totalTranscriptions: [
              {
                $group: {
                  _id: "$_id",
                },
              },
              {
                $count: "count",
              },
            ],
            data: [
              {
                $group: {
                  _id: "$_id",
                  upload_date: { $first: "$upload_date" },
                  filename: { $first: "$filename" },
                  segments: { $push: "$segments" },
                  youtubeId: { $first: "$youtubeId" },
                  channel_tag: { $first: "$channel_tag" },
                  url: { $first: "$url" },
                },
              },
              {
                $sort: {
                  [sort]: order === "asc" ? 1 : -1,
                },
              },
              {
                $skip: (Number(page) - 1) * Number(limit),
              },
              {
                $limit: Number(limit),
              },
            ],
          },
        },
      ])
      .toArray();

    //if no results
    if (!data[0].data.length) {
      res.status(200).json({
        results: [],
        transcriptionsCount: 0,
        segmentsCount: 0,
        totalPages: 0,
      });
      return;
    }

    const results = data[0].data || [];
    const segmentsCount = data[0].totalSegments[0].count || 0;
    const transcriptionsCount = data[0].totalTranscriptions[0].count || 0;

    //add search to db
    await db.collection("searches").insertOne({
      userId: ObjectId(user.id),
      query,
      date: dateNowUnix(),
      email: user.email,
      channel_tag: channeltag,
    });

    res.status(200).json({
      results: results,
      transcriptionsCount,
      segmentsCount: segmentsCount,
      totalPages: Math.ceil(transcriptionsCount / limit),
    });
  } catch (error) {
    console.error("error =>", error);
    res.status(500).json({ error: error.message });
  }
});

export default handler;
