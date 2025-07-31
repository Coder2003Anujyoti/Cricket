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
router.get('/getnews',async(req,res)=>{
  const datas=await NewsCollection.find()
  const data=datas.reverse()
  return res.json({news_data:data})
})
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
module.exports=router