const { jwtSecret } = require("../../config/secrets.js");
const jwt = require("jsonwebtoken");

function isValid(body) {
  return Boolean(
    body &&
    typeof body.username === "string" &&
    body.username.trim() &&
    typeof body.password === "string" &&
    body.password.trim()
  );
}

function signToken(user, jti, expiresInSec = 24 * 60 * 60) {
  const payload = { sub: user.id, username: user.username, role: user.role, jti };
  return jwt.sign(payload, jwtSecret, { expiresIn: expiresInSec });
}

function restricted(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  if (!token) return res.status(401).json({ message: "token required" });

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return res.status(401).json({ message: "token invalid" });
    req.user = decoded; // { sub, username, role, jti }
    next();
  });
}

module.exports = {
  isValid,signToken,restricted
};
