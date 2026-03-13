const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const { log } = require("./logToFile");

// Log that server is starting
log("\n\n========== SERVER STARTING ==========");
log("Timestamp: " + new Date().toISOString());
log("================================\n");

// (Routes)
const ContactRoute = require("./Routes/ContactRoute");
const itemRoutes = require("./Routes/ItemRoute");
const UserRoute = require("./Routes/UserRoute");
const OrderRoute = require("./Routes/OrderRoute");
const EventRoute = require("./Routes/EventRoute");
const BlogRoute = require("./Routes/BlogRoute");

const app = express();
const mongoURI = "mongodb+srv://emxhejenxhej_db_user:di2oCFVjeixapuXR@cluster0.c0hfnpq.mongodb.net/BookTrove?retryWrites=true&w=majority";

// log all incoming requests for debugging
app.use((req, res, next) => {
    log(">>> " + req.method + " " + req.url);
    next();
});

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    preflightContinue: false
}));

// lightweight cookie parser (avoids adding dependency)
app.use((req, res, next) => {
  req.cookies = {};
  const cookieHeader = req.headers?.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach(pair => {
      const idx = pair.indexOf('=');
      if (idx > -1) {
        const key = pair.slice(0, idx).trim();
        const val = pair.slice(idx + 1).trim();
        try { req.cookies[key] = decodeURIComponent(val); } catch { req.cookies[key] = val; }
      }
    });
  }
  next();
});

app.use(express.json());

app.use(session({
    secret: "booktrove_secret_key_123", 
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false, 
        httpOnly: true,
        sameSite: 'lax'
    }
}));

app.use("/api/contact", ContactRoute);
app.use("/api/items", itemRoutes);
app.use("/api/users", UserRoute);
app.use("/api/orders", OrderRoute);
app.use("/api/events", EventRoute);
app.use("/api/blog", BlogRoute); 

mongoose.connect(mongoURI)
  .then(() => console.log("🍃 MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// global error logger - MUST send a response
app.use((err, req, res, next) => {
  console.error('❌ Global error handler caught error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  // Only send response if headers haven't been sent
  if (!res.headersSent) {
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});