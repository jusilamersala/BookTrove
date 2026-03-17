const express = require("express");
const router = express.Router();
const Item = require("../models/ItemModel");
const { authenticate } = require("../middleware/authMiddleware");

// Middleware: Lejon Adminin ose Inventory Manager
const canManageInventory = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "inventory_manager")) {
    next();
  } else {
    res.status(403).json({ message: "Akses i mohuar! Nuk keni autorizim për inventarin." });
  }
};

// Middleware: Vetëm Admini mund të fshijë libra
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Ky veprim lejohet vetëm për Adminin." });
  }
};

// =========================================================
// 1. GET ALL ITEMS (Publike)
// =========================================================
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =========================================================
// 2. CREATE ITEM
// =========================================================
router.post("/", authenticate, canManageInventory, async (req, res) => {
  try {
    const { titulli, autori, cmimi, kategoria, imazhi, stoku } = req.body;

    if (!titulli || !autori || !cmimi || !kategoria) {
      return res.status(400).json({ message: "Fushat kryesore janë të detyrueshme" });
    }

    const newItem = new Item({
      titulli,
      autori,
      cmimi: Number(cmimi),
      kategoria,
      imazhi,
      stoku: Number(stoku) || 0
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: "Gabim në ruajtjen e librit" });
  }
});

// =========================================================
// 3. UPDATE ITEM (Updated for Ana's Inventory Dashboard)
// =========================================================
router.put("/:id", authenticate, canManageInventory, async (req, res) => {
  try {
    const updateData = {};
    
    // Only add to updateData if the field actually exists in the request
    if (req.body.titulli) updateData.titulli = req.body.titulli;
    if (req.body.autori) updateData.autori = req.body.autori;
    if (req.body.kategoria) updateData.kategoria = req.body.kategoria;
    
    // Check explicitly for undefined to allow 0 as a valid number
    if (req.body.cmimi !== undefined) updateData.cmimi = Number(req.body.cmimi);
    if (req.body.stoku !== undefined) updateData.stoku = Number(req.body.stoku);

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: updateData }, // Crucial: $set only changes what is provided
      { new: true, runValidators: true }
    );

    if (!updatedItem) return res.status(404).json({ message: "Libri nuk u gjet" });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// =========================================================
// 4. DELETE ITEM (Vetëm Admini)
// =========================================================
router.delete("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: "Libri nuk u gjet" });
    res.status(200).json({ message: "Libri u fshi me sukses" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
