const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");

// Kontrollo saktësinë e këtyre rrugëve (Routes)
const ContactRoute = require("./Routes/ContactRoute");
const itemRoutes = require("./Routes/ItemRoute");
const UserRoute = require("./Routes/UserRoute");
const OrderRoute = require("./Routes/OrderRoute");

const app = express();
const mongoURI = "mongodb+srv://emxhejenxhej_db_user:di2oCFVjeixapuXR@cluster0.c0hfnpq.mongodb.net/BookTrove?retryWrites=true&w=majority";

// log all incoming requests for debugging
app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    next();
});

app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true 
}));

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

mongoose.connect(mongoURI)
  .then(() => console.log("🍃 MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// global error logger
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  next(err);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});