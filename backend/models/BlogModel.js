const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  titulli: { type: String, required: true },
  imazhi: { type: String, required: true },
  tag: { type: String, default: 'Rekomandime' },
  shkurtesa: { type: String, required: true },
  permbajtja: { type: String, required: true },
  autori: { type: String, required: true },
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', BlogSchema);