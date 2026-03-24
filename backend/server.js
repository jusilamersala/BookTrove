require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const { log } = require("./logToFile");

const app = express();

// --- IMPORT ROUTES ---
const ContactRoute = require("./Routes/ContactRoute");
const itemRoutes = require("./Routes/ItemRoute");
const UserRoute = require("./Routes/UserRoute");
const OrderRoute = require("./Routes/OrderRoute");
const EventRoute = require("./Routes/EventRoute");
const BlogRoute = require("./Routes/BlogRoute");
const AttendanceRoute = require("./Routes/AttendanceRoute");  

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// 1. CORS 
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. MIDDLEWARE 
app.use(express.json());
app.use(cookieParser());

// 3. LOGGING MIDDLEWARE
app.use((req, res, next) => {
    log(`>>> ${req.method} ${req.url}`);
    next();
});

// 4. STATIC FILES
app.use("/invoices", express.static(path.join(__dirname, "invoices")));

// 5. SESSION CONFIGURATION
app.use(session({
    secret: process.env.SESSION_SECRET || "booktrove_jwt_secret_key_2026",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: false, 
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// 6. API ROUTES
app.use("/api/contact", ContactRoute);
app.use("/api/items", itemRoutes);
app.use("/api/users", UserRoute);
app.use("/api/orders", OrderRoute);
app.use("/api/events", EventRoute);
app.use("/api/blog", BlogRoute);
app.use("/api/attendance", AttendanceRoute);

// 7. DATABASE CONNECTION
mongoose.connect(mongoURI)
  .then(() => console.log("🍃 MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 8. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error('❌ Error Handler:', err.message);
    if (!res.headersSent) {
        res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});