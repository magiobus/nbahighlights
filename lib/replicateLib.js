const token = process.env.REPLICATE_API_KEY;
import axios from "axios";

const trainer_version =
  "d5e058608f43886b9620a8fbb1501853b8cbae4f45c857a014011c86ee614ffb"; //stable diffusion v2.1

const replicateLib = {
  startWhisperJob: async ({
    url,
    language = "en",
    model = "medium",
    transcription = "srt",
    webhookUrl = null,
  }) => {
    if (!url) return "No url provided";
    //send to replicate to start transcirbing using  whisper....
    try {
      const whisperData = {
        version:
          "30414ee7c4fffc37e260fcab7842b5be470b9b840f2b608f5baa9bbef9a259ed",
        input: {
          audio: url,
          language: language,
          model: model,
          transcription,
        },
      };

      if (webhookUrl) whisperData.webhook_completed = webhookUrl;

      const prediction = await axios.post(
        "https://api.replicate.com/v1/predictions",
        whisperData,
        { headers: { Authorization: `Token ${token}` } }
      );

      return prediction.data;
    } catch (error) {
      console.error("error starting whisper job", error);
      return error;
    }
  },

  startTraining: async (data) => {
    const { serving_url, subject, token_instance, webhookUrl } = data;

    const trainingData = {
      input: {
        instance_prompt: `a photo of a ${token_instance} ${subject}`,
        class_prompt: `a photo of a ${subject}`,
        instance_data: serving_url,
        max_train_steps: 2000,
      },
      model: `${process.env.REPLICATE_USERNAME}/imagenrobot-${token_instance}`,
      //uncomment this line to use a trainer_version from replicate v2.1
      // trainer_version: trainer_version,
    };

    if (webhookUrl) trainingData.webhook_completed = webhookUrl;

    const response = await axios.post(
      "https://dreambooth-api-experimental.replicate.com/v1/trainings",
      trainingData,
      { headers: { Authorization: `Token ${token}` } }
    );

    return response.data;
  },
  cancelJob: async (jobId) => {
    const response = await axios.post(
      `https://api.replicate.com/v1/predictions/${jobId}/cancel`,
      {},
      { headers: { Authorization: `Token ${token}` } }
    );

    return response.data;
  },
  getJobStatus: async (jobId) => {
    const response = await axios.get(
      `https://api.replicate.com/v1/predictions/${jobId}`,
      { headers: { Authorization: `Token ${token}` } }
    );

    return response.data;
  },
  parseAfterTraining: async (order) => {
    try {
      if (!order) return "No order provided";

      if (!order?.metadata) {
        return "No metadata in order";
      }

      const { photosQty, stylesQty, quality } = order.metadata;
      const { trainingData, orderStatus } = order;
      const { styles, token_instance, version } = trainingData;

      const replicatePrompts = [];
      //parse styles for replicate...
      //how many generations per prompt ?
      const generationsPerPrompt = Math.ceil(photosQty / stylesQty);

      //iterate tru styles and add a boolean to the array
      styles.forEach((style) => {
        const randomPrompt =
          style.prompts[Math.floor(Math.random() * style.prompts.length)];

        //replace randomPrompt.prompt with token_instance instead of [token]
        randomPrompt.prompt = randomPrompt.prompt.replace(
          "[token]",
          token_instance
        );

        //_style is a copy of style, but without the key of prompts
        let _style = { ...style };
        delete _style.prompts;

        _style = {
          prompt: randomPrompt,
          generationsPerPrompt: 4,
          completed: false,
          webhook_completed: `${process.env.NEXTAUTH_URL}/api/webhooks/replicateimagejob`,
        };

        replicatePrompts.push(_style);
      });

      //we can only generate 4 images per prompt at a time
      //how many times do we need to add the prompt to the list ?
      const timesToAdd = Math.ceil(generationsPerPrompt / 4);

      //add the prompt to the list
      for (let i = 1; i < timesToAdd; i++) {
        replicatePrompts.forEach((prompt) => {
          replicatePrompts.push(prompt);
        });
      }

      return replicatePrompts;
    } catch (error) {
      console.error("error parsing replicate prompts", error);
      return "error parsing replicate prompts";
    }
  },
  startImageJobs: async (db, order, replicatePrompts, version) => {
    const promisesResponse = await Promise.all(
      replicatePrompts.map(async (replicatePrompt) => {
        try {
          // //start generation of images using replicate
          const replicateResponse = await replicateLib.generateImageJob({
            replicatePrompt,
            version,
          });

          const jobResponse = await db.collection("jobs").insertOne({
            replicateJobId: replicateResponse.id,
            input: replicateResponse.input,
            status: replicateResponse.status,
            orderId: order.orderId,
            userId: order.userId,
            created_at: replicateResponse.created_at,
          });

          return jobResponse;
        } catch (error) {
          console.error("error in replicate job", error);
        }
      })
    );

    await Promise.all(promisesResponse);

    await db.collection("orders").updateOne(
      { orderId: order.orderId },
      {
        $set: {
          orderStatus: "generating",
        },
      }
    );

    return "jobs started for order " + order.orderId;
  },
  generateImageJob: async ({ replicatePrompt, version }) => {
    const item = replicatePrompt;
    const itemPrompt = replicatePrompt.prompt;

    //get first prompt
    const jobData = {
      input: {
        prompt: itemPrompt.prompt,
        negative_prompt: itemPrompt.negativePrompt,
        width: itemPrompt.width,
        height: itemPrompt.height,
        num_outputs: item.generationsPerPrompt,
        guidance_scale: itemPrompt.scale,
      },
      version,
      webhook_completed: item.webhook_completed,
    };

    try {
      const response = await axios.post(
        "https://api.replicate.com/v1/predictions",
        jobData,
        { headers: { Authorization: `Token ${token}` } }
      );

      console.info("JOB Response =>", response);
      return response.data;
    } catch (error) {
      console.error("error starting replicate job =>", error);
      return;
    }
  },
  generateScaleJob: async ({
    photoUrl,
    orderId,
    face_enhance = false,
    scale = 2,
  }) => {
    const scalerData = {
      version:
        "42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
      input: {
        image: photoUrl,
        face_enhance: face_enhance,
        scale: scale,
      },
      webhook_completed: `${process.env.NEXTAUTH_URL}/api/webhooks/replicatescalejob?orderId=${orderId}`,
    };

    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      scalerData,
      { headers: { Authorization: `Token ${token}` } }
    );

    return response;
  },
};

export default replicateLib;
