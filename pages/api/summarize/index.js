//Refreshes some values on the stats page
//This is a cron job that runs every day
import nc from "next-connect";
import clientPromise from "@/lib/mongodb";
import ncoptions from "@/config/ncoptions";
import respell from "@/lib/respellLib";

// ENVS

const handler = nc(ncoptions); //middleware next conect handler

//MIDDLEWARE
handler.use(async (req, res, next) => {
  try {
    //read api auth
    const { youtubeId } = req.query;

    if (!youtubeId)
      return res.status(401).json({ error: "No youtubeId provided" });

    const client = await clientPromise;
    req.db = client.db();
    req.youtubeId = youtubeId;
    next();
  } catch (error) {
    console.error("Error connecting to DB in /api/users:", error);
    res.status(500).end("Error connecting to DB");
  }
});

handler.get(async (req, res) => {
  const { db, youtubeId, duration } = req;

  console.log("youtubeId for summary=>", youtubeId);

  try {
    //get transcript from db
    const transcript = await db.collection("videos").findOne({
      youtubeId,
    });

    if (!transcript) return res.status(404).end("Transcript not found");

    //does the transcript has summarization ?
    //check if the key summary exists in the transcript and if it has a value
    //transcript already exists, send error
    transcript.summary = transcript.summary || null;
    if (transcript.summary) return res.status(400).end("Already summarized");

    const { segments } = transcript;

    // // //clean segments to get only start, end, text
    const cleanSegments = segments.map((segment) => {
      const { text } = segment;
      return { text };
    });

    //merge segments to send only text
    const mergedSegments = cleanSegments
      .map((segment) => segment.text)
      .join(" ");

    //use respell api to summarize
    let summaryType = "short";
    if (duration > 1800) summaryType = "long";
    const respellresult = await respell.gamesummary(
      mergedSegments,
      summaryType
    );
    console.log("respell result )>", respellresult);

    // //Update db here with the summary
    await db
      .collection("videos")
      .updateOne(
        { youtubeId },
        { $set: { summary: respellresult.summary || null } }
      );

    console.log("summary updated in db for youtubeId =>", youtubeId);

    res.status(200).json(respellresult);
  } catch (error) {
    console.error("Error Summarizing", error);
    res.status(500).end(error);
  }
});

export default handler;
