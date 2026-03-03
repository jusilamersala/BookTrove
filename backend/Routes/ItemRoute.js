const express = require("express");
const router = express.Router();
const Item = require("../models/ItemModel");

// CREATE ITEM
router.post("/", async (req, res) => {
  try {
    const { titulli, autori, cmimi, kategoria, imazhi } = req.body;

    if (!titulli || !autori || !cmimi || !kategoria) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newItem = new Item({
      titulli,
      autori,
      cmimi,
      kategoria,
      imazhi
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET ALL ITEMS
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;