//Replicate whisper webhook
import clientPromise from "@/lib/mongodb";
import nc from "next-connect";
import ncoptions from "@/config/ncoptions";
import { ObjectId } from "mongodb";
import replicateLib from "@/lib/replicateLib";

const handler = nc(ncoptions);

//MIDDLEWARE
handler.use(async (req, res, next) => {
  try {
    const client = await clientPromise;
    req.db = client.db();
    next();
  } catch (error) {
    console.error("error in webhook middleware", error);
    res.status(500).json({ error });
    return;
  }
});

//POST
handler.post(async (req, res) => {
  const db = req.db;
  const { id, status, output } = req.body;
  console.log("status for jobID", id, status);

  try {
    const job = await db.collection("jobs").findOne({
      id: id,
    });

    if (!job) {
      res.status(500).json({ error: "job not found" });
      return;
    }

    await db.collection("jobs").updateOne(
      { id: id },
      {
        $set: {
          status: status,
        },
      }
    );

    if (status === "canceled") {
      //update job status to canceled

      //make sure to cancel the job in replicate...
      await replicateLib.cancelJob(id);
      //update video status to canceled
      await db
        .collection("videos")
        .updateOne({ _id: job.videoId }, { $set: { status: "canceled" } });
      res.status(200).end("ok");
    }

    if (status === "succeeded") {
      //get segments
      const { segments } = output;

      const parsedSegments = segments.map((segment) => {
        const { text, start, end } = segment;
        return {
          text,
          start,
          end,
        };
      });

      await db.collection("videos").updateOne(
        { _id: job.videoId },
        {
          $set: {
            status: status,
            segments: parsedSegments,
          },
        }
      );
      console.log("whisper finished, video updated");
      res.status(200).end("ok");
    }
  } catch (error) {
    console.error("error in canceling replicate job", error, id);
    res.status(500).json({ error: "order not found" });
    return;
  }
});

export default handler;
