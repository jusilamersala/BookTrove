const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const token = req.cookies?.accessToken || (req.headers?.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
    
    if (!token) {
        return res.status(401).json({ message: "Ju lutem logohuni!" });
    }

    const secret = process.env.JWT_SECRET || "booktrove_jwt_secret_key_2026"; 

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Sesioni ka skaduar!" });
        }
        req.user = decoded; // Këtu vijnë id, username, role
        next();
    });
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Akses i ndaluar: Vetëm për Admin!" });
    }
};

module.exports = { authenticate, adminOnly };