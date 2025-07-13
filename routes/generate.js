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
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
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
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const caption = response.data.choices[0].message.content.trim();
    res.json({ caption });
  } catch (err) {
    console.error("Error generating caption:", err.message);
    res.status(500).json({ error: "Failed to generate caption" });
  }
});

module.exports = router;
