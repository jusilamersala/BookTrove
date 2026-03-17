const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticate, adminOnly } = require("../middleware/authMiddleware");

const secret = "booktrove_jwt_secret_key_2026";

// 1. LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        
        if (!user) return res.status(404).json({ message: "Përdoruesi nuk u gjet!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Fjalëkalimi i pasaktë!" });

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role }, 
            secret, 
            { expiresIn: "24h" }
        );

        res.cookie("accessToken", token, { 
            httpOnly: true, 
            maxAge: 86400000, 
            sameSite: "lax",
            secure: false 
        }).json({
            token, 
            id: user._id, 
            username: user.username, 
            role: user.role
        });
    } catch (err) {
        res.status(500).json({ message: "Login dështoi!" });
    }
});

// 2. REGISTER (Public)
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const findUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (findUser) return res.status(400).json({ message: "Ky email është i zënë!" });

        const newUser = new User({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password, 
            role: "user"
        });

        await newUser.save();
        res.status(201).json({ message: "Regjistrimi u krye me sukses!" });
    } catch (err) {
        res.status(500).json({ message: "Gabim gjatë regjistrimit" });
    }
});

// 3. ADMIN: Register Staff
router.post("/register-employee", authenticate, adminOnly, async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const allowedRoles = ['employee', 'inventory_manager'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: "Roli duhet të jetë Punonjës ose Menaxher Inventari" });
        }

        const findUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (findUser) return res.status(400).json({ message: "Ky email është i regjistruar!" });

        const newEmployee = new User({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: password,
            role: role
        });

        await newEmployee.save();
        res.status(201).json({ message: `Llogaria për ${username} u krijua me sukses!` });
    } catch (err) {
        res.status(500).json({ message: "Gabim në server: " + err.message });
    }
});

// 4. ADMIN: Staff List
router.get("/employees", authenticate, adminOnly, async (req, res) => {
    try {
        const staff = await User.find(
            { role: { $in: ['employee', 'inventory_manager'] } }, 
            "-password" 
        );
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: 'Gabim në marrjen e listës së stafit' });
    }
});

// 5. ADMIN: Update Schedule
router.put("/employees/:id/schedule", authenticate, adminOnly, async (req, res) => {
    try {
        const { id } = req.params;
        const { orari } = req.body;
        
        const user = await User.findByIdAndUpdate(
            id, 
            { $set: { "orari": orari } }, 
            { new: true }
        );
        
        if (!user) return res.status(404).json({ message: 'Punonjësi nuk u gjet' });
        res.json({ message: 'Orari u përditësua', user });
    } catch (err) {
        res.status(500).json({ message: 'Gabim gjatë përditësimit' });
    }
});

// 6. AUTH UTILS
router.get("/me", authenticate, (req, res) => {
    res.json(req.user);
});

router.post("/logout", (req, res) => {
    res.clearCookie("accessToken");
    res.json({ message: "U loguat jashtë!" });
});

module.exports = router;