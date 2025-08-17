const mongoose = require('mongoose');
const ChallengesSchema = new mongoose.Schema({
  challengeID: { type: String, required: true, unique: true },
  playerteam: { type: String, required: true },
  computerteam: { type: String, required: true },
  playerimage: { type: String, default:""},
  computerimage: { type: String, default:""},
  name: { type: String, default:""},
  time: { type: String, default:""},
  players: { type: Array, default:[]}
});
const ChallengesCollection = mongoose.model('Challenges', ChallengesSchema);
module.exports = ChallengesCollection;