const express = require("express");
const { generateQuiz } = require("../../controller/quiz-controller/index.js");
const authenticateMiddleware = require("../../middleware/auth-middleware.js");

const router = express.Router();

router.use(authenticateMiddleware);

router.post("/generate", authenticateMiddleware, generateQuiz);

module.exports = router;
