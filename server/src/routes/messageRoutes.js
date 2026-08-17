const express = require("express");

const {
    getMessages,
    createMessage
} = require("../controllers/messageController");

//const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/:tripId",
  
    getMessages
);

router.post(
    "/:tripId",
   
    createMessage
);

module.exports = router;