const express = require("express");

const {
    addMember,
    getMembers,
    removeMember
} = require("../controllers/tripMemberController");

//const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:tripId",  addMember);

router.get("/:tripId",  getMembers);

router.delete(
    "/:tripId/:userId",
    
    removeMember
);

module.exports = router;