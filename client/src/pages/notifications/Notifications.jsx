import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";
import TravelBackground from "../../components/TravelBackground";
import "./Notifications.css";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

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
            console.error(
                "Error marking notification as read:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to mark notification as read"
            );
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    return (
        <div className="notifications-page">

            <TravelBackground />

            {/* Navbar */}
            <header className="notifications-navbar">

                <Link to="/" className="notifications-brand">
                    <span className="notifications-brand-icon">
                        ✈
                    </span>

                    <span>TripMate</span>
                </Link>

                <nav className="notifications-nav">

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                    <Link
                        to="/notifications"
                        className="notifications-nav-active"
                    >
                        Notifications
                    </Link>

                    <Link to="/profile">
                        Profile
                    </Link>

                    <button
                        className="notifications-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </nav>

            </header>

            {/* Main */}
            <main className="notifications-main">

                <div className="notifications-heading">

                    <div>
                        <p className="notifications-eyebrow">
                            TRIP UPDATES
                        </p>

                        <h1>
                            Notifications<span>.</span>
                        </h1>

                        <p className="notifications-subtitle">
                            Stay up to date with everything happening
                            across your trips.
                        </p>
                    </div>

                    <Link
                        to="/dashboard"
                        className="notifications-back-button"
                    >
                        ← Dashboard
                    </Link>

                </div>

                {/* Loading */}
                {loading ? (

                    <section className="notifications-state">
                        <div className="notifications-state-icon">
                            ⏳
                        </div>

                        <h2>Loading notifications</h2>

                        <p>
                            Checking for your latest trip updates...
                        </p>
                    </section>

                ) : notifications.length === 0 ? (

                    /* Empty State */

                    <section className="notifications-state">

                        <div className="notifications-state-icon">
                            ✓
                        </div>

                        <h2>You're all caught up</h2>

                        <p>
                            There are no new notifications right now.
                            We'll let you know when something happens.
                        </p>

                        <Link
                            to="/dashboard"
                            className="notifications-state-button"
                        >
                            Back to Dashboard →
                        </Link>

                    </section>

                ) : (

                    /* Notification List */

                    <section className="notifications-list">

                        <div className="notifications-list-header">

                            <div>
                                <h2>Your updates</h2>

                                <p>
                                    {notifications.length}{" "}
                                    {notifications.length === 1
                                        ? "notification"
                                        : "notifications"}{" "}
                                    waiting for you
                                </p>
                            </div>

                            <div className="notifications-count">
                                {notifications.length}
                            </div>

                        </div>

                        <div className="notification-items">

                            {notifications.map((notification) => (

                                <article
                                    className="notification-card"
                                    key={notification._id}
                                >

                                    <div className="notification-icon">
                                        🔔
                                    </div>

                                    <div className="notification-content">

                                        <p className="notification-message">
                                            {notification.message}
                                        </p>

                                        <span className="notification-status">
                                            New notification
                                        </span>

                                    </div>

                                    <button
                                        className="notification-read-button"
                                        onClick={() =>
                                            markAsRead(
                                                notification._id
                                            )
                                        }
                                    >
                                        Mark as Read
                                    </button>

                                </article>

                            ))}

                        </div>

                    </section>

                )}

            </main>

            {/* Footer */}
            <footer className="notifications-footer">

                <span>TripMate</span>

                <p>
                    Plan less. Travel more.
                </p>

            </footer>

        </div>
    );
};

export default Notifications;