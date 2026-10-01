import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";
import TravelBackground from "../../components/TravelBackground";
import "./Itinerary.css";

function Itinerary() {
    const { tripId } = useParams();
    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const [trip, setTrip] = useState(null);
    const [itinerary, setItinerary] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const emptyForm = {
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        estimatedCost: ""
    };

    const [formData, setFormData] = useState(emptyForm);

    // =========================
    // FETCH TRIP + ITINERARY
    // =========================

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError("");

                const [tripResponse, itineraryResponse] =
                    await Promise.all([
                        api.get(`/trips/${tripId}`),
                        api.get(`/itinerary/${tripId}`)
                    ]);

                setTrip(tripResponse.data.trip);
                setItinerary(itineraryResponse.data.itinerary || []);
            } catch (error) {
                console.error(
                    "ITINERARY LOAD ERROR:",
                    error.response?.data || error.message
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load itinerary."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [tripId]);

    // =========================
    // FORM CHANGE
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {
        setFormData(emptyForm);
        setEditingId(null);
        setShowForm(false);
    };

    // =========================
    // ADD / UPDATE ITINERARY
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccessMessage("");
        setIsSaving(true);

        try {
            if (!formData.title.trim()) {
                setError("Please enter an activity title.");
                setIsSaving(false);
                return;
            }

            if (!formData.date) {
                setError("Please select a date.");
                setIsSaving(false);
                return;
            }

            // Keep payload exactly compatible with your backend schema.
            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                location: formData.location.trim(),
                estimatedCost:
                    formData.estimatedCost === ""
                        ? 0
                        : Number(formData.estimatedCost)
            };

            console.log("ITINERARY PAYLOAD:", payload);

            if (editingId) {
                const response = await api.put(
                    `/itinerary/${editingId}`,
                    payload
                );

                console.log(
                    "ITINERARY UPDATE RESPONSE:",
                    response.data
                );

                setItinerary((prev) =>
                    prev.map((activity) =>
                        activity._id === editingId
                            ? response.data.itinerary
                            : activity
                    )
                );

                setSuccessMessage("Activity updated successfully.");
            } else {
                const response = await api.post(
                    `/itinerary/${tripId}`,
                    payload
                );

                console.log(
                    "ITINERARY CREATE RESPONSE:",
                    response.data
                );

                if (!response.data?.itinerary) {
                    throw new Error(
                        "Server did not return the created itinerary."
                    );
                }

                setItinerary((prev) => [
                    ...prev,
                    response.data.itinerary
                ]);

                setSuccessMessage(
                    "Activity added to your itinerary."
                );
            }

            resetForm();
        } catch (error) {
            console.error(
                "ITINERARY SAVE ERROR:",
                error.response?.data || error.message
            );

            const serverMessage =
                error.response?.data?.message;

            const serverError =
                error.response?.data?.error;

            setError(
                serverMessage ||
                serverError ||
                error.message ||
                "Failed to save itinerary activity."
            );
        } finally {
            setIsSaving(false);
        }
    };

    // =========================
    // EDIT
    // =========================

    const handleEdit = (activity) => {
        setEditingId(activity._id);

        setFormData({
            title: activity.title || "",
            description: activity.description || "",
            date: activity.date
                ? activity.date.substring(0, 10)
                : "",
            startTime: activity.startTime || "",
            endTime: activity.endTime || "",
            location: activity.location || "",
            estimatedCost:
                activity.estimatedCost !== undefined &&
                activity.estimatedCost !== null
                    ? activity.estimatedCost
                    : ""
        });

        setShowForm(true);
        setError("");
        setSuccessMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =========================
    // DELETE
    // =========================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this itinerary activity?"
        );

        if (!confirmed) return;

        try {
            setError("");
            setSuccessMessage("");

            await api.delete(`/itinerary/${id}`);

            setItinerary((prev) =>
                prev.filter((activity) => activity._id !== id)
            );

            setSuccessMessage(
                "Activity removed from your itinerary."
            );
        } catch (error) {
            console.error(
                "DELETE ITINERARY ERROR:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete itinerary activity."
            );
        }
    };

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    // =========================
    // DATE HELPERS
    // =========================

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const formatDay = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit"
        });
    };

    const formatMonth = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("en-IN", {
            month: "short"
        });
    };

    const formatTime = (time) => {
        if (!time) return "";

        const [hours, minutes] = time.split(":");

        if (hours === undefined || minutes === undefined) {
            return time;
        }

        const date = new Date();
        date.setHours(Number(hours));
        date.setMinutes(Number(minutes));

        return date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });
    };

    const getActivityIcon = (activity) => {
        const text = `
            ${activity.title || ""}
            ${activity.location || ""}
            ${activity.description || ""}
        `.toLowerCase();

        if (
            text.includes("hotel") ||
            text.includes("stay") ||
            text.includes("resort")
        ) {
            return "🏨";
        }

        if (
            text.includes("food") ||
            text.includes("restaurant") ||
            text.includes("lunch") ||
            text.includes("dinner") ||
            text.includes("breakfast") ||
            text.includes("cafe")
        ) {
            return "🍴";
        }

        if (
            text.includes("flight") ||
            text.includes("airport") ||
            text.includes("plane")
        ) {
            return "✈️";
        }

        if (
            text.includes("train") ||
            text.includes("station")
        ) {
            return "🚆";
        }

        if (
            text.includes("bus") ||
            text.includes("travel") ||
            text.includes("drive")
        ) {
            return "🚗";
        }

        if (
            text.includes("beach") ||
            text.includes("mountain") ||
            text.includes("park") ||
            text.includes("temple") ||
            text.includes("museum") ||
            text.includes("visit") ||
            text.includes("sight")
        ) {
            return "📸";
        }

        return "📍";
    };

    // =========================
    // LOADING
    // =========================

    if (isLoading) {
        return (
            <div className="itinerary-page">
                <TravelBackground />

                <header className="itinerary-navbar">
                    <Link to="/" className="itinerary-brand">
                        <span className="itinerary-brand-icon">
                            ✈
                        </span>
                        <span>TripMate</span>
                    </Link>
                </header>

                <main className="itinerary-main">
                    <div className="itinerary-loading">
                        <div className="loading-icon">✈</div>
                        <h2>Planning your journey...</h2>
                        <p>
                            Loading your travel itinerary.
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error && !trip) {
        return (
            <div className="itinerary-page">
                <TravelBackground />

                <header className="itinerary-navbar">
                    <Link to="/" className="itinerary-brand">
                        <span className="itinerary-brand-icon">
                            ✈
                        </span>
                        <span>TripMate</span>
                    </Link>
                </header>

                <main className="itinerary-main">
                    <div className="itinerary-error-page">
                        <div className="error-icon">!</div>

                        <h2>We couldn't load this journey</h2>

                        <p>{error}</p>

                        <Link
                            to={`/trips/${tripId}`}
                            className="itinerary-primary-button"
                        >
                            ← Back to Trip
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="itinerary-page">
            <TravelBackground />

            {/* =========================
                NAVBAR
            ========================= */}

            <header className="itinerary-navbar">
                <Link to="/" className="itinerary-brand">
                    <span className="itinerary-brand-icon">
                        ✈
                    </span>

                    <span>TripMate</span>
                </Link>

                <nav className="itinerary-nav">
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
                        className="itinerary-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </nav>
            </header>

            <main className="itinerary-main">

                {/* =========================
                    BACK
                ========================= */}

                <Link
                    to={`/trips/${tripId}`}
                    className="itinerary-back"
                >
                    ← Back to Trip
                </Link>

                {/* =========================
                    HERO
                ========================= */}

                <section className="itinerary-hero">

                    <div className="itinerary-hero-content">

                        <p className="itinerary-eyebrow">
                            YOUR JOURNEY
                        </p>

                        <h1>
                            {trip?.name || "Trip Itinerary"}
                        </h1>

                        <p className="itinerary-destination">
                            📍 {trip?.destination || "Your destination"}
                        </p>

                        <div className="itinerary-trip-dates">
                            <span>
                                {trip?.startDate
                                    ? formatDate(trip.startDate)
                                    : "Start date"}
                            </span>

                            <span className="date-arrow">
                                →
                            </span>

                            <span>
                                {trip?.endDate
                                    ? formatDate(trip.endDate)
                                    : "End date"}
                            </span>
                        </div>

                    </div>

                    <div className="itinerary-hero-icon">
                        🗺️
                    </div>

                </section>

                {/* =========================
                    STATUS MESSAGE
                ========================= */}

                {error && (
                    <div className="itinerary-alert itinerary-alert-error">
                        <span>!</span>
                        <p>{error}</p>

                        <button
                            onClick={() => setError("")}
                        >
                            ×
                        </button>
                    </div>
                )}

                {successMessage && (
                    <div className="itinerary-alert itinerary-alert-success">
                        <span>✓</span>
                        <p>{successMessage}</p>

                        <button
                            onClick={() => setSuccessMessage("")}
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* =========================
                    TOP ACTION
                ========================= */}

                <div className="itinerary-toolbar">

                    <div>
                        <p className="toolbar-label">
                            THE PLAN
                        </p>

                        <h2>
                            {itinerary.length === 0
                                ? "Your journey starts here"
                                : `${itinerary.length} ${
                                      itinerary.length === 1
                                          ? "stop"
                                          : "stops"
                                  } on your journey`}
                        </h2>
                    </div>

                    <button
                        className="add-stop-button"
                        onClick={() => {
                            setEditingId(null);
                            setFormData(emptyForm);
                            setShowForm(!showForm);
                            setError("");
                            setSuccessMessage("");
                        }}
                    >
                        <span>+</span>
                        {showForm
                            ? "Close"
                            : "Add a Stop"}
                    </button>

                </div>

                {/* =========================
                    ADD / EDIT FORM
                ========================= */}

                {showForm && (
                    <section className="itinerary-form-card">

                        <div className="form-card-header">
                            <div>
                                <p className="itinerary-eyebrow">
                                    {editingId
                                        ? "UPDATE STOP"
                                        : "NEW STOP"}
                                </p>

                                <h2>
                                    {editingId
                                        ? "Edit your activity"
                                        : "Add something to your journey"}
                                </h2>
                            </div>

                            <div className="form-card-icon">
                                📍
                            </div>
                        </div>

                        <form
                            className="itinerary-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="form-grid">

                                <div className="form-field form-field-wide">
                                    <label>
                                        Activity title
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Visit Eiffel Tower"
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label>
                                        Date
                                    </label>

                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label>
                                        Location
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Eiffel Tower"
                                    />
                                </div>

                                <div className="form-field">
                                    <label>
                                        Start time
                                    </label>

                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-field">
                                    <label>
                                        End time
                                    </label>

                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-field">
                                    <label>
                                        Estimated cost
                                    </label>

                                    <input
                                        type="number"
                                        name="estimatedCost"
                                        value={formData.estimatedCost}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <div className="form-field form-field-wide">
                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Add some details about this stop..."
                                        rows="4"
                                    />
                                </div>

                            </div>

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="form-cancel-button"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="form-save-button"
                                    disabled={isSaving}
                                >
                                    {isSaving
                                        ? "Saving..."
                                        : editingId
                                        ? "Save Changes"
                                        : "Add to Journey"}

                                    {!isSaving && (
                                        <span>→</span>
                                    )}
                                </button>

                            </div>

                        </form>

                    </section>
                )}

                {/* =========================
                    JOURNEY TIMELINE
                ========================= */}

                {itinerary.length === 0 ? (
                    <section className="empty-itinerary">

                        <div className="empty-route">
                            <div className="empty-plane">
                                ✈
                            </div>
                        </div>

                        <div className="empty-content">
                            <div className="empty-icon">
                                🗺️
                            </div>

                            <h2>
                                No stops yet
                            </h2>

                            <p>
                                Start building your journey by
                                adding your first activity.
                            </p>

                            <button
                                className="empty-add-button"
                                onClick={() => {
                                    setShowForm(true);
                                    setFormData(emptyForm);
                                    setEditingId(null);
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth"
                                    });
                                }}
                            >
                                + Add First Stop
                            </button>
                        </div>

                    </section>
                ) : (
                    <section className="journey-timeline">

                        <div className="journey-line"></div>

                        {itinerary.map((activity, index) => (
                            <article
                                key={activity._id}
                                className={`journey-stop ${
                                    index % 2 === 0
                                        ? "journey-stop-left"
                                        : "journey-stop-right"
                                }`}
                            >

                                <div className="journey-node">
                                    <span>
                                        {index + 1}
                                    </span>
                                </div>

                                <div className="journey-date-marker">

                                    <strong>
                                        {formatDay(activity.date)}
                                    </strong>

                                    <span>
                                        {formatMonth(activity.date)}
                                    </span>

                                </div>

                                <div className="journey-card">

                                    <div className="journey-card-top">

                                        <div className="journey-type-icon">
                                            {getActivityIcon(
                                                activity
                                            )}
                                        </div>

                                        <div className="journey-card-title">
                                            <p>
                                                STOP {index + 1}
                                            </p>

                                            <h3>
                                                {activity.title}
                                            </h3>
                                        </div>

                                    </div>

                                    <div className="journey-card-details">

                                        <div className="journey-detail">
                                            <span>📅</span>

                                            <div>
                                                <small>
                                                    Date
                                                </small>

                                                <strong>
                                                    {formatDate(
                                                        activity.date
                                                    )}
                                                </strong>
                                            </div>
                                        </div>

                                        {(activity.startTime ||
                                            activity.endTime) && (
                                            <div className="journey-detail">
                                                <span>⏰</span>

                                                <div>
                                                    <small>
                                                        Time
                                                    </small>

                                                    <strong>
                                                        {formatTime(
                                                            activity.startTime
                                                        )}

                                                        {activity.endTime &&
                                                            ` - ${formatTime(
                                                                activity.endTime
                                                            )}`}
                                                    </strong>
                                                </div>
                                            </div>
                                        )}

                                        {activity.location && (
                                            <div className="journey-detail">
                                                <span>📍</span>

                                                <div>
                                                    <small>
                                                        Location
                                                    </small>

                                                    <strong>
                                                        {activity.location}
                                                    </strong>
                                                </div>
                                            </div>
                                        )}

                                        {activity.estimatedCost >
                                            0 && (
                                            <div className="journey-detail">
                                                <span>💰</span>

                                                <div>
                                                    <small>
                                                        Estimated cost
                                                    </small>

                                                    <strong>
                                                        ₹
                                                        {activity.estimatedCost}
                                                    </strong>
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    {activity.description && (
                                        <p className="journey-description">
                                            {activity.description}
                                        </p>
                                    )}

                                    <div className="journey-card-footer">

                                        <span className="created-by">
                                            Added by{" "}
                                            {activity.createdBy?.name ||
                                                "Trip member"}
                                        </span>

                                        <div className="journey-actions">

                                            <button
                                                onClick={() =>
                                                    handleEdit(
                                                        activity
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-action"
                                                onClick={() =>
                                                    handleDelete(
                                                        activity._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </article>
                        ))}

                        <div className="journey-end">

                            <div className="journey-end-icon">
                                🏁
                            </div>

                            <div>
                                <p>
                                    JOURNEY CONTINUES
                                </p>

                                <span>
                                    More memories waiting to be made.
                                </span>
                            </div>

                        </div>

                    </section>
                )}

            </main>

            <footer className="itinerary-footer">
                <span>TripMate</span>
                <p>Plan less. Travel more.</p>
            </footer>
        </div>
    );
}

export default Itinerary;