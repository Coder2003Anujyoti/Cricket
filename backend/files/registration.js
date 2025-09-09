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
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const TournamentsCollection= require('../schemas/tournaments');
const BackupCollection= require('../schemas/backup.js');
const { authenticateToken,authorizeRoles }=require("../middleware/authMiddleware.js")
app.use(express.json());
const UsersCollection= require('../schemas/users.js');
const NewsCollection= require('../schemas/news.js');
const ChallengesCollection= require('../schemas/challenges.js');
require("dotenv").config();
let otpstore={}
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
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // from .env
    pass: process.env.EMAIL_PASS, // from .env
  },
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save in uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
function generateOTP(length) {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz"; // numbers + lowercase letters
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return otp;
}
//* Setup Different HTTPS methods
router.post("/send-email", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image uploaded!" });
    }

    const { from, to, name, subject, message } = req.body;
    const person=await UsersCollection.findOne({username:name , email:to})
  if (!person) {
        if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting uploaded file:", err);
        else console.log("Uploaded file deleted successfully!");
      });
    }
    return res.status(404).json({ success: false, message: "Invalid Credentials" });
  }
  else{
    let mailOptions = {
      from,
      to,
      subject,
    html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 0; border: 1px solid #eee; border-radius: 10px; background: #fafafa; box-shadow: 0 4px 12px rgba(0,0,0,0.1);  background: #1e293b;">
  <h2 style="background: #00a3ee; color: #fff; text-align: center; margin: 0; padding: 20px; border-radius: 10px 10px 0 0; font-weight: 700; font-size: 22px;">
   📢 Message from Cricket Fever
  </h2>
  <div style="padding: 25px; text-align:start;">
    <p style="color: #fff; font-size: 17px; margin-bottom: 20px;">
      Hi <strong>${name}</strong>,
    </p>
    <p style="color: #fff; font-size: 16px; margin-bottom: 20px;">
    ${message}
    </p>
    <p style="color: #fff; font-size: 16px; margin-bottom: 30px;">
      Cheers,<br/>
      The <strong>Cricket Fever</strong> Team
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <img src="cid:image1" style="max-width: 90%; height: auto; border-radius: 12px; box-shadow: 0 6px 15px rgba(0,0,0,0.2);" alt="Welcome Image" />
    </div>
  </div>
  <hr style="border: none; border-top: 1px solid #ddd; margin: 0;" />
  <p style="font-size: 14px; color: #fff; text-align: center; padding: 12px; font-weight: 500;">
    Sent with ❤️ via <strong>Cricket Fever</strong>
  </p>
</div>
`,
      attachments: [
        {
          filename: req.file.originalname,
          path: req.file.path,
          cid: "image1", // same cid as in html img src
        },
      ],
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    if (info.accepted.length === 0) {
   console.log("Email not sent")
   return res.status(500).json({ message: 'Something went wrong' });
    }
    else{
      return res.json({ success: true, message: "Email sent successfully!" });
    }
    // Delete the uploaded file after sending
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting uploaded file:", err);
      else console.log("Uploaded file deleted successfully!");
    });
  }
  } catch (err) {
    console.error(err);
    // Delete uploaded file even on error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting uploaded file:", err);
        else console.log("Uploaded file deleted successfully!");
      });
    }
    res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});

router.post('/signup', async (req, res) => {
  try {
  const { username, password,email,icon="", participation = [] } = req.body;
  const existing = await UsersCollection.findOne({
  $or: [{ username }, { email }]
});
  if (existing) {
  if (existing.username === username) {
    return res.status(400).json({ error: "Username already exists" });
  }
  if (existing.email === email) {
    return res.status(400).json({ error: "Email already exists" });
  }
}
else{
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new UsersCollection({ username, email, password, hasheduserpassword:hashedPassword, role: 'user',total:0, icon,
    participation,rooms:[]}); 
  await user.save();
 res.json({ message: 'User registered', user: { username: user.username, role: user.role } });
 const mailOptions = {
      from:process.env.EMAIL_USER,
      to:email,
      subject:"Welcome Message",
      html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 0; border: 1px solid #eee; border-radius: 10px; background: #fafafa; box-shadow: 0 4px 12px rgba(0,0,0,0.1);  background: #1e293b;">
  <h2 style="background: #00a3ee; color: #fff; text-align: center; margin: 0; padding: 20px; border-radius: 10px 10px 0 0; font-weight: 700; font-size: 22px;">
    🎉 Welcome to Cricket Fever!
  </h2>
  <div style="padding: 25px; text-align:start;">
    <p style="color: #fff; font-size: 17px; margin-bottom: 20px;">
      Hi <strong>${username}</strong>,
    </p>
    <p style="color: #fff; font-size: 16px; margin-bottom: 20px;">
      Welcome to <strong>Cricket Fever</strong>! We’re excited to have you join our community.  
      Start exploring your account and enjoy all the features we’ve built for you.  
      If you need help, just reach out — we’re here anytime.
    </p>
    <p style="color: #fff; font-size: 16px; margin-bottom: 30px;">
      Cheers,<br/>
      The <strong>Cricket Fever</strong> Team
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <img src="cid:image1" style="max-width: 90%; height: auto; border-radius: 12px; box-shadow: 0 6px 15px rgba(0,0,0,0.2);" alt="Welcome Image" />
    </div>
  </div>
  <hr style="border: none; border-top: 1px solid #ddd; margin: 0;" />
  <p style="font-size: 14px; color: #fff; text-align: center; padding: 12px; font-weight: 500;">
    Sent with ❤️ via <strong>Cricket Fever</strong>
  </p>
</div>
`,
      attachments: [
        {
          filename: "1.jpg",
          path: "./images/1.jpg", // Attach from images folder
          cid: "image1", // same cid as in HTML
        },
      ],
    };

    // Fire email in background
    transporter
      .sendMail(mailOptions)
      .then((info) => console.log("Email sent:", info.response))
      .catch((err) => console.error("Error sending email:", err));
}
}
catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
})
router.post("/request-otp",async(req,res)=>{
  try{
const { email,username } = req.body;
const person=await UsersCollection.findOne({username , email})
  if (!person) return res.status(404).json({ error: 'User not found' });
else{
const otp = generateOTP(6); 
const expiry = Date.now() + 300000; 
otpstore[email] = { otp, expiry };
const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Cricket Fever",
    html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 0; border: 1px solid #eee; border-radius: 10px; background: #1e293b;">
  <h2 style="background: #00a3ee; color: #fff; text-align: center; margin: 0; padding: 20px; border-radius: 10px 10px 0 0; font-weight: 700; font-size: 22px;">
    🔐 Your OTP for Cricket Fever
  </h2>
  <div style="padding: 25px; text-align:start;">
    <p style="color: #fff; font-size: 17px; margin-bottom: 20px;">
      Hi <strong>${username}</strong>,
    </p>
    <p style="color: #fff; font-size: 16px; margin-bottom: 20px;">
      Use the following OTP to verify your email. This OTP is valid for 5 minutes.
    </p>
    <h3 style="color: #fff; text-align: center; font-size: 28px; margin-bottom: 30px;">${otp}</h3>
    <div style="text-align: center; margin: 20px 0;">
      <img src="cid:image1" style="max-width: 90%; height: auto; border-radius: 12px; box-shadow: 0 6px 15px rgba(0,0,0,0.2);" alt="OTP Image" />
    </div>
    <p style="color: #fff; font-size: 16px;">
      Cheers,<br/>
      The <strong>Cricket Fever</strong> Team
    </p>
  </div>
  <hr style="border: none; border-top: 1px solid #ddd; margin: 0;" />
  <p style="font-size: 14px; color: #fff; text-align: center; padding: 12px; font-weight: 500;">
    Sent with ❤️ via <strong>Cricket Fever</strong>
  </p>
</div>
`,
    attachments: [
      {
        filename: "1.jpg",
        path: "./images/1.jpg", // image path
        cid: "image1", // match the src in HTML
      },
    ],
  };
  const info= await transporter.sendMail(mailOptions)
if (info.accepted.length === 0) {
    console.log("OTP not sent")
   return res.status(500).json({ message: 'Something went wrong' });
    }
  else{
    return res.json({ message: 'OTP sent successfully' });
  }
}
}
catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
})
router.post("/login",async(req,res)=>{
    const { username, password } = req.body;
  const user = await UsersCollection.findOne({ username });
  if (!user) return res.status(400).json({ error: 'User not found' });
  const isMatch = await bcrypt.compare(password, user.hasheduserpassword);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET,{ expiresIn: '1h' } );
  res.json({ token, username: user.username, role: user.role,password:user.password });
});
router.delete("/deleteaccount", async (req, res) => {
  try {
    const { username, password } = req.body;
    const [user,backs] = await Promise.all([ UsersCollection.findOne({ username }),
     BackupCollection.findOne({username})
    ])
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.hasheduserpassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if(!backs){
    await UsersCollection.deleteOne({ username });
    }
    else{
      await Promise.all([
      UsersCollection.deleteOne({ username }),
      BackupCollection.deleteOne({ username })
    ]);
    }
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
router.post('/forget',async(req,res)=>{
    const { username,email,otp,password} = req.body;
    const person=await UsersCollection.findOne({username , email})
  if (!person) return res.status(400).json({ error: 'User not found' });
  const record = otpstore[email];
  if (!record) return res.status(400).json({ error: "No OTP found" });
  if (Date.now() > record.expiry) {
    delete otpstore[email];
    return res.status(400).json({ error: "OTP expired" });
  }
  if (otp !== record.otp) return res.status(400).json({ error: "Invalid OTP" });
  delete otpstore[email];
  const newpassword=await bcrypt.hash(password,10);
   await UsersCollection.updateOne(
      { email: person.email }, 
      { 
        $set: { 
          password: password, 
          hasheduserpassword: newpassword
        } 
      }
    );
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
router.get("/allusers", async (req, res) => {
  try {
    // Fetch tournaments and challenges
    const [tournaments, challenges, users] = await Promise.all([
      TournamentsCollection.find({}, { matchID: 1 }),
      ChallengesCollection.find({}, { challengeID: 1 }),
      UsersCollection.find({ role: { $ne: "admin" } }) // exclude admins directly
    ]);
    const validMatchIds = [
      ...tournaments.map(t => t.matchID),
      ...challenges.map(c => c.challengeID),
    ];
    const processedUsers = users.map(user => {
      const totalScore = (user.participation || [])
        .filter(p => validMatchIds.includes(p.id))
        .reduce((sum, p) => sum + (p.score || 0), 0);
      return {
        username: user.username,
        icon: user.icon,
        role: user.role,
        participation: user.participation,
        total: user.total,
        totalScore
      };
    });
    const topUsers = processedUsers
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 5);

    return res.json({ user_data: topUsers });
  } catch (err) {
    console.error("Error fetching top users:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get('/specificuser', async (req, res) => {
  const { id, name } = req.query;

  if (!id || !name) {
    return res.status(400).json({ error: "Both 'id' and 'name' query parameters are required." });
  }

  try {
    const users = await UsersCollection.find({ "participation.id": id });

    const processedUsers = await Promise.all(
      users.map(async (user) => {
        const match = user.participation.find(p => p.id === id);
        if (!match) return null;
        return {
          username: user.username,
          icon: user.icon,
          role: user.role,
          participation: [match]
        };
      })
    );

    let finalUsers = processedUsers
      .filter(Boolean)
      .sort((a, b) => b.participation[0].score - a.participation[0].score)
      .slice(0, 5); // top 5

    const alreadyIncluded = finalUsers.some(user => user.username === name);

    if (!alreadyIncluded) {
      const namedUserDoc = await UsersCollection.findOne({ username: name, "participation.id": id });

      if (namedUserDoc) {
        const match = namedUserDoc.participation.find(p => p.id === id);
        if (match) {
          const namedUser = {
            username: namedUserDoc.username,
            icon: namedUserDoc.icon,
            role: namedUserDoc.role,
            participation: [match],
          };
          finalUsers.push(namedUser); // add at end if not in top 5
        }
      }
    }

    return res.json(finalUsers);

  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get('/userparticipation', async (req, res) => {
  const { username, matchID } = req.query;

  if (!username || !matchID) {
    return res.status(400).json({ error: "Both 'username' and 'matchID' query parameters are required." });
  }
  try {
    const user = await UsersCollection.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    return res.json([user]); // wrapped in array
  } catch (error) {
    console.error("Error fetching user participation:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get('/userprofile',async(req,res)=>{
  const {username}=req.query;
  const users=await UsersCollection.findOne({username})
  const participationArray = Array.isArray(users.participation) ? users.participation : [];
  users.participation = participationArray.slice(-5);
  return res.json(users)
})
router.get('/userprofilehistory', async (req, res) => {
  const { username, limit, offset } = req.query;
  const user = await UsersCollection.findOne({ username });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const bio = {
    username: user.username,
    icon: user.icon,
    role: user.role,
    total: user.total
  };

  const participationArray = Array.isArray(user.participation) ? user.participation.slice().reverse(): [];
  const start = parseInt(offset) || 0;
  const end = start + (parseInt(limit) || 5);
  const parray = participationArray.slice(start, end);
  const len = participationArray.length;

  return res.json({
    biometrics: bio,
    participate: parray,
    arraylen: len
  });
});
router.post('/adddetails',async(req,res)=>{
  try{
  const {username,icon}=req.body;
  const user=await UsersCollection.findOne({username})
  user.icon=icon;
  const participationArray = Array.isArray(user.participation) ? user.participation : [];
  user.participation = participationArray.slice(-5);
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
const [user, tour] = await Promise.all([
UsersCollection.findOne({ username }),
TournamentsCollection.findOne({ matchID: participationEntry.id })
]);
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
router.get("/getprofilerooms", async (req, res) => {
  try {
    const  username  = req.query.username;
    if (!username) {
      return res.status(400).json({ error: "username is required" });
    }
    const user = await UsersCollection.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
  const datum={
    username:user.username,
    password:user.password,
    icon:user.icon,
    total:user.total,
    rooms:user.rooms
  }
  return  res.json(datum);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/addprofilerooms", async (req, res) => {
  try {
    const { player, computer, playerteam, computerteam } = req.body;
    if (!player || !computer || !playerteam || !computerteam) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const baseRoom = {
      player,
      computer,
      playerteam,
      computerteam,
      created: player
    };
    const [playerUser, computerUser] = await Promise.all([
      UsersCollection.findOne({ username: player }),
      UsersCollection.findOne({ username: computer })
    ]);
    if (!playerUser || !computerUser) {
      return res.status(404).json({ error: "One or both users not found" });
    }
    const roomExists = (user, room) =>
      user.rooms.some(
        r =>
          r.player === room.player &&
          r.computer === room.computer &&
          r.playerteam === room.playerteam &&
          r.computerteam === room.computerteam
      );
    let added = false;
    if (!roomExists(playerUser, baseRoom)) {
      playerUser.rooms.unshift(baseRoom);
      if (playerUser.rooms.length > 5) {
        playerUser.rooms.pop();
      }
      added = true;
    }
    if (!roomExists(computerUser, baseRoom)) {
      computerUser.rooms.unshift(baseRoom);
      if (computerUser.rooms.length > 5) {
        computerUser.rooms.pop();
      }
      added = true;
    }
    await Promise.all([playerUser.save(), computerUser.save()]);
    if (added) {
      return res.json({ message: "Room added successfully" });
    } else {
      return res.json({ message: "Room already exists, not added" });
    }
  } catch (err) {
    console.error("Error adding room:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/deleteprofilerooms", async (req, res) => {
  try {
    const { player, computer, playerteam, computerteam } = req.body;
    if (!player || !computer || !playerteam || !computerteam) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const [playerUser, computerUser] = await Promise.all([
      UsersCollection.findOne({ username: player }),
      UsersCollection.findOne({ username: computer })
    ]);
    if (!playerUser) {
      return res.status(404).json({ error: "Player not found" });
    }
    const newPlayerRooms = playerUser.rooms.filter(
      r =>
        !(
          r.player === player &&
          r.computer === computer &&
          r.playerteam === playerteam &&
          r.computerteam === computerteam
        )
    );
    const playerChanged = newPlayerRooms.length !== playerUser.rooms.length;
    if (playerChanged) playerUser.rooms = newPlayerRooms;
    let computerChanged = false;
    if (computerUser) {
      const newComputerRooms = computerUser.rooms.filter(
        r =>
          !(
            r.player === player &&
            r.computer === computer &&
            r.playerteam === playerteam &&
            r.computerteam === computerteam
          )
      );
      computerChanged = newComputerRooms.length !== computerUser.rooms.length;
      if (computerChanged) computerUser.rooms = newComputerRooms;
    }
    const saveOps = [];
    if (playerChanged) saveOps.push(playerUser.save());
    if (computerChanged) saveOps.push(computerUser.save());
    await Promise.all(saveOps);

    if (!playerChanged && !computerChanged) {
      return res.json({ message: "Room not found, nothing deleted" });
    }

    return res.json({ message: "Room deleted successfully" });
  } catch (err) {
    console.error("Error deleting room:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get('/userprofileoldhistory', async (req, res) => {
  const { username, limit, offset } = req.query;
  const user = await BackupCollection.findOne({ username });
  if (!user) {
    return res.json({
      biometrics: {},
      participate: [],
      arraylen: 0
    });
  }
  const bio = {
    username: user.username
  };
  const participationArray = Array.isArray(user.participation) ? user.participation.slice().reverse() : [];
  const start = parseInt(offset) || 0;
  const end = start + (parseInt(limit) || 5);
  const parray = participationArray.slice(start, end);
  const len = participationArray.length;
  return res.json({
    biometrics: bio,
    participate: parray,
    arraylen: len
  });
});
//Export
module.exports = router;