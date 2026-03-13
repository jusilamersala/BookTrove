const jwt = require("jsonwebtoken");
const { log } = require("../logToFile");
const secret = "booktrove_jwt_secret_key_2026";

// Middleware check authentication
const authenticate = (req, res, next) => {
  const { accessToken } = req.cookies;
  
  if (!accessToken) {
    return res.status(401).json({ message: "Nuk ka token - Nuk jeni i loguar" });
  }

  jwt.verify(accessToken, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token i pavlefshëm" });
    }
    req.user = decoded;
    next();
  });
};

// Middleware để check admin role
const adminOnly = (req, res, next) => {
  try {
    const cookieToken = req.cookies?.accessToken;
    const header = req.headers?.authorization;
    const headerToken = header && header.startsWith('Bearer ') ? header.split(' ')[1] : null;
    const token = cookieToken || headerToken;

    log("=== ADMIN ONLY MIDDLEWARE CHECK ===");
    log("Cookie token present: " + !!cookieToken);
    log("Header token present: " + !!headerToken);
    log("Cookies: " + JSON.stringify(Object.keys(req.cookies || {})));

    if (!token) {
      log("❌ No token provided in cookie or Authorization header");
      return res.status(401).json({ message: "Nuk ka token - Nuk jeni i loguar" });
    }

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        log("❌ JWT verification FAILED: " + err.message);
        return res.status(401).json({ message: "Token i pavlefshëm: " + err.message });
      }
      log("✓ JWT verification SUCCESS");
      req.user = decoded;
      log("User decoded: id=" + decoded.id + " role=" + decoded.role);

      if (req.user.role !== "admin") {
        log("❌ User role is not admin: " + req.user.role);
        return res.status(403).json({ message: "Vetëm admin-at mund të bëjnë këtë veprimin" });
      }
      log("✓ Admin verification PASSED");
      log("=== ADMIN ONLY MIDDLEWARE PASSED ===");
      next();
    });
  } catch (error) {
    log("❌ ERROR in adminOnly middleware: " + error.message);
    log("Stack trace: " + error.stack);
    res.status(500).json({ message: "Gabim në verifikimin e permisioneve" });
  }
};

module.exports = { authenticate, adminOnly };
