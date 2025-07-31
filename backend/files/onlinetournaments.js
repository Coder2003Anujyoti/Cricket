const express= require('express');
const tours=require("../data/Tournaments.json")
const cors=require('cors');
const app = express();
const router = express.Router();
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const TournamentsCollection= require('../schemas/tournaments');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken,authorizeRoles }=require("../middleware/authMiddleware.js")
   const addDataToMongodb = async() => {
    await TournamentsCollection.deleteMany();
    await TournamentsCollection.insertMany(tours);
}
addDataToMongodb();
router.get('/gettournaments',async(req,res)=>{
  const datas=await TournamentsCollection.find()
  const data=datas.reverse()
  return res.json({tournaments_data:data})
})
router.get('/specifictournament',async(req,res)=>{
  const {id}=req.query
  const data=await TournamentsCollection.find({matchID:id})
  return res.json({tournaments_data:data})
})
router.post('/addtournament',authenticateToken, authorizeRoles("admin"),async(req,res)=>{
const { name, playerteam, computerteam, matchID } = req.body;
  if (!name || !playerteam || !computerteam || !matchID) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const exists = await TournamentsCollection.findOne({ name, playerteam, computerteam, matchID });
if (exists) {
  return res.status(409).json({ error: "Tournament already exists." });
}
const today = new Date(); 
const tomorrow = new Date(); 
tomorrow.setDate(today.getDate() + 1);
const time=tomorrow.toDateString();
    const newTournament = new TournamentsCollection({
      name,
      playerteam,
      computerteam,
      matchID,
      time
    });
    await newTournament.save();
    res.status(201).json({ message: "Tournament added successfully", tournament: newTournament });
  } catch (error) {
    console.error("❌ Error adding tournament:", error);
    res.status(500).json({ error: "Server error" });
  }
})
module.exports = router;