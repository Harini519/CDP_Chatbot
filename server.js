const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = 5000;

// Add your API keys/tokens here
const config = {
  segment: {
    apiUrl: "https://api.segment.io/v1",
    apiKey: "<YOUR_SEGMENT_API_KEY>", // Add your Segment API Key
  },
  mParticle: {
    apiUrl: "https://s2s.mparticle.com/v2",
    apiKey: "<YOUR_MPARTICLE_API_KEY>", // Add your mParticle API Key
    apiSecret: "<YOUR_MPARTICLE_API_SECRET>",
  },
  lytics: {
    apiUrl: "https://api.lytics.io/api",
    apiToken: "<YOUR_LYTICS_API_TOKEN>", // Add your Lytics API Token
  },
  zeotap: {
    apiUrl: "https://api.zeotap.com/identity/v1",
    apiToken: "<YOUR_ZEOTAP_API_TOKEN>", // Add your Zeotap API Token
  },
};

// Endpoint to handle user queries
app.post("/query", async (req, res) => {
  const { cdp, query } = req.body;

  try {
    let response;

    switch (cdp.toLowerCase()) {
      case "segment":
        response = await handleSegmentQuery(query);
        break;
      case "mparticle":
        response = await handleMParticleQuery(query);
        break;
      case "lytics":
        response = await handleLyticsQuery(query);
        break;
      case "zeotap":
        response = await handleZeotapQuery(query);
        break;
      default:
        return res.status(400).json({ error: "Invalid CDP specified" });
    }

    res.json({ data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing your request" });
  }
});

// Handlers for individual CDPs
async function handleSegmentQuery(query) {
  if (query.toLowerCase().includes("sources")) {
    const url = `${config.segment.apiUrl}/sources`;
    const response = await axios.get(url, {
      auth: { username: config.segment.apiKey, password: "" },
    });
    return response.data;
  }
  // Add more query handlers for Segment as needed
  return { message: "No matching Segment query handler found" };
}

async function handleMParticleQuery(query) {
  if (query.toLowerCase().includes("events")) {
    const url = `${config.mParticle.apiUrl}/commerce/events`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${config.mParticle.apiKey}:${config.mParticle.apiSecret}`
        ).toString("base64")}`,
      },
    });
    return response.data;
  }
  // Add more query handlers for mParticle as needed
  return { message: "No matching mParticle query handler found" };
}

async function handleLyticsQuery(query) {
  if (query.toLowerCase().includes("segments")) {
    const url = `${config.lytics.apiUrl}/segment`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${config.lytics.apiToken}`,
      },
    });
    return response.data;
  }
  // Add more query handlers for Lytics as needed
  return { message: "No matching Lytics query handler found" };
}

async function handleZeotapQuery(query) {
  if (query.toLowerCase().includes("identity")) {
    const url = config.zeotap.apiUrl;
    const response = await axios.post(
      url,
      { email: "example@example.com" }, // Adjust payload as needed
      {
        headers: {
          Authorization: `Bearer ${config.zeotap.apiToken}`,
        },
      }
    );
    return response.data;
  }
  // Add more query handlers for Zeotap as needed
  return { message: "No matching Zeotap query handler found" };
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
