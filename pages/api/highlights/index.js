//Refreshes some values on the stats page
//This is a cron job that runs every day
import nc from "next-connect";
import clientPromise from "@/lib/mongodb";
import ncoptions from "@/config/ncoptions";
import respell from "@/lib/respellLib";

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
  const { db, youtubeId } = req;

  console.log("youtubeId for highlights=>", youtubeId);

  try {
    //get transcript from db
    const transcript = await db.collection("videos").findOne({
      youtubeId,
    });

    if (!transcript) return res.status(404).end("Transcript not found");

    //does the transcript has summarization ?
    //check if the key summary exists in the transcript and if it has a value
    //transcript already exists, send error
    transcript.highlights = transcript.highlights || null;
    if (transcript.highlights)
      return res.status(400).end("Already highlighted");

    const { segments } = transcript;

    // // //clean segments to get only start, end, text
    const cleanSegments = segments.map((segment) => {
      const { text, start } = segment;
      return { text, start };
    });

    //merge segments to send only text
    const mergedSegments = cleanSegments
      .map(
        (segment) => "ts: " + segment.start.toFixed(2) + " - " + segment.text
      )
      .join(" ");

    //use respell api to get highlights

    const respellresult = await respell.videohighlights(mergedSegments);

    //Update db here with the highlights
    await db
      .collection("videos")
      .updateOne(
        { youtubeId },
        { $set: { highlights: respellresult.highlights || null } }
      );

    console.log("highlights updated in db for youtubeId =>", youtubeId);

    res.status(200).json(respellresult.highlights);
  } catch (error) {
    console.error("Error Summarizing", error);
    res.status(500).end(error);
  }
});

export default handler;
