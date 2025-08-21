const mongoose = require('mongoose');
const BackupSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  participation: { type: Array, default: [] }
});
const BackupCollection=mongoose.model('backup', BackupSchema);
module.exports = BackupCollection;