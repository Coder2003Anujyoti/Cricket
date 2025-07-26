const { v4: uuidv4 } = require('uuid');
const GFGCollection=require('../schemas/players');
const rooms={}
const turn={}
const game={}
module.exports=(io,socket)=>{
  socket.on('joinRoom', (name) => {
    let assignedRoom=null;
    for(const roomID in rooms){
      if(rooms[roomID].length<2){
        assignedRoom=roomID;
        break;
      }
    }
    if(!assignedRoom){
      assignedRoom=uuidv4();
      rooms[assignedRoom]=[]
    }
    rooms[assignedRoom].push({ id: socket.id, name, choice:0 , team:"",player:""});
    socket.join(assignedRoom);

    console.log(`${name} joined room ${assignedRoom}`);
  if (rooms[assignedRoom].length === 1) {
      io.to(assignedRoom).emit('wait', 'Waiting for another player...');
    }
    if (rooms[assignedRoom].length === 2) {
      const players=rooms[assignedRoom]
       turn[assignedRoom]=Math.floor(Math.random()*2);
      const teams=["Mi","Csk","Rr","Kkr","Gt","Pbks","Rcb","Lsg","Dc","Srh"];
      const shuffled = [...teams];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const groupA = shuffled.slice(0, 5);
  const groupB = shuffled.slice(5);
       io.to(players[turn[assignedRoom]].id).emit('selectteam',groupA)
     io.to(players[(turn[assignedRoom]+1)%2].id).emit('selectteam',groupB)
    }
    socket.roomId = assignedRoom;
  })
  socket.on('showteam', async ({ name, team }) => {
  const assignedRoom = socket.roomId;
  if (!rooms[assignedRoom]) {
    console.error(`Room ${assignedRoom} not found`);
    return;
  }
  const captains = await GFGCollection.find({ team: team, captain: true });
  const plyer = rooms[assignedRoom].find(p => p.id === socket.id);
  if (!plyer) {
    console.error(`Player with id ${socket.id} not found in room ${assignedRoom}`);
    return;
  }
  plyer.team = team;
  plyer.player = captains[0].image;
  if (rooms[assignedRoom].find(p => p.team === "") == undefined) {
    const players = rooms[assignedRoom];
    
    game[assignedRoom] = {
      innings: 1,
      scores: {
        [players[0].team]: 0,
        [players[1].team]: 0
      },
      turn: Math.random() > 0.5 ? players[0].team : players[1].team,
      target: -1,
      result: ""
    };

    io.to(assignedRoom).emit('startgame', {
      roomId: assignedRoom,
      players,
      game: game[assignedRoom]
    });

    const turnIndex = players[0].team === game[assignedRoom].turn ? 0 : 1;
    io.to(players[turnIndex].id).emit('choiceturn', "Your Turn");
    io.to(players[(turnIndex + 1) % 2].id).emit('choiceturn', "Opposition Turn");
  } else {
    const p = rooms[assignedRoom].find(i => i.team !== "");
    if (p) {
      io.to(p.id).emit('subwait', 'Waiting for another player...');
    }
  }
});
  socket.on('gomove', (item) => { 
  const roomId = socket.roomId; 
if (!roomId || !rooms[roomId]){
  socket.to(roomId).emit("Left", "A player has been disconnected...");
  return;
} 
const player = rooms[roomId].find(p => p.id === socket.id); 
if (!player){
  socket.to(roomId).emit("Left", "A player has been disconnected...");
return;
}
player.choice = item;
const players = rooms[roomId];
if(players.find((p) =>p.choice==0)==undefined){
  const [p1,p2]=players
  if(p1.choice!==p2.choice){
    const batter = players.find(p => p.team === game[roomId].turn);
  if(game[roomId].target==-1 || game[roomId].target> (game[roomId].scores[batter.team]+batter.choice)){
   game[roomId].scores[batter.team] += batter.choice;
  io.to(roomId).emit('makescore', {
  players,
  game: game[roomId]
});
}
else{
  game[roomId].scores[batter.team] += batter.choice;
  game[roomId].result=`${batter.team} is winner`
    io.to(roomId).emit('makescore', {
  players,
  game: game[roomId]
})
delete rooms[roomId]
  delete game[roomId]
  io.in(roomId).socketsLeave(roomId);
}
  players.forEach((c)=>c.choice=0)
  if(game[roomId] && game[roomId].result==""){
    io.to(players[turn[roomId]].id).emit('choiceturn',"Your Turn")
     io.to(players[(turn[roomId]+1)%2].id).emit('choiceturn',"Opposition Turn")
  }
  }
  else{
    if(game[roomId].innings===1){
    const batter = players.find(p => p.team === game[roomId].turn);
    const bowler = players.find(p => p.team !== game[roomId].turn);
game[roomId].target=game[roomId].scores[batter.team]+1;
game[roomId].turn=bowler.team
game[roomId].innings=2;
      players.forEach((c)=>c.choice=0)
      io.to(roomId).emit('makescore', {
  players,
  game: game[roomId]
});
}
else{
  const batter = players.find(p => p.team === game[roomId].turn);
  const bowler = players.find(p => p.team !== game[roomId].turn);
  if(game[roomId].scores[bowler.team]==game[roomId].scores[batter.team]){
    game[roomId].result=`Match is tied`
    io.to(roomId).emit('makescore', {
  players,
  game: game[roomId]
})
  }
  else
  {
    game[roomId].result=`${bowler.team} is winner`
    io.to(roomId).emit('makescore', {
  players,
  game: game[roomId]
})
  }
  delete rooms[roomId]
  delete game[roomId]
  io.in(roomId).socketsLeave(roomId);
}
     if(game[roomId] && game[roomId].result==""){
          io.to(players[turn[roomId]].id).emit('choiceturn',"Your Turn")
     io.to(players[(turn[roomId]+1)%2].id).emit('choiceturn',"Opposition Turn")
     }
  }
}
else{
  io.to(players[turn[roomId]].id).emit('choiceturn',"Opposition Turn")
     io.to(players[(turn[roomId]+1)%2].id).emit('choiceturn',"Your Turn")
}
});
  socket.once('disconnect', () => {
  console.log("Player disconnected:", socket.id);

    for (const roomId in rooms) {
      const index = rooms[roomId].findIndex(p => p.id === socket.id);
      if (index !== -1) {
        rooms[roomId].splice(index, 1);

        if (rooms[roomId].length === 0) {
          delete rooms[roomId];
        } else {
          socket.to(roomId).emit("Left", "A player has been disconnected...");
        }
        break; // Stop loop after finding the room
      }
    } // or just reuse logic
    console.log(rooms)
});
  
}