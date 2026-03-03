const express = require("express");
const router = express.Router();
const User = require("../models/UserModel"); // Sigurohu që emri i folderit/skedarit është i saktë
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secret = "booktrove_jwt_secret_key_2026"; 

// 1. REGISTER
router.post("/register", async (req, res) => {
  console.log('Register body:', req.body);
  try {
    const { username, email, password, role } = req.body;

    // Kontrollo nëse përdoruesi ekziston
    const findUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (findUser) {
      console.log('Registration failed: email exists', email);
      return res.status(400).json({ message: "Ky email është i zënë!" });
    }

    // Krijo përdoruesin e ri
    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password, // Enkriptimi bëhet automatikisht te UserModel.js (pre-save)
      role: role || "user"
    });

    console.log('Saving new user', newUser);
    await newUser.save();
    console.log('User saved', newUser.email);

    // create a sample order for demonstration
    try {
      const Order = require('../models/OrderModel');
      await Order.create({ user: newUser._id, items: ['Welcome book'], total: 0 });
    } catch (orderErr) {
      console.error('Could not create sample order:', orderErr);
    }

    // Kthe përgjigjen pa fjalëkalimin
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ message: "Regjistrimi u krye me sukses!", user: userResponse });
  } catch (err) {
    console.error('Registration exception:', err);
    res.status(500).json({ message: "Gabim gjatë regjistrimit: " + err.message });
  }
});

// 2. LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ message: "Përdoruesi nuk u gjet!" });
    }

    // Krahaso fjalëkalimin
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Fjalëkalimi është i pasaktë!" });
    }

    // Krijo Token-in (JWT)
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      secret,
      { expiresIn: "24h" }
    );

    // Dërgo Token-in si Cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false, // Mbaje false për localhost
      maxAge: 86400000, // 24 orë
      sameSite: "lax",
    }).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ message: "Login dështoi në server!" });
  }
});

// 3. GET CURRENT USER (Për të mbajtur login-in pas refresh)
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

module.exports = router;