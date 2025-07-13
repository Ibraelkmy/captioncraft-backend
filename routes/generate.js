const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post(
  '/',
  body('text').isString().trim().isLength({ min: 5, max: 300 }).escape(),
  async (req, res) => {
    // 🔐 Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const { text } = req.body;

    try {
      const openaiRes = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an assistant that helps write viral social media content.',
            },
            {
              role: 'user',
              content: `Create the following from this idea: "${text}"\n
              - A scroll-stopping TikTok hook (1 sentence)\n
              - An Instagram caption\n
              - A YouTube Shorts title\n
              - 5 trending hashtags`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const response = openaiRes.data.choices[0].message.content;

      // Parse the output into sections
      const output = parseAIResponse(response);

      res.json(output);
    } catch (err) {
      console.error('OpenAI API error:', err.response?.data || err.message);
      res.status(500).json({ error: 'Failed to generate captions' });
    }
  }
);

// 🧠 Parse AI Response
function parseAIResponse(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  let hook = '', caption = '', title = '', hashtags = [];

  lines.forEach((line) => {
    if (line.toLowerCase().includes('hook')) hook = line.split(':')[1]?.trim() || line;
    if (line.toLowerCase().includes('caption')) caption = line.split(':')[1]?.trim() || line;
    if (line.toLowerCase().includes('title')) title = line.split(':')[1]?.trim() || line;
    if (line.toLowerCase().includes('hashtag')) {
      hashtags = line.replace(/.*:/, '').trim().split(/\s+/);
    }
  });

  return { hook, caption, title, hashtags };
}

module.exports = router;
