// routes/generate.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/generate', async (req, res) => {
  const { text } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-sonnet-20240229', // or haiku / opus
        max_tokens: 200,
        temperature: 0.7,
        system: "You are a creative social media assistant that writes engaging and viral captions.",
        messages: [
          { role: 'user', content: `Generate a viral social media caption for: ${text}` }
        ]
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    const message = response.data?.content?.[0]?.text || 'No response';
    res.json({ caption: message });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate caption' });
  }
});

module.exports = router;
