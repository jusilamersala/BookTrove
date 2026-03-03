const express = require("express");
const router = express.Router();
const Contact = require("../models/ContactModel"); 

router.post("/sendMessage", async (req, res) => {
  try {
    const { name, email, comment } = req.body;

    const newMessage = new Contact({
      name,
      email,
      comment
    });

    await newMessage.save();
    res.status(201).json({ message: "Mesazhi u dërgua me sukses!" });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Ndodhi një gabim në server." });
  }
});

module.exports = router;