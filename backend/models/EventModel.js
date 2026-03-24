const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  titulli: { type: String, required: true },
  data: { type: String, required: true }, 
  ora: { type: String, required: true },
  lokacioni: { type: String, required: true },
  pershkrimi: { type: String, required: true },
  imazhi: { type: String, default: 'https://via.placeholder.com/500x300?text=Event' }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);