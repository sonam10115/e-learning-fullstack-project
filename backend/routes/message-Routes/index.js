const express = require("express");
const {
    getCourseContacts,
    getChatPartners,
    getMessagesByUserId,
    sendMessage,
} = require("../../controller/message-controller/index.js");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const { arcjetProtection } = require("../../middleware/arcjet.middleware.js");

const router = express.Router();

// the middlewares execute in order - so requests get rate-limited first, then authenticated.
// this is actually more efficient since unauthenticated requests get blocked by rate limiting before hitting the auth middleware.
router.use(arcjetProtection, authenticateMiddleware);

router.get("/contacts", getCourseContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);

module.exports = router;
