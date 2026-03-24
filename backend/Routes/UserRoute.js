const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticate, adminOnly } = require("../middleware/authMiddleware");
const secret = process.env.JWT_SECRET || "booktrove_jwt_secret_key_2026";

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        
        if (!user) return res.status(404).json({ message: "Përdoruesi nuk u gjet!" });

        const isMatch = await user.comparePassword(password);
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
            role: user.role,
            orari: user.orari 
        });
    } catch (err) {
        res.status(500).json({ message: "Login dështoi!" });
    }
});

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

router.post("/register-employee", authenticate, adminOnly, async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const allowedRoles = ['employee', 'inventory_manager'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: "Roli i zgjedhur nuk është i vlefshëm" });
        }

        const findUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (findUser) return res.status(400).json({ message: "Ky email është i regjistruar!" });

        const newEmployee = new User({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: password,
            role: role,
            orari: {
                fillimi: "08:00",
                mbarimi: "16:00",
                ditet: ["Hënë", "Martë", "Mërkurë", "Enjte", "Premte"]
            }
        });

        await newEmployee.save();
        res.status(201).json({ message: `Llogaria për ${username} u krijua me sukses!` });
    } catch (err) {
        res.status(500).json({ message: "Gabim në server: " + err.message });
    }
});

router.get("/employees", authenticate, adminOnly, async (req, res) => {
    try {
        const staff = await User.find(
            { role: { $in: ['employee', 'inventory_manager'] } }, 
            "username email role orari" 
        );
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: 'Gabim në marrjen e listës së stafit' });
    }
});

router.put("/employees/:id/schedule", authenticate, adminOnly, async (req, res) => {
    try {
        const { id } = req.params;
        const { orari } = req.body; // Pranon objektin { fillimi, mbarimi, ditet }

        if (!orari || !orari.ditet) {
            return res.status(400).json({ message: "Të dhënat e orarit janë të mangëta" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id, 
            { $set: { orari: orari } }, 
            { new: true }
        ).select("-password");
        
        if (!updatedUser) return res.status(404).json({ message: 'Punonjësi nuk u gjet' });
        
        res.json({ message: 'Orari u përditësua me sukses', user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: 'Gabim gjatë përditësimit të orarit' });
    }
});

router.get("/me", authenticate, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id).select("-password");
        if (!currentUser) return res.status(404).json({ message: "Përdoruesi nuk u gjet" });
        res.json(currentUser);
    } catch (err) {
        res.status(500).json({ message: "Gabim në marrjen e të dhënave të profilit" });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("accessToken");
    res.json({ message: "U loguat jashtë me sukses!" });
});

module.exports = router;