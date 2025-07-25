const liveSockets = require('../manager/livescore');
const cricketSockets = require('../manager/cricket');
const store=require('../store/store.js')
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    liveSockets(io, socket);
   // cricketSockets(io,socket);
    
  });
};