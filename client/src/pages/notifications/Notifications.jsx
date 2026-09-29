import React, { useEffect, useState } from "react";
import api from "../../services/api";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            const response = await api.get("/notifications");

            console.log("Notifications response:", response.data);

            setNotifications(response.data.notifications);
        } catch (error) {
            console.error("Error loading notifications:", error);

            alert(
                error.response?.data?.message ||
                "Failed to load notifications"
            );
        } finally {
            setLoading(false);
        }
    };
    const markAsRead = async (notificationId) => {
        try {
            await api.put(`/notifications/${notificationId}/read`);

            setNotifications((prev) =>
                prev.filter(
                    (notification) =>
                        notification._id !== notificationId
                )
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);

            alert(
                error.response?.data?.message ||
                "Failed to mark notification as read"
            );
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    if (loading) {
        return <p>Loading notifications...</p>;
    }

    return (
        <div>
            <h1>Notifications</h1>

            {notifications.length === 0 ? (
                <p>No notifications yet.</p>
            ) : (
                notifications.map((notification) => (
                    <div key={notification._id}>
                        <p>{notification.message}</p>

                        <button
                            onClick={() => markAsRead(notification._id)}
                        >
                            Mark as Read
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default Notifications;