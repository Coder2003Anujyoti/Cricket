const mongoose = require('mongoose');
const NewsSchema = new mongoose.Schema({
  newsID: { type: String, default:"" },
  playerteam: { type: String, default:"" },
  computerteam: { type: String, default:"" },
  image: { type: String, default: "" },
  content: { type: String, default: "" },
  posttype: { type: String, default: "" }
});
const NewsCollection = mongoose.model('news', NewsSchema);
module.exports = NewsCollection;