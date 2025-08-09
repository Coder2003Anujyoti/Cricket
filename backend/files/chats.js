const express= require('express');
const data= require('../data/Players.json');
const history=require('../data/Details.json');
const result=require('../data/Results.json');
const cors=require('cors');
const app = express();
const router = express.Router();
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const { GFGCollection, Collection, ResultCollection }= require('../schemas/index.js');
const TournamentsCollection= require('../schemas/tournaments');
const NewsCollection= require('../schemas/news.js');
const UsersCollection= require('../schemas/users.js');
router.post('/chat', async (req, res) => {
const question=req.body.question.toLowerCase().trim().replace(/\s+/g, " ").split(" ");
if ((question.some(word => word.includes("news")) && question.some(word => word.includes("latest"))) || (question.some(word => word.includes("news")) && question.some(word => word.includes("latest")))) {
    const news = await NewsCollection.findOne({"posttype":"news"}).sort({ "_id": -1 });
    if (!news) {
      return res.json({ message: "Sorry I am unable to find any news", type: "error", role: "ai" });
    }
    return res.json({ ...news, type: "news", role: "ai" });
  }
  else if (question.some(word => word.includes("news"))) {
    const capitalWords = question.map(
  word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
);
  let newsMatch;
if (capitalWords.length === 2) {
  newsMatch = await NewsCollection.findOne({
    posttype: "news",
    $or: [
      { playerteam: capitalWords[1] },
      { computerteam: capitalWords[1] }
    ]
  }).sort({ _id: -1 });
} else if (capitalWords.length >= 3) {
  newsMatch = await NewsCollection.findOne({
    posttype: "news",
    $or: [
      { playerteam: capitalWords[1], computerteam: capitalWords[2] },
      { playerteam: capitalWords[2], computerteam: capitalWords[1] }
    ]
  }).sort({ _id: -1 });
}
if (!newsMatch) {
      return res.json({ message: "Sorry I am unable to find any news", type: "error", role: "ai" });
    }
    return res.json({ ...newsMatch, type: "news", role: "ai" });
  } 
  else if ((question.some(word => word.includes("tournament")) && question.some(word => word.includes("latest"))) || (question.some(word => word.includes("tournaments")) && question.some(word => word.includes("latest")))) {
    const tours = await TournamentsCollection.findOne({"winner":{$ne:""}}).sort({ "_id": -1 });
    if (!tours) {
      return res.json({ message: "Sorry I am unable to find any tournaments", type: "error", role: "ai" });
    }
    return res.json({ ...tours, type: "tournaments", role: "ai" });
  }
  else if (question.some(word => word.includes("tournament")) || question.some(word => word.includes("tournaments")) ) {
    const capitalWords = question.map(
    word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  const tournamentMatch = await TournamentsCollection.findOne({
    winner: { $ne: "" },
    $or: [
      { playerteam: { $in: capitalWords } },
      { computerteam: { $in: capitalWords } }
    ]
  }).sort({ _id: -1 });

  if (!tournamentMatch) {
    return res.json({ message: "Sorry I am unable to find any tournaments", type: "error", role: "ai" });
  }

  return res.json({ ...tournamentMatch, type: "tournaments", role: "ai" });
  }
  
  else {
    const [players, teams] = await Promise.all([
      GFGCollection.find(),
      Collection.find()
    ]);
const playerMatchCounts = players
  .filter(p => p.fullname) // Filter only players with valid fullname
  .map(p => {
    const lowerName = p.fullname.toLowerCase();
    const matchCount = question.filter(word => lowerName.includes(word)).length;
    return { player: p, matchCount };
  });

const bestMatch = playerMatchCounts.reduce((best, current) =>
  current.matchCount > (best?.matchCount || 0) ? current : best, null
);

const player = bestMatch?.player;
const team = teams.find(t =>
  (t.name || t.teamid) &&
  question.some(word =>
    (t.name && t.name.toLowerCase().includes(word)) ||
    (t.teamid && t.teamid.toLowerCase().includes(word))
  )
);


    if (player && question.some(word => word.includes("player"))) {
      return res.json({ ...player, type: "player", role: "ai" });
    } else if (team && question.some(word => word.includes("team"))) {
      return res.json({ ...team, type: "team", role: "ai" });
    } else {
    if(question.some(word => word.includes("about"))){
      return res.json({
        message: "Hello, I am Cricko an AI agent! Ask me about players, teams, tournaments, or latest news.",
        type: "about",
        role: "ai"
      });
    }
    else{
      return res.json({ message: "Sorry I am unable to recognize your text", type: "error", role: "ai" });
    }
    }
  }
});
module.exports=router;