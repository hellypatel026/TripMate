const express = require("express");

const {
    getMessages,
    createMessage
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/:tripId",
  protect,
    getMessages
);

router.post(
    "/:tripId",
   protect,
    createMessage
);

module.exports = router;