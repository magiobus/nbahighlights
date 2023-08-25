import axios from "axios";
const { XMLParser } = require("fast-xml-parser");
const RESPELL_API_KEY = process.env.RESPELL_API_KEY;

const respellLib = {};

const fullGameSummaryId = "faDO9NF_6XaAOA9CAnR3W";
const regularVideoSummaryId = "FoOc5v_IfuqDGNw4iOmEq";

respellLib.gamesummary = async (transcription, summaryType = "short") => {
  if (!transcription) return "No transcription provided";

  const spellId =
    summaryType === "short" ? regularVideoSummaryId : fullGameSummaryId;

  try {
    const response = await axios({
      method: "post",
      url: "https://api.respell.ai/v1/run",
      headers: {
        authorization: "Bearer " + RESPELL_API_KEY,
        accept: "application/json",
        "content-type": "application/json",
      },
      data: {
        spellId: spellId,
        // This field can be omitted to run the latest published version
        // Fill in a value for your dynamic input block
        inputs: {
          gametranscription: transcription,
        },
      },
    });

    const data = response.data;
    const output = data.outputs.output;

    const parsedOutput = await respellLib.convertXmlToJson(output);

    return parsedOutput;
  } catch (error) {
    console.error("error in respell", error);
    throw error;
  }
};

respellLib.convertXmlToJson = async (xml) => {
  const parser = new XMLParser();
  const tObj = parser.parse(xml);
  return tObj;
};

export default respellLib;
