const Notification = require("../models/Notification");

// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user
        })
            .populate("sender", "name profilePicture")
            .populate("trip", "name destination")
            .sort({ createdAt: -1 });

        res.status(200).json({
            notifications
        });

    } catch (error) {
        console.error("Get Notifications Error:", error);

        res.status(500).json({
            message: "Failed to fetch notifications"
        });
    }
};


// ==========================================
// GET UNREAD NOTIFICATION COUNT
// ==========================================

const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.user,
            isRead: false
        });

        res.status(200).json({
            unreadCount: count
        });

    } catch (error) {
        console.error("Unread Count Error:", error);

        res.status(500).json({
            message: "Failed to fetch unread count"
        });
    }
};


// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user
        });

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        console.error("Mark Read Error:", error);

        res.status(500).json({
            message: "Failed to mark notification as read"
        });
    }
};


// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================

const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                recipient: req.user,
                isRead: false
            },
            {
                $set: {
                    isRead: true
                }
            }
        );

        res.status(200).json({
            message: "All notifications marked as read"
        });

    } catch (error) {
        console.error("Mark All Read Error:", error);

        res.status(500).json({
            message: "Failed to mark all notifications as read"
        });
    }
};


// ==========================================
// DELETE NOTIFICATION
// ==========================================

const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user
        });

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.status(200).json({
            message: "Notification deleted successfully"
        });

    } catch (error) {
        console.error("Delete Notification Error:", error);

        res.status(500).json({
            message: "Failed to delete notification"
        });
    }
};


module.exports = {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
};