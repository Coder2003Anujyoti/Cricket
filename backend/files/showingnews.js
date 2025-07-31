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
addDataToMongodb();
router.get('/getnews',async(req,res)=>{
  const datas=await NewsCollection.find()
  const data=datas.reverse()
  return res.json({news_data:data})
})
module.exports=router