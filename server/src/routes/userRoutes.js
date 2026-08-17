const express = require("express");

const {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    getUserById
} = require("../controllers/userController");

const router = express.Router();

router.post("/", createUser);
router.get("/",  getUsers);


// Get user by ID
router.get("/:id",  getUserById);


// Update user
router.put("/:id",  updateUser);


// Delete user
router.delete("/:id", deleteUser);
module.exports = router;