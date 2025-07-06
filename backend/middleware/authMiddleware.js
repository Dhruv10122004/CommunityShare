const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  console.log("🔐 authenticate middleware called");

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded token:", decoded); // 👈 This must print user info
      req.user = decoded;
      next();
    } catch (err) {
      console.error("❌ JWT verification failed:", err.message); // 👈 Add this
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.error("❌ No Authorization header");
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
