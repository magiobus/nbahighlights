//SEARCH FOR SEGMENTS IN DB
import nc from "next-connect";
import clientPromise from "@/lib/mongodb";
import ncoptions from "@/config/ncoptions";
import { getSession } from "next-auth/react";

const handler = nc(ncoptions); //middleware next conect handler

//MIDDLEWARE
handler.use(async (req, res, next) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      res.status(401).end("You need to be logged in");
      return;
    }

    const client = await clientPromise;
    req.db = client.db();
    next();
  } catch (error) {
    console.error("Error connecting to DB in /api/users:", error);
    res.status(500).end("Error connecting to DB");
  }
});

//SEARCH
handler.get(async (req, res) => {
  const { query, youtubeId } = req.query;
  const db = req.db;

  console.log("req.query", req.query);

  if (!query) return res.status(400).end("query is required");

  try {
    const data = await db
      .collection("videos")
      .aggregate([
        {
          $match: {
            youtubeId: youtubeId,
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
          $group: {
            _id: "$_id",
            upload_date: { $first: "$upload_date" },
            videoTitle: { $first: "$videoTitle" },
            segments: { $push: "$segments" },
            youtubeId: { $first: "$youtubeId" },
            summary: { $first: "$summary" },
          },
        },
      ])
      .sort({ upload_date: -1 })
      .toArray();

    //how many segments are in total
    const matchesCount = data.reduce((acc, item) => {
      return acc + item.segments.length;
    }, 0);

    res.status(200).json({
      resultsCount: data.length,
      matchesCount: matchesCount,
      result: data,
    });
  } catch (error) {
    console.error("Error getting results:", error);
    res.status(500).end("Error getting results");
  }
});

export default handler;
