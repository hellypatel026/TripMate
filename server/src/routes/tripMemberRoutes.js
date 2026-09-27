const express = require("express");

const {
    addMember,
    getMembers,
    removeMember
} = require("../controllers/tripMemberController");
const {
    isTripMember
} = require("../middleware/tripMiddleware");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:tripId", protect, addMember);

router.get("/:tripId", protect, isTripMember, getMembers);

router.delete(
    "/:tripId/:userId",
    protect,
    removeMember
);

module.exports = router;