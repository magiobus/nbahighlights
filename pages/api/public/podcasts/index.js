//PUBLIC ROUTE TO GET PODCASTS LIST
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

//GET STATS
handler.get(async (req, res) => {
  const db = req.db;
  try {
    const podcasts = await db.collection("podcastsinfo").find({}).toArray();
    res.status(200).json({ podcasts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default handler;
