const express = require("express");
const router = express.Router();
const Item = require("../models/ItemModel");
const { adminOnly, authenticate } = require("../middleware/authMiddleware");

// allowed categories/genres - must match frontend list
const allowedGenres = [
  "Romancë",
  "Mister",
  "Fantazi",
  "Histori",
  "Shkencë",
  // additional options if necessary
];
const { log } = require("../logToFile");

// CREATE ITEM - ADMIN ONLY
router.post("/", adminOnly, async (req, res, next) => {
  try {
    log("\n=== CREATE ITEM REQUEST ===");
    log("Request body: " + JSON.stringify(req.body));
    log("Request user from token: " + JSON.stringify(req.user));
    
    const { titulli, autori, cmimi, kategoria, imazhi } = req.body;

    // Validate all required fields
    if (!titulli || !autori || !cmimi || !kategoria) {
      log("❌ Validation failed - Missing fields: titulli=" + titulli + " autori=" + autori + " cmimi=" + cmimi + " kategoria=" + kategoria);
      return res.status(400).json({ message: "Të gjushta fushat janë të detyrueshme" });
    }

    // Validate category against allowed list
    if (!allowedGenres.includes(kategoria)) {
      log("❌ Invalid category provided: " + kategoria);
      return res.status(400).json({ message: "Kategoria e zgjedhur nuk është e vlefshme" });
    }

    log("✓ All fields present and valid");
    log("Converting cmimi to Number: " + cmimi + " => " + Number(cmimi));

    const newItem = new Item({
      titulli,
      autori,
      cmimi: Number(cmimi),
      kategoria,
      imazhi
    });

    log("Saving item to database...");
    const savedItem = await newItem.save();
    log("✓ Item saved successfully: " + savedItem._id);
    log("=== CREATE ITEM SUCCESS ===");
    res.status(201).json(savedItem);

  } catch (error) {
    log("❌ Error in CREATE ITEM: " + error.message);
    log("Stack: " + error.stack);
    log("Name: " + error.name);
    log("=== CREATE ITEM FAILED ===");
    // Pass to global error handler or send response
    res.status(500).json({ message: error.message || "Gabim në ruajtjen e librit" });
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

// GET SINGLE ITEM
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Libri nuk u gjet" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE ITEM - ADMIN ONLY
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const { titulli, autori, cmimi, kategoria, imazhi } = req.body;
    
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { titulli, autori, cmimi, kategoria, imazhi },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Libri nuk u gjet" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE ITEM - ADMIN ONLY
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    
    if (!deletedItem) {
      return res.status(404).json({ message: "Libri nuk u gjet" });
    }

    res.status(200).json({ message: "Libri u fshi me sukses", item: deletedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;