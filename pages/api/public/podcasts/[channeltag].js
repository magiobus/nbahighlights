//PUBLIC ROUTE TO GET PODCASTS INFO
import nc from "next-connect";
import { getSession } from "next-auth/react";
import clientPromise from "@/lib/mongodb";
import ncoptions from "@/config/ncoptions";
const handler = nc(ncoptions);

//MIDDLEWARE
handler.use(async (req, res, next) => {
  //gets session and connects to DB Client if authenticated
  try {
    const client = await clientPromise;
    const db = await client.db();
    req.db = db;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

handler.get(async (req, res) => {
  const db = req.db;
  try {
    const response = await db
      .collection("podcastsinfo")
      .find({
        channel_tag: req.query.channeltag,
      })
      .toArray();

    const podcast = response[0];

    res.status(200).json(podcast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default handler;
