const express = require("express");
const router = express.Router();
const Order = require("../models/OrderModel");
const jwt = require("jsonwebtoken");

const secret = "booktrove_jwt_secret_key_2026";

// authentication middleware using JWT cookie
function authMiddleware(req, res, next) {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ message: "Nuk ka token" });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).json({ message: "I paautorizuar" });
    req.user = decoded;
    next();
  });
}

// get orders for current user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (err) {
    console.error("Order fetch error", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

module.exports = router;
