const express = require('express');
const bodyParser = require('body-parser');
const iplRoutes = require('./files/ipl.js');
const loginRoutes= require('./files/registration.js')
const adminRoutes=require("./files/onlinetournaments.js")
const cors=require('cors');
const app = express();
const  connectDB = require('./db/config.js');
const dotenv = require('dotenv');
dotenv.config();
app.use(cors({
  origin:"*"
}));
connectDB();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
app.use(iplRoutes);
app.use(loginRoutes);
app.use(adminRoutes);
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});