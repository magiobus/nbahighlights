//USERS API ROUTE for logged in users
import nc from "next-connect";
import { getSession } from "next-auth/react";
import clientPromise from "@/lib/mongodb";
import ncoptions from "@/config/ncoptions";
import { dateNowUnix } from "@/utils/dates";
import replicate from "@/lib/replicateLib";
import ytdl from "ytdl-core"; // to download youtube video as audio
import cloudinary from "cloudinary"; // to upload audio to cloudinary
const { ObjectId } = require("mongodb");
const fs = require("fs");

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

  console.log("youtube, url=>", url);

  if (!url) {
    console.error("no url provided");
    res.status(400).end("You need to provide a videoUrl");
    return;
  }

  // Download youtube video as audio and upload audio to cloudinary
  try {
    const audioPath = "./audio.mp3";
    const videoReadableStream = ytdl(url, { filter: "audioonly" });
    const audioWritableStream = fs.createWriteStream(audioPath);

    videoReadableStream.pipe(audioWritableStream);

    // Get the ID of the youtube video
    const info = await ytdl.getInfo(url);
    const videoId = info.videoDetails.videoId;
    const videoTitle = info.videoDetails.title;
    console.info("Downloading from YT =>", videoId);

    audioWritableStream.on("finish", async () => {
      console.info("uploading audio to cloudinary");
      const result = await cloudinary.v2.uploader.upload(audioPath, {
        public_id: videoId,
        resource_type: "video",
        chunk_size: 6000000,
        folder: "fullgamevideos",
      });

      const url = result.url;

      fs.unlinkSync(audioPath); // delete local audio file

      //send to replicate to start transcirbing using  whisper....
      console.info("starting prediction job in replicate");
      const prediction = await replicate.startWhisperJob({
        url, // use the cloudinary url
        webhookUrl: `${process.env.NGROK_BASE}/api/webhooks/replicate/whisper`,
      });

      const { id, status } = prediction;

      const videoData = {
        _id: ObjectId(),
        youtubeId: videoId,
        videoTitle: videoTitle,
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
      console.info("job and video saved in db");

      //prediction is already a json
      // Use JSON.stringify to convert the JSON object to a string before sending it in the response
      res.status(200).json({
        jobId: id,
        status: status,
      });
    });

    return;
  } catch (error) {
    console.error("Error downloading and uploading audio:", error);
    res.status(500).end("Error downloading and uploading audio");
    return;
  }
});

export default handler;
