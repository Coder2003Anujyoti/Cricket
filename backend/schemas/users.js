const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {type: String, required: true},
  hasheduserpassword: {type: String, required: true},
  total: {type: Number, default:0},
  icon: {type: String, default:""},
  participation: { type: Array, default: [] }
});
const UsersCollection=mongoose.model('Users', UserSchema);
module.exports = UsersCollection;