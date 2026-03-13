const router = require('express').Router();
const Event = require('../models/EventModel');

// GET all events
router.get('/', async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

// POST new event (Admin only)
router.post('/', async (req, res) => {
  const newEvent = new Event(req.body);
  const saved = await newEvent.save();
  res.json(saved);
});

// DELETE event
router.delete('/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json("Event i fshirë.");
});

module.exports = router;