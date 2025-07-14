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
      "https://api.anthropic.com/v1/complete",
      {
        model: "claude-sonnet-4-20250514", // or your Claude model
        prompt: `Generate a viral caption about: ${topic}`,
        max_tokens: 100,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
      }
    );

    const caption = response.data.completion.trim();
    res.json({ caption });
  } catch (err) {
    console.error("Error generating caption:", err.message);
    res.status(500).json({ error: "Failed to generate caption" });
  }
});

module.exports = router;
