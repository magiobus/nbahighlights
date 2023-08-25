//USERS API ROUTE for logged in users
import nc from "next-connect";
import { getSession } from "next-auth/react";
import clientPromise from "@/lib/mongodb";
import ncoptions from "@/config/ncoptions";
import { dateNowUnix } from "@/utils/dates";
import replicate from "@/lib/replicateLib";
const { ObjectId } = require("mongodb");

const handler = nc(ncoptions);

//MIDDLEWARE
handler.use(async (req, res, next) => {
  //gets session and connects to DB Client if authenticated
  const session = await getSession({ req });
  if (session && session.user.roles.includes("admin")) {
    req.sessionUser = session.user;
    const client = await clientPromise;
    req.db = client.db();
    next();
  } else {
    res.status(401).end("You don't have permission to do this");
    return;
  }
});

//Get URL of video and create transcription job in the database.
handler.post(async (req, res) => {
  const db = req.db;
  const { url } = req.body;

  console.log("url, we re in=>", url);

  if (!url) {
    console.error("no url provided");
    res.status(400).end("You need to provide a videoUrl");
    return;
  }

  //send to replicate to start transcirbing using  whisper....
  const prediction = await replicate.startWhisperJob({
    url,
    webhookUrl: `${process.env.NGROK_BASE}/api/webhooks/replicate/whisper`,
  });

  const { id, status } = prediction;

  console.log("prediction =>", prediction);

  const videoData = {
    _id: ObjectId(),
    url: url,
    status: status,
    createdAt: dateNowUnix(),
    createdBy: req.sessionUser.email,
  };

  const jobData = {
    id: id,
    videoId: videoData._id,
    url: url,
    status: status,
    createdAt: dateNowUnix(),
    createdBy: req.sessionUser.email,
  };

  //save in mongodb the job and the video
  await db.collection("jobs").insertOne(jobData);
  await db.collection("videos").insertOne(videoData);

  //prediction is already a json
  // Use JSON.stringify to convert the JSON object to a string before sending it in the response
  res.status(200).json({
    jobId: id,
    status: status,
  });
});

export default handler;
