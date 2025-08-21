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
const BackupCollection= require('../schemas/backup.js');
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
  const user = new UsersCollection({ username, password, hasheduserpassword:hashedPassword, role: 'user',total:0, icon,
    participation,rooms:[]}); 
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
    const [tournaments, users] = await Promise.all([ TournamentsCollection.find(),  
      UsersCollection.find()
    ]);
 const validMatchIds = tournaments.map(t => t.matchID);
    const topUsers = users
      .filter(u => u.role !== "admin")
      .map(user => {
        const totalScore = user.participation.length > 0
          ? user.participation.reduce((acc, it) => {
              return validMatchIds.includes(it.id)
                ? acc + Number(it.score || 0)
                : acc;
            }, 0)
          : 0;

        return {
          username: user.username,
          icon: user.icon,
          role: user.role,
          totalScore,
          participation: user.participation,
          total: user.total
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 5);

    // 4️⃣ Send leaderboard
    return res.json({ user_data: topUsers });

  } catch (err) {
    console.error("Error fetching top users:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get('/getrooms',async(req,res)=>{
  
})
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
    if (!playerUser || !computerUser) {
      return res.status(404).json({ error: "One or both users not found" });
    }
    const beforePlayerCount = playerUser.rooms.length;
    playerUser.rooms = playerUser.rooms.filter(
      r =>
        !(
          r.player === player &&
          r.computer === computer &&
          r.playerteam === playerteam &&
          r.computerteam === computerteam
        )
    );
    const afterPlayerCount = playerUser.rooms.length;
    const beforeComputerCount = computerUser.rooms.length;
    computerUser.rooms = computerUser.rooms.filter(
      r =>
        !(
          r.player === player &&
          r.computer === computer &&
          r.playerteam === playerteam &&
          r.computerteam === computerteam
        )
    );
    const afterComputerCount = computerUser.rooms.length;
    await Promise.all([playerUser.save(), computerUser.save()]);
    if (
      beforePlayerCount === afterPlayerCount &&
      beforeComputerCount === afterComputerCount
    ) {
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