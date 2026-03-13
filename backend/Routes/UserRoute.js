const express = require("express");
const router = express.Router();
const User = require("../models/UserModel"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secret = "booktrove_jwt_secret_key_2026";

// Middleware: Verify JWT
function authMiddleware(req, res, next) {
  const token = req.cookies?.accessToken || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) return res.status(401).json({ message: "Nuk ka token" });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).json({ message: "I paautorizuar" });
    req.user = decoded;
    next();
  });
}

// Middleware: Admin Only
function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: "Qasje e ndaluar" });
  }
  next();
}

// 1. REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const findUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (findUser) return res.status(400).json({ message: "Ky email është i zënë!" });

    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password, 
      role: role || "user"
    });

    await newUser.save();
    try {
      const Order = require('../models/OrderModel');
      await Order.create({ user: newUser._id, items: ['Welcome book'], total: 0 });
    } catch (e) {}

    const userResponse = newUser.toObject();
    delete userResponse.password;
    res.status(201).json({ user: userResponse });
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë regjistrimit" });
  }
});

// 2. LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: "Përdoruesi nuk u gjet!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Fjalëkalimi i pasaktë!" });

    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, secret, { expiresIn: "24h" });

    res.cookie("accessToken", token, { httpOnly: true, maxAge: 86400000, sameSite: "lax" }).json({
      token, id: user._id, username: user.username, role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: "Login dështoi!" });
  }
});

// 3. GET ME
router.get("/me", (req, res) => {
  const { accessToken } = req.cookies;
  if (!accessToken) return res.status(401).json({ message: "Nuk ka token" });
  jwt.verify(accessToken, secret, (err, decoded) => {
    if (err) return res.status(401).json({ message: "I paautorizuar" });
    res.status(200).json(decoded);
  });
});

// 4. LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.json({ message: "Logout sukses!" });
});

// 5. ADMIN: List Employees (E rëndësishme: Sipër rrugëve me :id)
router.get("/employees", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }, "username email role orari schedule");
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Gabim në marrjen e punonjësve' });
  }
});

// 6. ADMIN: Update Employee Schedule (Zgjidhja për 404)
router.put("/employees/:id/schedule", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { orari } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Përdoruesi nuk u gjet' });

    user.orari = orari; 
    await user.save();
    res.json({ message: 'Orari u përditësua', orari: user.orari });
  } catch (err) {
    res.status(500).json({ message: 'Gabim në server' });
  }
});

// 7. ADMIN: Add detailed shift (POST-i yt)
router.post("/employees/:id/schedule", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.schedule = user.schedule || [];
    user.schedule.push({ date: new Date(date), startTime, endTime, assignedBy: req.user.id });
    await user.save();
    res.json({ schedule: user.schedule });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
});

module.exports = router;