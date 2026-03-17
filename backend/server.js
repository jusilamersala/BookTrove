require("dotenv").config(); // Load environment variables at the very top
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path"); // UPDATE: Shtuar për të menaxhuar folderat e faturave
const { log } = require("./logToFile");

log("\n\n========== SERVER STARTING ==========");
log("Timestamp: " + new Date().toISOString());
log("================================\n");

const ContactRoute = require("./Routes/ContactRoute");
const itemRoutes = require("./Routes/ItemRoute");
const UserRoute = require("./Routes/UserRoute");
const OrderRoute = require("./Routes/OrderRoute");
const EventRoute = require("./Routes/EventRoute");
const BlogRoute = require("./Routes/BlogRoute");

const app = express();

// Use environment variables for sensitive data
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

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

// Manual Cookie Parser Middleware
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

/** * UPDATE: LEJIMII I FAKTURAVE (Static Files)
 * Ky rresht zgjidh gabimin "Cannot GET /invoices/..."
 * E bën folderin "invoices" të aksesueshëm nga browser-i.
 */
app.use("/invoices", express.static(path.join(__dirname, "invoices")));

app.use(session({
    secret: process.env.SESSION_SECRET || "default_secret", // Added fallback
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false, 
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// API Routes
app.use("/api/contact", ContactRoute);
app.use("/api/items", itemRoutes);
app.use("/api/users", UserRoute);
app.use("/api/orders", OrderRoute);
app.use("/api/events", EventRoute);
app.use("/api/blog", BlogRoute); 

mongoose.connect(mongoURI)
  .then(() => console.log("🍃 MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error handler caught error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  if (!res.headersSent) {
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});