//* Declare all the classes and modules
const express= require('express');
const users= require('../data/Users.json');
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
const NewsCollection= require('../schemas/news.js');
//*Add Data in Mongodb
   const addDataToMongodb = async() => {
    await UsersCollection.deleteMany();
    const hashedUsers = await Promise.all(
    users.map(async (user) => ({
      ...user,
      hasheduserpassword: await bcrypt.hash(user.password, 10)
    }))
  );
    await UsersCollection.insertMany(hashedUsers);
}
//addDataToMongodb();
//* Setup Different HTTPS methods
router.post('/signup', async (req, res) => {
  const { username, password,icon="", participation = [] } = req.body;
  const existing = await UsersCollection.findOne({ username });
  if (existing) return res.status(400).json({ error: 'User already exists' });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new UsersCollection({ username, password, hasheduserpassword:hashedPassword, role: 'user', icon,
    participation}); 
  await user.save();
  return res.json({ message: 'User registered', user: { username: user.username, role: user.role } });
})
router.post("/login",async(req,res)=>{
    const { username, password } = req.body;
  const user = await UsersCollection.findOne({ username });
  if (!user) return res.status(400).json({ error: 'User not found' });
  const isMatch = await bcrypt.compare(password, user.hasheduserpassword);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET,{ expiresIn: '1h' } );
  res.json({ token, username: user.username, role: user.role });
});
router.post('/forget',async(req,res)=>{
    const { username,password } = req.body;
    const person=await UsersCollection.findOne({username})
  if (!person) return res.status(400).json({ error: 'User not found' });
  const newpassword=await bcrypt.hash(password,10);
  person.password=password
  person.hasheduserpassword=newpassword
  await person.save()
  res.json({ message: 'Password Updated Successfully' });
})
router.get('/users', authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const usersPromise = UsersCollection.find().sort({ _id: 1 }).limit(5);
    const usersCountPromise = UsersCollection.countDocuments();
    const newsPromise = NewsCollection.find({ posttype: "posts" }).sort({ _id: -1 }).limit(5);
    const newsCountPromise = NewsCollection.countDocuments({ posttype: "posts" });
    const [user_data, total_users, news_data, total_news_posts] = await Promise.all([
      usersPromise,
      usersCountPromise,
      newsPromise,
      newsCountPromise
    ]);
    res.status(200).json({
      user_data,
      news_data,
      total_users,
      total_news_posts
    });
  } catch (error) {
    console.error("Error fetching users or news:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get('/getuserslist', authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const offset = parseInt(req.query.offset) || 0;
    const usersPromise = UsersCollection.find()
      .sort({ _id: 1 })
      .skip(offset)
      .limit(limit);
    const usersCountPromise = UsersCollection.countDocuments();
    const [user_data, total_users] = await Promise.all([
      usersPromise,
      usersCountPromise
    ]);
    res.status(200).json({
      user_data,
      total_users
    });
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get('/getpostslist', authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const offset = parseInt(req.query.offset) || 0;

    const postsPromise = NewsCollection.find({ posttype: "posts" })
      .sort({ _id: -1 })
      .skip(offset)
      .limit(limit);

    const postsCountPromise = NewsCollection.countDocuments({ posttype: "posts" });

    const [news_data, total_news_posts] = await Promise.all([
      postsPromise,
      postsCountPromise
    ]);

    res.status(200).json({
      news_data,
      total_news_posts
    });
  } catch (error) {
    console.error("Error fetching news posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get('/allusers', async (req, res) => {
  try {
  const users = await UsersCollection.find();
  const topUsers = users.filter((i)=>i.role!="admin").map(user => {
const totalScore = user.participation.length>0
? user.participation.reduce((acc, it) => acc + Number(it.score || 0), 0) : 0;
return { username: user.username,icon: user.icon,role:user.role,totalScore, participation: user.participation};
}).sort((a, b) => b.totalScore - a.totalScore).slice(0, 10);
    return res.json({ user_data: topUsers });
  } catch (err) {
    console.error("Error fetching top users:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get('/specificuser', async (req, res) => {
  const { id} = req.query;
  try {
  const users = await UsersCollection.find({ "participation.id": id });
const filteredUsers = users.map(user => {
const match = user.participation.find(p => p.id === id);
if (!match) return null; 
return { username: user.username,icon: user.icon, role:user.role,participation: [match]};}).filter(Boolean) .sort((a, b) => b.participation[0].score - a.participation[0].score) .slice(0, 10);
    return res.json(filteredUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get('/userprofile',async(req,res)=>{
  const {username}=req.query;
  const users=await UsersCollection.findOne({username})
  return res.json(users)
})
router.post('/adddetails',async(req,res)=>{
  try{
  const {username,icon}=req.body;
  const user=await UsersCollection.findOne({username})
  user.icon=icon;
  await user.save();
   res.status(200).json(user);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }

})
router.post('/addParticipation', async (req, res) => {
  const { username, participationEntry } = req.body;
  try {
    const user = await UsersCollection.findOne({ username });
    const tour=await TournamentsCollection.findOne({matchID:participationEntry.id})
    if (!user) return res.status(404).json({ message: "User not found" });
    if(tour.hasStarted==true || tour.winner!=""){
      return res.status(404).json({ message: "Tournament already started" })
    }
    user.participation.push(participationEntry);
    await user.save();
    res.status(200).json({ message: "Participation added", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Export
module.exports = router;