const mongoose = require('mongoose');


const TournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  playerteam: { type: String, required: true },
  computerteam: { type: String, required: true },
  matchID: { type: String, required: true, unique: true },
  time:{ type:String, required:true},
  hasStarted: { type: Boolean, default: false },
  playerrun: { type: Number, default: 0 },
  computerrun: { type: Number, default: 0 },
  playerwicket: { type: Number, default: 0 },
  computerwicket: { type: Number, default: 0 },
  overs: { type: String, default: "" },
  target: { type: Number, default: 0 },
  winner: { type: String, default: "" },
  players: { type: Array, default: [] },
  message: { type: String, default: "" }
});

const TournamentsCollection = mongoose.model('Tournaments', TournamentSchema);
module.exports = TournamentsCollection;