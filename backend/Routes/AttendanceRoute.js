const express = require('express');
const router = express.Router();
const Attendance = require('../models/AttendanceModel');
const { authenticate } = require('../middleware/authMiddleware');

// POST /api/attendance/checkin
router.post('/checkin', authenticate, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    let record = await Attendance.findOne({ userId: req.user.id, date: today });
    if (record) return res.status(400).json({ message: "Keni bërë check-in një herë sot!" });

    record = new Attendance({
      userId: req.user.id,
      date: today,
      checkIn: new Date()
    });
    await record.save();
    res.json({ message: "Hyrja u regjistrua!", record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim në server gjatë check-in" });
  }
});

// POST /api/attendance/checkout
router.post('/checkout', authenticate, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let record = await Attendance.findOne({ userId: req.user.id, date: today });

    if (!record) return res.status(400).json({ message: "Duhet të bëni check-in më parë!" });
    if (record.checkOut) return res.status(400).json({ message: "Keni bërë check-out!" });

    record.checkOut = new Date();
    await record.save();
    res.json({ message: "Dalja u regjistrua!", record });
  } catch (err) {
    res.status(500).json({ message: "Gabim në server gjatë check-out" });
  }
});

// GET /api/attendance/today 
router.get('/today', authenticate, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const logs = await Attendance.find({ date: today }).populate('userId', 'username email');
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: "Gabim në marrjen e të dhënave" });
    }
});

module.exports = router;