import React, { useState } from "react";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";

const Profile = () => {
    const { user } = useAuthStore();

    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [profilePicture, setProfilePicture] = useState(
        user?.profilePicture || ""
    );

    const handleUpdate = async () => {
        try {
            const response = await api.put(`/users/${user._id}`, {
                name,
                email,
                profilePicture
            });

            console.log("Profile updated:", response.data);

            alert("Profile updated successfully!");

            setIsEditing(false);

            // Update Zustand user
            useAuthStore.setState({
                user: response.data.user
            });

        } catch (error) {
            console.error("Profile update error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        }
    };

    if (!user) {
        return <p>Loading profile...</p>;
    }

    return (
        <div>
            <h1>My Profile</h1>

            {!isEditing ? (
                <>
                    <p>
                        <strong>Name:</strong> {user.name}
                    </p>

                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>

                    {user.profilePicture && (
                        <img
                            src={user.profilePicture}
                            alt="Profile"
                            width="120"
                        />
                    )}

                    <br />

                    <button
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </button>
                </>
            ) : (
                <>
                    <div>
                        <label>Name</label>
                        <br />

                        <input
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />
                    </div>

                    <br />

                    <div>
                        <label>Email</label>
                        <br />

                        <input
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />
                    </div>

                    <br />

                    <div>
                        <label>Profile Picture URL</label>
                        <br />

                        <input
                            value={profilePicture}
                            onChange={(e) =>
                                setProfilePicture(e.target.value)
                            }
                            placeholder="Enter image URL"
                        />
                    </div>

                    <br />

                    <button onClick={handleUpdate}>
                        Save Changes
                    </button>

                    <button
                        onClick={() => setIsEditing(false)}
                    >
                        Cancel
                    </button>
                </>
            )}
        </div>
    );
};

export default Profile;