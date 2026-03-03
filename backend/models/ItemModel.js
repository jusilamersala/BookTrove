const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  titulli: {
    type: String,
    required: true,
  },
  autori: {
    type: String,
    required: true,
  },
  cmimi: {
    type: Number,
    required: true,
  },
  kategoria: {
    type: String,
    required: true,
  },
  imazhi: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);