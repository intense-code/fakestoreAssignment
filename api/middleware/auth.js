const jwt = require("jsonwebtoken");
const db = require("../../connection.js");

const restricted = async (req, res, next) => {
  try {
    // Get token from Authorization header (case-insensitive)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log("🔍 Auth header received:", authHeader ? "Present" : "Missing");
    
    if (!authHeader) {
      return res.status(401).json({ message: "token required" });
    }

    // Extract and clean the token
    let token;
    if (authHeader.startsWith('Bearer ') || authHeader.startsWith('bearer ')) {
      token = authHeader.slice(7).trim();
    } else {
      token = authHeader.trim();
    }

    // Remove any quotes or invalid characters
    token = token.replace(/['"]/g, '');
    
    console.log("🎫 Token to verify:", token.substring(0, 20) + "...");

    // Verify JWT_SECRET exists
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("❌ JWT_SECRET not found in environment variables");
      return res.status(500).json({ message: "server configuration error" });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    console.log("🎫 Decoded token payload:", decoded);
    
    // Check if session is still valid
    const session = await db("sessions")
      .where({ id: decoded.jti })
      .first();
    
    if (!session) {
      console.log("❌ No session found for jti:", decoded.jti);
      return res.status(401).json({ message: "session not found" });
    }

    if (session.revoked_at) {
      console.log("❌ Session is revoked");
      return res.status(401).json({ message: "session revoked" });
    }

    if (new Date(session.expires_at) < new Date()) {
      console.log("❌ Session expired");
      return res.status(401).json({ message: "session expired" });
    }

    console.log("✅ Session is valid");
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Token verification error:", error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "token invalid" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "token expired" });
    }
    res.status(401).json({ message: "authentication failed", error: error.message });
  }
};

const touchSession = async (req, res, next) => {
  try {
    const jti = req.user?.jti;
    if (jti) {
      console.log("👆 Touching session:", jti);
      await db("sessions")
        .where({ id: jti })
        .update({ last_seen_at: new Date() });
    }
    next();
  } catch (error) {
    console.error("❌ Touch session error:", error);
    next(); // Continue even if touch fails
  }
};

module.exports = {
  restricted,
  touchSession
};