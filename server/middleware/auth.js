// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to protect routes – verifies JWT and adds user ID to req.user
module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token') || req.header('authorization');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    // Bearer token handling
    const actualToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token;
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded.user; // { id: ... }
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
