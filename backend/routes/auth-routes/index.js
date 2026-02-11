const express = require("express");
const {
    registerUser,
    loginUser, logoutUser
} = require("../../controller/auth-controller/index");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const { arcjetProtection } = require("../../middleware/arcjet.middleware.js");
const { ENV } = require("../../lib/env.js");

const router = express.Router();

router.use(arcjetProtection);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authenticateMiddleware, (req, res) => {
    const user = req.user;

    res.status(200).json({
        success: true,
        message: "Authenticated user!",
        data: {
            user,
        },
    });
});

// Debug endpoint - verify JWT_SECRET is consistent
router.get("/debug/jwt-secret", (req, res) => {
    const secret = ENV.JWT_SECRET;
    res.json({
        jwt_secret_configured: !!secret,
        jwt_secret_preview: secret ? secret.substring(0, 20) + "..." : "NOT SET",
        jwt_secret_length: secret ? secret.length : 0,
    });
});

module.exports = router;