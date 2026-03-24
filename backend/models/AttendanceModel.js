const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, 
  checkIn: { type: Date },
  checkOut: { type: Date },
  status: { type: String, enum: ['present', 'absent'], default: 'present' }
});

module.exports = mongoose.Types.attendance || mongoose.model('Attendance', attendanceSchema);