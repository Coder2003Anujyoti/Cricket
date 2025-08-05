const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const router = express.Router();
require('dotenv').config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const generateContent = async (prompt) => {
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
    },
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  return res.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No data generated.';
};
const test = async () => {
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: "Say hello!" }] }],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    console.log(res.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};

test();
router.post('/topplayers', async (req, res) => {
  const players = req.body.players;

  if (!Array.isArray(players) || players.length === 0) {
    return res.status(400).json({ success: false, error: 'Invalid or empty players array.' });
  }
  try {
    const prompt = `
You are given a JSON array of cricket players. Each player has:
- name
- fullname
- image
- role
- team
- captain (boolean)
- matches
- runs
- wickets

From this array, select the **top 10 players** based on:
- Performance score = runs + (wickets × 20)
- Prefer captains if performance is similar
- Basis of Current IPL stats 
Return only the best 10 players in valid JSON format. Do not include any explanation or extra text.

Here is the input:
${JSON.stringify(players)}
    `;
    const responseText = await generateContent(prompt);
    let topPlayers = [];
    try {
const jsonMatch = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
if (jsonMatch) {
  topPlayers = JSON.parse(jsonMatch[0]);
} else {
  console.warn('⚠️ No valid JSON found in Gemini response.');
  return res.json({ success: false, message: 'Gemini did not return valid JSON.' });
}
    } catch (err) {
      console.warn('⚠️ Gemini response parsing failed.');
      return res.json({ success: false, message: 'Gemini did not return valid JSON.' });
    }
    res.json({ success: true, topPlayers });
  } catch (error) {
    console.error('❌ Error:', error?.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Failed to generate top players.' });
  }
});
module.exports=router;