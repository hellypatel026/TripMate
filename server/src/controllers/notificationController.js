const Notification = require("../models/Notification");


// GET USER NOTIFICATIONS

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.user
        })
        .populate("trip", "name")
        .sort({ createdAt: -1 });

        res.status(200).json({
            notifications
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch notifications"
        });
    }
};


// MARK AS READ

const markAsRead = async (req, res) => {
    try {
        const notification =
            await Notification.findOneAndUpdate(
                {
                    _id: req.params.id,
                    user: req.user
                },
                {
                    isRead: true
                },
                {
                    new: true
                }
            );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.status(200).json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update notification"
        });
    }
};


module.exports = {
    getNotifications,
    markAsRead
};