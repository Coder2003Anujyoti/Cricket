const express= require('express');
const chs= require('../data/Challenges.json');
const cors=require('cors');
const app = express();
const router = express.Router();
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TournamentsCollection= require('../schemas/tournaments');
const { authenticateToken,authorizeRoles }=require("../middleware/authMiddleware.js")
app.use(express.json());
const UsersCollection= require('../schemas/users.js');
const ChallengesCollection= require('../schemas/challenges.js');
const NewsCollection= require('../schemas/news.js');
//*Add Data in Mongodb
   const addDataToMongodb = async() => {
    await ChallengesCollection.deleteMany();
    await ChallengesCollection.insertMany(chs);
}
//addDataToMongodb();
router.get('/getadminchallenges',authenticateToken, authorizeRoles("admin"),async(req,res)=>{
  const offset = parseInt(req.query.offset) || 0;
const limit = parseInt(req.query.limit) || 5;
try {
const total = await ChallengesCollection.countDocuments();
const data = await ChallengesCollection.find().sort({ _id: 1 }).skip(offset).limit(limit);
res.json({ total,challenges_data: data,});
  } catch (err) {
    res.status(500).json({ error: "Error fetching Challenges" });
  }
})
router.post('/addchallenge',authenticateToken, authorizeRoles("admin"),async(req,res)=>{
const {name,challengeID, playerteam, computerteam,time} = req.body;
const teamicons=[{team:"Csk",image:"Csk/Gaikwad.webp"},{team:"Dc",image:"Dc/Pant.webp"},{team:"Kkr",image:"Kkr/S.Iyer.webp"},{team:"Mi",image:"Mi/Hardik.webp"},{team:"Rr",image:"Rr/Samson.webp"},{team:"Gt",image:"Gt/Gill.webp"},{team:"Pbks",image:"Pbks/Dhawan.webp"},{team:"Rcb",image:"Rcb/Duplesis.webp"},{team:"Srh",image:"Srh/Cummins.webp"},{team:"Lsg",image:"Lsg/KL Rahul.webp"}]
const playerimage=teamicons.filter((i)=>i.team==playerteam)[0].image
const computerimage=teamicons.filter((i)=>i.team==computerteam)[0].image
if (!challengeID || !playerteam || !computerteam || !name || !time) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const exists = await ChallengesCollection.findOne({ challengeID, playerteam, computerteam });
if (exists) {
  return res.status(409).json({ error: "Challenge already exists." });
}
    const newChallenge = new ChallengesCollection({
      name,
      challengeID,
      playerteam,
      computerteam,
      playerimage,
      computerimage,
      time
    });
    await newChallenge.save();
    res.status(201).json({ message: "Challenge added successfully", challenge: newChallenge });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
})
router.delete('/deletechallenge', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { challengeID } = req.body;
  if (!challengeID) {
    return res.status(400).json({ error: "challengeID is required." });
  }
  try {
    const [deletedChallenge] = await Promise.all([
      ChallengesCollection.findOneAndDelete({ challengeID })
    ]);
    if (!deletedChallenge) {
      return res.status(404).json({ error: "Challenge not found." });
    }
    res.status(200).json({
      message: "Challenge deleted successfully.",
      deleted_challenge: deletedChallenge
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
router.get('/getchallenges',async(req,res)=>{
  const offset = parseInt(req.query.offset) || 0;
const limit = parseInt(req.query.limit) || 5;
try {
const total = await ChallengesCollection.countDocuments();
const data = await ChallengesCollection.find().sort({ _id: -1 }).skip(offset).limit(limit);
res.json({ total,challenges_data: data,});
  } catch (err) {
    res.status(500).json({ error: "Error fetching Challenges" });
  }
})
router.post('/addparticipatechallenge', async (req, res) => {
  const {id,username,points} = req.body;
  try {
    const [user,challenge] = await Promise.all([
  UsersCollection.findOne({ username }),
  ChallengesCollection.findOne({ challengeID:id })
]);
 if(!challenge) return res.status(404).json({ message: "Challenge not found" });
    if (!user) return res.status(404).json({ message: "User not found" });
  const alreadyParticipated = user.participation.some(
      (p) => p.id === challenge.challengeID
    );

    if (alreadyParticipated) {
      return res.status(400).json({ message: "User already participated in this challenge" });
    }
  user.total+=points
  user.participation.push({
    id:challenge.challengeID,
   playerteam:challenge.playerteam,
  computerteam:challenge.computerteam,
  matchname:challenge.name,
  matchtime:challenge.time,
      score: 0
  });
    await user.save();
    res.status(200).json({ message: "Participation added", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;