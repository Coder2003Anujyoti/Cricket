const express= require('express');
const news=require("../data/News.json")
const cors=require('cors');
const app = express();
const router = express.Router();
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const NewsCollection= require('../schemas/news.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken,authorizeRoles }=require("../middleware/authMiddleware.js")
   const addDataToMongodb = async() => {
    await NewsCollection.deleteMany();
    await NewsCollection.insertMany(news);
}
//addDataToMongodb();
router.get('/getnews', async (req, res) => {
  try {
    const allNews = await NewsCollection.find().sort({ _id: -1 });
    const newsList = [];
    const postsList = [];
    for (const item of allNews) {
      if (item.posttype === "news") {
        newsList.push(item);
      } else if (item.posttype === "posts") {
        postsList.push(item);
      }
    }
    return res.json({
      news_count: newsList.length,
      news_data: newsList.slice(0,5),
      posts_count: postsList.length,
      posts_data: postsList.slice(0,5)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error fetching news data" });
  }
});
router.get('/getnewsbynews', async (req, res) => {
const offset = parseInt(req.query.offset) || 0;
const limit = parseInt(req.query.limit) || 5;
  try {
    const filter = { posttype: "news" };
    const total = await NewsCollection.countDocuments(filter);
    const data = await NewsCollection.find(filter)
      .sort({ _id: -1 })
      .skip(offset)
      .limit(limit);
    return res.json({
      news_count: total,
      news_data: data
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error fetching news by posttype" });
  }
});
router.get('/getnewsbyposts', async (req, res) => {
const offset = parseInt(req.query.offset) || 0;
const limit = parseInt(req.query.limit) || 5;
  try {
    const filter = { posttype: "posts" };
    const total = await NewsCollection.countDocuments(filter);
    const data = await NewsCollection.find(filter)
      .sort({ _id: -1 })
      .skip(offset)
      .limit(limit);
    return res.json({
      posts_count: total,
      posts_data: data
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error fetching news by posttype" });
  }
});
router.post('/addnews',authenticateToken, authorizeRoles("admin"), async (req, res) => {
  const { newsID, content } = req.body;
  if (!newsID || !content) {
    return res.status(400).json({ error: "newsID and content are required." });
  }
  try {
    const exists = await NewsCollection.findOne({ newsID });
    if (exists) {
      return res.status(409).json({ error: "News with this newsID already exists." });
    }
    const newNews = await NewsCollection.create({
      newsID,
      content,
      posttype: "posts"
    });
    res.status(201).json({ message: "News added successfully.", news: newNews });
  } catch (err) {
    res.status(500).json({ error: "Failed to add news.", details: err.message });
  }
});
router.delete('/deletenews', authenticateToken, authorizeRoles("admin"), async (req, res) => {
  const { newsID } = req.body;

  if (!newsID) {
    return res.status(400).json({ error: "newsID is required." });
  }

  try {
    const deleted = await NewsCollection.findOneAndDelete({ newsID });

    if (!deleted) {
      return res.status(404).json({ error: "No news found with the given newsID." });
    }

    res.status(200).json({ message: "News deleted successfully.", news: deleted });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete news.", details: err.message });
  }
});
router.post('/editnews', authenticateToken, authorizeRoles("admin"), async (req, res) => {
  const { newsID, content } = req.body;

  if (!newsID || !content) {
    return res.status(400).json({ error: "newsID and content are required." });
  }

  try {
    const news = await NewsCollection.findOne({ newsID });

    if (!news) {
      return res.status(404).json({ error: "News with this newsID not found." });
    }

    news.content = content; // update the content
    await news.save(); // save the modified document

    res.status(200).json({ message: "News updated successfully.", news });
  } catch (err) {
    res.status(500).json({ error: "Failed to update news.", details: err.message });
  }
});
module.exports=router