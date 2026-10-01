import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";
import TravelBackground from "../../components/TravelBackground";
import "./Gallery.css";

function Gallery() {
    const { tripId } = useParams();
    const navigate = useNavigate();

    const logout = useAuthStore((state) => state.logout);

    const [media, setMedia] = useState([]);
    const [trip, setTrip] = useState(null);

    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const loadGallery = async () => {
        try {
            setLoading(true);

            const [galleryResponse, tripResponse] = await Promise.all([
                api.get(`/gallery/${tripId}`),
                api.get(`/trips/${tripId}`)
            ]);

            setMedia(galleryResponse.data.gallery);
            setTrip(tripResponse.data.trip);
        } catch (error) {
            console.error("Error loading gallery:", error);

            alert(
                error.response?.data?.message ||
                "Failed to load gallery"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGallery();
    }, [tripId]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select an image first.");
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await api.post(
                `/gallery/${tripId}`,
                formData
            );

            console.log("Upload response:", response.data);

            alert("Image uploaded successfully!");

            setSelectedFile(null);

            const fileInput = document.getElementById("gallery-file-input");

            if (fileInput) {
                fileInput.value = "";
            }

            await loadGallery();
        } catch (error) {
            console.error("Error uploading image:", error);

            alert(
                error.response?.data?.message ||
                "Failed to upload image"
            );
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    return (
        <div className="gallery-page">
            <TravelBackground />

            {/* NAVBAR */}

            <header className="gallery-navbar">

                <Link
                    to="/"
                    className="gallery-brand"
                >
                    <span className="gallery-brand-icon">
                        ✈
                    </span>

                    <span>
                        TripMate
                    </span>
                </Link>

                <nav className="gallery-nav">

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/notifications">
                        Notifications
                    </Link>

                    <Link to="/profile">
                        Profile
                    </Link>

                    <button
                        className="gallery-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </nav>

            </header>


            <main className="gallery-main">

                <Link
                    to={`/trips/${tripId}`}
                    className="gallery-back-link"
                >
                    ← Back to Trip
                </Link>


                {/* HEADER */}

                <section className="gallery-heading">

                    <div>

                        <p className="gallery-eyebrow">
                            TRAVEL MEMORIES
                        </p>

                        <h1>
                            {trip?.name || "Trip Gallery"}
                            <span>.</span>
                        </h1>

                        <p className="gallery-description">
                            Keep the moments from your journey
                            together in one beautiful place.
                        </p>

                    </div>

                    {trip?.destination && (
                        <div className="gallery-location">
                            <span>📍</span>
                            <span>{trip.destination}</span>
                        </div>
                    )}

                </section>


                {/* UPLOAD */}

                <section className="gallery-upload-card">

                    <div className="upload-content">

                        <div className="upload-icon">
                            📸
                        </div>

                        <div>
                            <p className="upload-label">
                                ADD A MEMORY
                            </p>

                            <h2>
                                Share a moment from the trip.
                            </h2>

                            <p>
                                Upload an image to add it to
                                your group's shared gallery.
                            </p>
                        </div>

                    </div>


                    <div className="upload-controls">

                        <label
                            htmlFor="gallery-file-input"
                            className="choose-file-button"
                        >
                            {selectedFile
                                ? "Change Image"
                                : "Choose Image"}
                        </label>

                        <input
                            id="gallery-file-input"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        <button
                            className="upload-button"
                            onClick={handleUpload}
                            disabled={uploading || !selectedFile}
                        >
                            {uploading
                                ? "Uploading..."
                                : "Upload Image "}
                        </button>

                    </div>


                    {selectedFile && (
                        <div className="selected-file">

                            <span>✓</span>

                            <div>
                                <strong>
                                    {selectedFile.name}
                                </strong>

                                <small>
                                    {(
                                        selectedFile.size /
                                        (1024 * 1024)
                                    ).toFixed(2)}{" "}
                                    MB
                                </small>
                            </div>

                        </div>
                    )}

                </section>


                {/* GALLERY */}

                <section className="gallery-section">

                    <div className="gallery-section-heading">

                        <div>

                            <p className="gallery-section-label">
                                YOUR COLLECTION
                            </p>

                            <h2>
                                Trip memories
                            </h2>

                        </div>

                        <span className="photo-count">
                            {media.length}{" "}
                            {media.length === 1
                                ? "photo"
                                : "photos"}
                        </span>

                    </div>


                    {loading ? (

                        <div className="gallery-state">

                            <div className="gallery-state-icon">
                                📸
                            </div>

                            <h3>
                                Loading your memories...
                            </h3>

                            <p>
                                Getting the gallery ready.
                            </p>

                        </div>

                    ) : media.length === 0 ? (

                        <div className="gallery-state">

                            <div className="gallery-state-icon">
                                🖼️
                            </div>

                            <h3>
                                No memories yet
                            </h3>

                            <p>
                                Upload the first photo and
                                start building your trip story.
                            </p>

                        </div>

                    ) : (

                        <div className="gallery-grid">

                            {media.map((item) => (

                                <div
                                    className="gallery-photo-card"
                                    key={item._id}
                                >

                                    <img
                                        src={item.mediaUrl}
                                        alt={
                                            item.fileName ||
                                            "Trip memory"
                                        }
                                    />

                                    <div className="photo-overlay">

                                        <span>
                                            📸
                                        </span>

                                        <p>
                                            {item.fileName ||
                                                "Trip memory"}
                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>


            <footer className="gallery-footer">

                <span>
                    TripMate
                </span>

                <p>
                    Plan less. Travel more.
                </p>

            </footer>

        </div>
    );
}

export default Gallery;