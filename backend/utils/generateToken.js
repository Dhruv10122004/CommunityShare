const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing!");
    throw new Error("JWT_SECRET missing in environment");
  }
  console.log("✅ JWT_SECRET exists and is loaded");

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = generateToken;
