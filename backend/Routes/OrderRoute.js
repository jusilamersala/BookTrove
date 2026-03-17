const express = require("express");
const router = express.Router();
const Order = require("../models/OrderModel");
const Item = require("../models/ItemModel");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const { generateInvoice } = require("../utils/invoiceGenerator");

const secret = "booktrove_jwt_secret_key_2026";

// Middleware për verifikimin e përdoruesit
function authMiddleware(req, res, next) {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Duhet të jeni i loguar për të kryer këtë veprim" });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Sesioni ka skaduar" });
    req.user = decoded;
    next();
  });
}

/**
 * @route   POST /api/orders
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Shporta nuk mund të jetë boshe" });
    }

    // 1. KONTROLLI I STOKUT
    for (const item of items) {
      const book = await Item.findById(item._id);
      if (!book || book.stoku < item.sasia) {
        return res.status(400).json({ 
          message: `Libri "${item.titulli}" nuk ka mjaftueshëm stok.` 
        });
      }
    }

    // 2. KRIJIMI I POROSISË (Me sigurim që totali është numër)
    const newOrder = new Order({
      user: req.user.id,
      items: items,
      total: Number(total), // SHTUAR: Sigurohemi që nuk është NaN
      status: "Pending",
      createdAt: new Date()
    });

    const savedOrder = await newOrder.save();

    // 3. ZBRITJA E STOKUT
    const updatePromises = items.map(item => {
      return Item.findByIdAndUpdate(
        item._id,
        { $inc: { stoku: -item.sasia } }, 
        { new: true }
      );
    });
    await Promise.all(updatePromises);

    // 4. GJENERIMI I FATURËS PDF
    // Përdorim path.resolve për të qenë 100% të sigurt për lokacionin
    const invoicesDir = path.resolve(__dirname, "..", "invoices");
    
    // Krijo folderin nëse mungon fizikisht
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const invoiceName = `invoice_${savedOrder._id}.pdf`;
    const invoicePath = path.join(invoicesDir, invoiceName);

    // Përgatitja e të dhënave për faturën
    const orderDataForInvoice = {
      _id: savedOrder._id,
      items: savedOrder.items,
      total: savedOrder.total,
      user: { username: req.user.username || "Klient" }
    };

    // Gjenerojmë PDF-në
    generateInvoice(orderDataForInvoice, invoicePath);

    // 5. PËRGJIGJJA (URL duhet të korrespondojë me app.use te server.js)
    res.status(201).json({
      message: "Porosia u krye me sukses!",
      order: savedOrder,
      invoiceUrl: `/invoices/${invoiceName}`
    });

  } catch (err) {
    console.error("❌ Gabim gjatë procesimit të porosisë:", err);
    res.status(500).json({ message: "Gabim në server: " + err.message });
  }
});

/**
 * @route   GET /api/orders
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Gabim teknik gjatë marrjes së porosive" });
  }
});

module.exports = router;