const express = require("express");
const router = express.Router();
const {
    generateCertificate,
    downloadCertificate,
} = require("../../controller/certificate-controller/index.js");
const authenticateMiddleware = require("../../middleware/auth-middleware.js");

// Generate certificate (requires authentication)
router.post("/generate/:courseId", authenticateMiddleware, generateCertificate);

// Download certificate
router.get("/download/:filename", downloadCertificate);

module.exports = router;
