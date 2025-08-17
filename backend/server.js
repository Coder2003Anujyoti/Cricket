const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const setupSockets = require('./sockets/index');
const bodyParser = require('body-parser');
const iplRoutes = require('./files/ipl.js');
const loginRoutes= require('./files/registration.js')
const adminRoutes=require("./files/onlinetournaments.js")
const newsRoutes=require("./files/showingnews.js")
const chatsRoutes=require("./files/chats.js")
const geminiRoutes=require("./files/gemini.js")
const challengeRoutes=require("./files/onlinechallenges.js")
const cors=require('cors');
const app = express();
const  connectDB = require('./db/config.js');
const dotenv = require('dotenv');
dotenv.config();
connectDB();
app.use(cors({
  origin:'*'
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
app.use(iplRoutes);
app.use(loginRoutes);
app.use(adminRoutes);
app.use(newsRoutes);
app.use(chatsRoutes)
app.use(geminiRoutes)
app.use(challengeRoutes)
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  },
  transports: ["websocket"], 
  pingInterval: 25000,  
  pingTimeout: 15000
});
setupSockets(io);
server.listen(8000, () => {
  console.log('Server running on port 8000');
});