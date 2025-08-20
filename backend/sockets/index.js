const liveSockets = require('../manager/livescore');
const cricketSockets = require('../manager/cricket');
const playSockets=require('../manager/playscore');
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    liveSockets(io, socket);
   cricketSockets(io,socket);
    playSockets(io,socket)
  });
};