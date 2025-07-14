const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-opus-20240229",
        max_tokens: 100,
        messages: [
          {
            role: "user",
            content: `Generate a viral caption about: ${topic}`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
      }
    );

    const caption = response.data.content[0].text.trim();
    res.json({ caption });
  } catch (err) {
    console.error("Error generating caption:", err.message);
    res.status(500).json({ error: "Failed to generate caption" });
  }
});

module.exports = router;
