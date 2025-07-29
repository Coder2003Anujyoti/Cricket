const TournamentsCollection = require('../schemas/tournaments');
const UsersCollection=require('../schemas/users');
const NewsCollection=require("../schemas/news")
const adminSockets = new Map();
let  store = [
  {
    id: "",
    start: false,
    playerrun: 0,
    computerrun: 0,
    playerwicket: 0,
    computerwicket: 0,
    overs: "",
    target: 0,
    winner: "",
    msg: ""
  }
];
let gamestarted=false
module.exports = (io, socket) => {
  socket.on("latejoin", () => {
  socket.emit("storelate", store[0]); // send latest snapshot
});
socket.on("start", async ({ id, started }) => {
try { const tour = await TournamentsCollection.findOne({ matchID: id });
if (!tour) return console.log("Tournament not found for matchID:", id);
gamestarted=true
adminSockets.set(id, socket.id); 
tour.hasStarted = started;
 await tour.save();
 store[0].id=id;
 store[0].start=started
console.log(`Tournament ${id} started status: ${started}`);
io.emit("gamestart", {
        id: store[0].id,
        start:store[0].start,
      });
    } catch (error) {
      console.error("Error starting tournament:", error.message);
    }
  });
socket.on("beforetoss",async({id,started,msg})=>{
  try { const tour = await TournamentsCollection.findOne({ matchID: id });
if (!tour) return console.log("Tournament not found for matchID:", id);
tour.hasStarted = started;
tour.message=msg;
 await tour.save();
 store[0].start=started
 store[0].msg=msg
console.log(`Tournament ${id} started status: ${started}`);
io.emit("gamebeforetoss", {
        id: tour.matchID,
        start: tour.hasStarted,
        msg: tour.message
      });
    } catch (error) {
      console.error("Error starting tournament:", error.message);
    }
})
socket.on("play",async({id,started,playerrun,computerrun,playerwicket,computerwicket,overs})=>{
  try { const tour = await TournamentsCollection.findOne({ matchID: id });
if (!tour) return console.log("Tournament not found for matchID:", id);
tour.hasStarted = started;
tour.playerrun=playerrun
tour.computerrun=computerrun
tour.playerwicket=playerwicket
tour.computerwicket=computerwicket
tour.overs=overs
 await tour.save();
 store[0].start=started
 store[0].playerrun=playerrun
 store[0].computerrun=computerrun
store[0].playerwicket=playerwicket
store[0].computerwicket=computerwicket
store[0].overs=overs
console.log(`Tournament ${id} started status: ${started}`);
io.emit("gameplay", {
        id: tour.matchID,
        start: tour.hasStarted,
        playerrun: tour.playerrun,
computerrun: tour.computerrun,
playerwicket: tour.playerwicket,
computerwicket: tour.computerwicket,
overs: tour.overs
      });
    } catch (error) {
      console.error("Error starting tournament:", error.message);
    }
})
socket.on("addtarget",async({id,started,playerrun,computerrun,playerwicket,computerwicket,overs,target})=>{
  try { const tour = await TournamentsCollection.findOne({ matchID: id });
if (!tour) return console.log("Tournament not found for matchID:", id);
tour.hasStarted = started;
tour.playerrun=playerrun
tour.computerrun=computerrun
tour.playerwicket=playerwicket
tour.computerwicket=computerwicket
tour.overs=overs
tour.target=target
 await tour.save();
 store[0].start=started
 store[0].playerrun=playerrun
 store[0].computerrun=computerrun
store[0].playerwicket=playerwicket
store[0].computerwicket=computerwicket
store[0].overs=overs
store[0].target=target
console.log(`Tournament ${id} started status: ${started}`);
io.emit("gameaddtarget", {
        id: tour.matchID,
        start: tour.hasStarted,
        playerrun: tour.playerrun,
computerrun: tour.computerrun,
playerwicket: tour.playerwicket,
computerwicket: tour.computerwicket,
overs: tour.overs,
target: tour.target
      });
    } catch (error) {
      console.error("Error starting tournament:", error.message);
    }
})
socket.on("playcomputer",async({id,started,computerrun,computerwicket,overs})=>{
  try { const tour = await TournamentsCollection.findOne({ matchID: id });
if (!tour) return console.log("Tournament not found for matchID:", id);
tour.hasStarted = started;
tour.computerrun=computerrun
tour.computerwicket=computerwicket
tour.overs=overs
 await tour.save();
 store[0].start=started
 store[0].computerrun=computerrun
store[0].computerwicket=computerwicket
store[0].overs=overs
console.log(`Tournament ${id} started status: ${started}`);
io.emit("gameplaycomputer", {
        id: tour.matchID,
        start: tour.hasStarted,
computerrun: tour.computerrun,
computerwicket: tour.computerwicket,
overs: tour.overs
      });
    } catch (error) {
      console.error("Error starting tournament:", error.message);
    }
})
socket.on("playplayer",async({id,started,playerrun,playerwicket,overs})=>{
  try { const tour = await TournamentsCollection.findOne({ matchID: id });
if (!tour) return console.log("Tournament not found for matchID:", id);
tour.hasStarted = started;
tour.playerrun=playerrun
tour.playerwicket=playerwicket
tour.overs=overs
 await tour.save();
 store[0].start=started
 store[0].playerrun=playerrun
store[0].playerwicket=playerwicket
store[0].overs=overs
console.log(`Tournament ${id} started status: ${started}`);
io.emit("gameplayplayer", {
        id: tour.matchID,
        start: tour.hasStarted,
playerrun: tour.playerrun,
playerwicket: tour.playerwicket,
overs: tour.overs
      });
    } catch (error) {
      console.error("Error starting tournament:", error.message);
    }
})
socket.on("result",async({id,started,playerrun,computerrun,playerwicket,computerwicket,overs,winner})=>{
  try { const tour = await TournamentsCollection.findOne({ matchID: id });
if (!tour) return console.log("Tournament not found for matchID:", id);
tour.computerrun=computerrun
tour.computerwicket=computerwicket
tour.overs=overs
tour.winner=winner
tour.message=""
tour.hasStarted=false
tour.target=0;
 await tour.save();
 store[0].start=!started
 store[0].computerrun=computerrun
store[0].computerwicket=computerwicket
store[0].overs=overs
store[0].winner=winner
store[0].msg=""
store[0].target=0
console.log(`Tournament ${id} started status: ${started}`);
io.emit("gameresult", {
        id: tour.matchID,
        start: tour.hasStarted,
computerrun: tour.computerrun,
computerwicket: tour.computerwicket,
overs: tour.overs,
winner: tour.winner,
target: tour.target,
start: tour.hasStarted,
msg: tour.message
      });
    } catch (error) {
      console.error("Error starting tournament:", error.message);
    }
})
socket.on("cresult",async({id,started,playerrun,playerwicket,overs,winner})=>{
  try { const tour = await TournamentsCollection.findOne({ matchID: id });
if (!tour) return console.log("Tournament not found for matchID:", id);
tour.playerrun=playerrun
tour.playerwicket=playerwicket
tour.overs=overs
tour.winner=winner
tour.message=""
tour.hasStarted=false
tour.target=0;
 await tour.save();
 store[0].start=false
 store[0].playerrun=playerrun
store[0].playerwicket=playerwicket
store[0].overs=overs
store[0].winner=winner
store[0].msg=""
store[0].target=0
console.log(`Tournament ${id} started status: ${started}`);
io.emit("gamecresult", {
        id: tour.matchID,
        start: tour.hasStarted,
playerrun: tour.playerrun,
playerwicket: tour.playerwicket,
overs: tour.overs,
winner: tour.winner,
target: tour.target,
start: tour.hasStarted,
msg: tour.message
      });
    } catch (error) {
      console.error("Error starting tournament:", error.message);
    }
})
socket.on('adddata',async({id,players})=>{
  const tour = await TournamentsCollection.findOne({ matchID:id });
  const users=await UsersCollection.find({"participation.id":id})
  console.log(users)
  await Promise.all(users.map(async(user)=>{
    let modified=false
    const updated=user.participation.map((p)=>{
      if(p.id==id){
        p.players=players;
        const selectedNames = p.selected.map(sel => sel.name);
const score = players.reduce((acc, player, index) => {
  return selectedNames.includes(player.name)
    ? acc + (20 - index) * 10
    : acc;
}, 0);
        console.log(score)
        p.score=score
        modified=true
      }
      return p
    })
    if(modified){
    console.log(user)
    user.markModified("participation")
    await user.save()
    }
  }))
  tour.players=players;
  const text=[`What a thriller between ${tour.playerteam} and ${tour.computerteam}!`,
    `A match-winning knock from ${players[0].name}, truly deserving the MoTM!`,
  `Masterclass by ${players[0].name} what a performance!`,`${players[0].name}'s all-round brilliance lights up the game!`]
  const random_text=text[Math.floor(Math.random()*text.length)];
  await NewsCollection.create({
    newsID:tour.matchID,
    playerteam:tour.playerteam,
    computerteam:tour.computerteam,
    image:players[0].image,
    content:random_text
  })
  await tour.save()
store = [
  {
    id: "",
    start: false,
    playerrun: 0,
    computerrun: 0,
    playerwicket: 0,
    computerwicket: 0,
    overs: "",
    target: 0,
    winner: "",
    msg: ""
  }
];
  gamestarted=false
})
};