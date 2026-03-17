const jwt = require("jsonwebtoken");

/**
 * Verifies the JWT token from cookies or headers
 */
const authenticate = (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers?.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: "Ju lutem logohuni!" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Sesioni ka skaduar!" });
        }
        req.user = decoded; // Contains id, username, and role
        next();
    });
};

/**
 * Restricts access to Admin only
 */
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Akses i ndaluar: Vetëm për Admin!" });
    }
};

/**
 * Restricts access to Admin or Inventory Managers (Ana's role)
 */
const inventoryOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === "admin" || req.user.role === "inventory_manager")) {
        next();
    } else {
        res.status(403).json({ message: "Nuk keni akses në inventar!" });
    }
};

module.exports = { authenticate, adminOnly, inventoryOrAdmin };