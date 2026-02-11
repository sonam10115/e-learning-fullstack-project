const jwt = require("jsonwebtoken");
const { ENV } = require("./env.js");

if (!ENV.JWT_SECRET) {
  console.error("❌ CRITICAL: JWT_SECRET is not configured!");
  console.error("Please set JWT_SECRET in your .env file");
  process.exit(1);
}

const generateToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured in environment variables");
  }

  const token = jwt.sign({ _id: userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks: cross-site scripting
    sameSite: "strict", // CSRF attacks
    secure: ENV.NODE_ENV === "development" ? false : true,
  });

  return token;
};

module.exports = { generateToken };

// http://localhost
// https://dsmakmk.com
