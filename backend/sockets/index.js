const liveSockets = require('../manager/livescore');
const cricketSockets = require('../manager/cricket');
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    liveSockets(io, socket);
   cricketSockets(io,socket);
    
  });
};