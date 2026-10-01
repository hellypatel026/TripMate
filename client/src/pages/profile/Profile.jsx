import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";
import TravelBackground from "../../components/TravelBackground";
import "./Profile.css";

const Profile = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [profilePicture, setProfilePicture] = useState(
        user?.profilePicture || ""
    );

    const handleUpdate = async () => {
        try {
            const userId = user._id || user.id;

            if (!userId) {
                alert("User ID not found. Please log in again.");
                return;
            }

            const response = await api.put(`/users/${userId}`, {
                name,
                email,
                profilePicture
            });

            useAuthStore.setState({
                user: response.data.user
            });

            alert("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Profile update error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        }
    };

    const handleCancel = () => {
        setName(user?.name || "");
        setEmail(user?.email || "");
        setProfilePicture(user?.profilePicture || "");
        setIsEditing(false);
    };

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    if (!user) {
        return (
            <div className="profile-loading">
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <TravelBackground />

            {/* Navbar */}
            <header className="profile-navbar">
                <Link to="/" className="profile-brand">
                    <span className="profile-brand-icon">✈</span>
                    <span>TripMate</span>
                </Link>

                <nav className="profile-nav">
                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/notifications">
                        Notifications
                    </Link>

                    <Link
                        to="/profile"
                        className="profile-nav-active"
                    >
                        Profile
                    </Link>

                    <button
                        className="profile-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </nav>
            </header>

            {/* Main */}
            <main className="profile-main">

                <div className="profile-heading">

                    <div>
                        <p className="profile-eyebrow">
                            ACCOUNT
                        </p>

                        <h1>
                            Your profile<span>.</span>
                        </h1>

                        <p className="profile-subtitle">
                            Manage your TripMate account and personal
                            information.
                        </p>
                    </div>

                    <Link
                        to="/dashboard"
                        className="profile-back-button"
                    >
                        ← Dashboard
                    </Link>

                </div>

                {/* Profile Card */}
                <section className="profile-card">

                    <div className="profile-card-top">

                        <div className="profile-avatar">

                            {user.profilePicture ? (
                                <img
                                    src={user.profilePicture}
                                    alt="Profile"
                                />
                            ) : (
                                <span>
                                    {user.name
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </span>
                            )}

                        </div>

                        <div className="profile-identity">
                            <h2>{user.name}</h2>
                            <p>{user.email}</p>
                        </div>

                        {!isEditing && (
                            <button
                                className="profile-edit-button"
                                onClick={() => setIsEditing(true)}
                            >
                                ✎ Edit Profile
                            </button>
                        )}

                    </div>

                    <div className="profile-divider"></div>

                    {!isEditing ? (

                        /* VIEW MODE */

                        <div className="profile-details">

                            <div className="profile-detail">
                                <span className="detail-label">
                                    FULL NAME
                                </span>

                                <strong>
                                    {user.name}
                                </strong>
                            </div>

                            <div className="profile-detail">
                                <span className="detail-label">
                                    EMAIL ADDRESS
                                </span>

                                <strong>
                                    {user.email}
                                </strong>
                            </div>

                            <div className="profile-detail">
                                <span className="detail-label">
                                    PROFILE PICTURE
                                </span>

                                <strong>
                                    {user.profilePicture
                                        ? "Profile picture added"
                                        : "No profile picture"}
                                </strong>
                            </div>

                        </div>

                    ) : (

                        /* EDIT MODE */

                        <div className="profile-form">

                            <div className="profile-form-group">
                                <label htmlFor="profile-name">
                                    Full name
                                </label>

                                <input
                                    id="profile-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="profile-form-group">
                                <label htmlFor="profile-email">
                                    Email address
                                </label>

                                <input
                                    id="profile-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="profile-form-group">
                                <label htmlFor="profile-picture">
                                    Profile picture URL
                                </label>

                                <input
                                    id="profile-picture"
                                    type="text"
                                    value={profilePicture}
                                    onChange={(e) =>
                                        setProfilePicture(e.target.value)
                                    }
                                    placeholder="Paste an image URL"
                                />
                            </div>

                            <div className="profile-form-actions">

                                <button
                                    className="profile-save-button"
                                    onClick={handleUpdate}
                                >
                                    Save Changes
                                </button>

                                <button
                                    className="profile-cancel-button"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    )}

                </section>

                {/* Account Information */}
                <section className="profile-note">

                    <div className="profile-note-icon">
                        ✦
                    </div>

                    <div>
                        <h3>Your TripMate account</h3>

                        <p>
                            Your profile information is used across
                            your trips and group activities.
                        </p>
                    </div>

                </section>

            </main>

            {/* Footer */}
            <footer className="profile-footer">
                <span>TripMate</span>
                <p>Plan less. Travel more.</p>
            </footer>

        </div>
    );
};

export default Profile;