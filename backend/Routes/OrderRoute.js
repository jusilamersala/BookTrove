const express = require("express");
const router = express.Router();
const Order = require("../models/OrderModel");
const Item = require("../models/ItemModel");
const path = require("path");
const fs = require("fs");
const { generateInvoice } = require("../utils/invoiceGenerator");
const { authenticate } = require("../middleware/authMiddleware");

/**
 * @route   POST /api/orders
 * @desc    Krijon porosinë, zbret stokun dhe gjeneron faturën PDF
 * @access  Private
 */
router.post("/", authenticate, async (req, res) => {
  try {
    const { items, total, metodaPageses } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Shporta nuk mund të jetë boshe" });
    }

    // 1. Kontrolli i stokut përpara procesimit
    for (const item of items) {
      const book = await Item.findById(item._id);
      if (!book || book.stoku < item.sasia) {
        return res.status(400).json({ 
          message: `Libri "${item.titulli}" nuk ka mjaftueshëm stok.` 
        });
      }
    }

    // 2. Ruajtja e porosisë në Databazë
    const newOrder = new Order({
      user: req.user.id, // ID nga token-i i dekoduar
      items: items,
      total: Number(total),
      metodaPageses: metodaPageses || "Cash",
      status: metodaPageses === "PayPal" ? "Paid" : "Pending",
      createdAt: new Date()
    });

    const savedOrder = await newOrder.save();

    // 3. Zbritja e stokut (Update automatik)
    const updatePromises = items.map(item => {
      return Item.findByIdAndUpdate(
        item._id,
        { $inc: { stoku: -item.sasia } }
      );
    });
    await Promise.all(updatePromises);

    // 4. Gjenerimi i faturës fizike
    const invoicesDir = path.resolve(__dirname, "..", "invoices");
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const invoiceName = `invoice_${savedOrder._id}.pdf`;
    const invoicePath = path.join(invoicesDir, invoiceName);

    await generateInvoice({
      _id: savedOrder._id,
      items: savedOrder.items,
      total: savedOrder.total,
      user: { username: req.user.username || "Klient" },
      date: savedOrder.createdAt
    }, invoicePath);

    res.status(201).json({
      message: "Porosia u krye me sukses!",
      order: savedOrder
    });

  } catch (err) {
    console.error("❌ Gabim te POST orders:", err);
    res.status(500).json({ message: "Gabim në server: " + err.message });
  }
});

/**
 * @route   GET /api/orders/user/my-orders
 * @desc    Merr të gjitha porositë e përdoruesit të loguar (Zgjidh faqen e Profilit boshe)
 * @access  Private
 */
router.get("/user/my-orders", authenticate, async (req, res) => {
  try {
    // Gjen të gjitha porositë ku fusha 'user' është e barabartë me ID-në e personit të loguar
    const userOrders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(userOrders);
  } catch (err) {
    console.error("❌ Gabim te marrja e porosive:", err);
    res.status(500).json({ message: "Nuk u ngarkuan dot porositë." });
  }
});

/**
 * @route   GET /api/orders/:id/invoice
 * @desc    Shërben skedarin PDF për shkarkim
 * @access  Private
 */
router.get("/:id/invoice", authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Porosia nuk u gjet" });

    // Siguria: Vetëm pronari i porosisë ose admini mund ta shkarkojë
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Pa autorizim" });
    }

    const invoiceName = `invoice_${order._id}.pdf`;
    const invoicePath = path.resolve(__dirname, "..", "invoices", invoiceName);

    // Rigjenero faturën nëse mungon fizikisht në server
    if (!fs.existsSync(invoicePath)) {
      await generateInvoice({
        _id: order._id,
        items: order.items,
        total: order.total,
        user: { username: req.user.username || "Klient" }
      }, invoicePath);
    }

    res.download(invoicePath, invoiceName);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;