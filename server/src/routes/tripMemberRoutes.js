const express = require("express");

const {
    addMember,
    getMembers,
    removeMember
} = require("../controllers/tripMemberController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:tripId", protect, addMember);

router.get("/:tripId", protect, getMembers);

router.delete(
    "/:tripId/:userId",
    protect,
    removeMember
);

module.exports = router;