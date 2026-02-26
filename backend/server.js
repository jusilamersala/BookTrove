const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

const mongoURI = "mongodb+srv://emxhejenxhej_db_user:di2oCFVjeixapuXR@cluster0.c0hfnpq.mongodb.net/BookTrove?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("🍃 MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("📚 BookTrove backend is running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});