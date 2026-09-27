
const express = require("express");

const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all notifications
router.get("/", protect, getMyNotifications);

// Get unread notification count
router.get("/unread-count", protect, getUnreadCount);

// Mark all notifications as read
router.patch("/read-all", protect, markAllAsRead);

// Mark one notification as read
router.patch("/:id/read", protect, markAsRead);

// Delete one notification
router.delete("/:id", protect, deleteNotification);

module.exports = router;