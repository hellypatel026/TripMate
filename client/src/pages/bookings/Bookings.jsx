import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";
import TravelBackground from "../../components/TravelBackground";
import "./Bookings.css";

const initialBookingData = {
    type: "hotel",
    name: "",
    bookingReference: "",
    price: "",
    status: "pending",
    startDate: "",
    endDate: "",
    location: "",
    documentUrl: ""
};

const bookingIcons = {
    hotel: "🏨",
    flight: "✈️",
    train: "🚆",
    bus: "🚌",
    taxi: "🚕",
    other: "📋"
};

function Bookings() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const [trip, setTrip] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingBookingId, setEditingBookingId] = useState(null);
    const [bookingData, setBookingData] = useState(initialBookingData);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [tripResponse, bookingsResponse] = await Promise.all([
                api.get(`/trips/${tripId}`),
                api.get(`/bookings/${tripId}`)
            ]);

            setTrip(tripResponse.data.trip);
            setBookings(bookingsResponse.data.bookings || []);
        } catch (err) {
            console.error("Failed to load bookings:", err);
            setError(
                err.response?.data?.message ||
                "Unable to load bookings."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [tripId]);

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setBookingData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const openAddForm = () => {
        setEditingBookingId(null);
        setBookingData(initialBookingData);
        setShowForm(true);
    };

    const openEditForm = (booking) => {
        setEditingBookingId(booking._id);

        setBookingData({
            type: booking.type || "hotel",
            name: booking.name || "",
            bookingReference: booking.bookingReference || "",
            price: booking.price ?? "",
            status: booking.status || "pending",
            startDate: booking.startDate
                ? booking.startDate.slice(0, 10)
                : "",
            endDate: booking.endDate
                ? booking.endDate.slice(0, 10)
                : "",
            location: booking.location || "",
            documentUrl: booking.documentUrl || ""
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingBookingId(null);
        setBookingData(initialBookingData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!bookingData.name.trim()) {
            alert("Please enter a booking name.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                ...bookingData,
                price: Number(bookingData.price) || 0
            };

            if (editingBookingId) {
                const response = await api.put(
                    `/bookings/${editingBookingId}`,
                    payload
                );

                setBookings((prev) =>
                    prev.map((booking) =>
                        booking._id === editingBookingId
                            ? response.data.booking
                            : booking
                    )
                );
            } else {
                const response = await api.post(
                    `/bookings/${tripId}`,
                    payload
                );

                setBookings((prev) => [
                    ...prev,
                    response.data.booking
                ]);
            }

            closeForm();
        } catch (err) {
            console.error("Booking save error:", err);
            alert(
                err.response?.data?.message ||
                "Failed to save booking."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (bookingId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this booking?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/bookings/${bookingId}`);

            setBookings((prev) =>
                prev.filter((booking) => booking._id !== bookingId)
            );
        } catch (err) {
            console.error("Booking delete error:", err);
            alert(
                err.response?.data?.message ||
                "Failed to delete booking."
            );
        }
    };

    const formatDate = (date) => {
        if (!date) return "Not specified";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const formatCurrency = (amount) => {
        return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
    };

    const confirmedCount = bookings.filter(
        (booking) => booking.status === "confirmed"
    ).length;

    const pendingCount = bookings.filter(
        (booking) => booking.status === "pending"
    ).length;

    const totalAmount = bookings.reduce(
        (total, booking) => total + Number(booking.price || 0),
        0
    );

    if (loading) {
        return (
            <div className="bookings-loading">
                <div className="bookings-loading-icon">📋</div>
                <h2>Loading bookings...</h2>
                <p>Getting your trip reservations ready.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bookings-error">
                <div className="bookings-error-icon">!</div>
                <h2>Couldn't load bookings</h2>
                <p>{error}</p>

                <button
                    className="booking-empty-button"
                    onClick={fetchData}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bookings-page">
            <TravelBackground />

            <header className="bookings-navbar">
                <Link to="/dashboard" className="bookings-brand">
                    <span className="bookings-brand-icon">✈</span>
                    <span>TripMate</span>
                </Link>

                <nav className="bookings-nav">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/notifications">Notifications</Link>
                    <Link to="/profile">Profile</Link>

                    <button
                        className="bookings-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </nav>
            </header>

            <main className="bookings-main">
                <Link
                    to={`/trips/${tripId}`}
                    className="bookings-back-link"
                >
                    ← Back to Trip
                </Link>

                <section className="bookings-hero">
                    <div className="bookings-hero-content">
                        <p className="bookings-eyebrow">
                            TRIP BOOKINGS
                        </p>

                        <h1>
                            Keep every
                            <span>reservation together.</span>
                        </h1>

                        <p>
                            Store hotels, flights, trains, buses and other
                            travel bookings in one organized place.
                        </p>

                        {trip && (
                            <div className="bookings-trip-name">
                                🧳
                                <span>{trip.name}</span>

                                {trip.destination && (
                                    <>
                                        <span className="trip-name-arrow">
                                            →
                                        </span>
                                        <span>{trip.destination}</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bookings-hero-visual">
                        <div className="booking-ticket-decoration">
                            <span>TRIPMATE RESERVATION</span>
                            <strong>
                                {trip?.destination || "YOUR TRIP"}
                            </strong>
                            <small>BOOKED & ORGANIZED</small>
                        </div>

                        <div className="booking-plane-decoration">
                            ✈️
                        </div>
                    </div>
                </section>

                <section className="bookings-summary">
                    <div className="booking-summary-card">
                        <div className="booking-summary-icon">
                            📋
                        </div>
                        <div>
                            <span>Total bookings</span>
                            <strong>{bookings.length}</strong>
                        </div>
                    </div>

                    <div className="booking-summary-card">
                        <div className="booking-summary-icon">
                            ✅
                        </div>
                        <div>
                            <span>Confirmed</span>
                            <strong>{confirmedCount}</strong>
                        </div>
                    </div>

                    <div className="booking-summary-card">
                        <div className="booking-summary-icon">
                            💰
                        </div>
                        <div>
                            <span>Total cost</span>
                            <strong>{formatCurrency(totalAmount)}</strong>
                        </div>
                    </div>
                </section>

                <section className="bookings-section-header">
                    <div>
                        <p className="section-mini-label">
                            YOUR RESERVATIONS
                        </p>

                        <h2>Bookings</h2>

                        <p>
                            {pendingCount > 0
                                ? `${pendingCount} booking${pendingCount > 1 ? "s" : ""} still pending`
                                : "Everything is up to date."}
                        </p>
                    </div>

                    <button
                        className="booking-add-button"
                        onClick={openAddForm}
                    >
                        + Add Booking
                    </button>
                </section>

                {showForm && (
                    <section className="booking-form-card">
                        <div className="booking-form-heading">
                            <div className="booking-form-icon">
                                {editingBookingId ? "✏️" : "➕"}
                            </div>

                            <div>
                                <h2>
                                    {editingBookingId
                                        ? "Edit Booking"
                                        : "Add Booking"}
                                </h2>
                            </div>
                        </div>

                        <form
                            className="booking-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="booking-form-grid">
                                <div className="booking-field">
                                    <label htmlFor="type">
                                        Booking Type
                                    </label>

                                    <select
                                        id="type"
                                        name="type"
                                        value={bookingData.type}
                                        onChange={handleChange}
                                    >
                                        <option value="hotel">Hotel</option>
                                        <option value="flight">Flight</option>
                                        <option value="train">Train</option>
                                        <option value="bus">Bus</option>
                                        <option value="taxi">Taxi</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="booking-field">
                                    <label htmlFor="status">
                                        Status
                                    </label>

                                    <select
                                        id="status"
                                        name="status"
                                        value={bookingData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="pending">
                                            Pending
                                        </option>
                                        <option value="confirmed">
                                            Confirmed
                                        </option>
                                        <option value="cancelled">
                                            Cancelled
                                        </option>
                                    </select>
                                </div>

                                <div className="booking-field booking-field-full">
                                    <label htmlFor="name">
                                        Booking Name
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="e.g. Hotel Taj Goa"
                                        value={bookingData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="booking-field">
                                    <label htmlFor="bookingReference">
                                        Booking Reference
                                    </label>

                                    <input
                                        id="bookingReference"
                                        name="bookingReference"
                                        type="text"
                                        placeholder="e.g. ABC123"
                                        value={bookingData.bookingReference}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="booking-field">
                                    <label htmlFor="price">
                                        Price
                                    </label>

                                    <div className="booking-input-prefix">
                                        <span>₹</span>

                                        <input
                                            id="price"
                                            name="price"
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={bookingData.price}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="booking-field">
                                    <label htmlFor="startDate">
                                        Start Date
                                    </label>

                                    <input
                                        id="startDate"
                                        name="startDate"
                                        type="date"
                                        value={bookingData.startDate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="booking-field">
                                    <label htmlFor="endDate">
                                        End Date
                                    </label>

                                    <input
                                        id="endDate"
                                        name="endDate"
                                        type="date"
                                        value={bookingData.endDate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="booking-field booking-field-full">
                                    <label htmlFor="location">
                                        Location
                                    </label>

                                    <input
                                        id="location"
                                        name="location"
                                        type="text"
                                        placeholder="e.g. Panjim, Goa"
                                        value={bookingData.location}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="booking-field booking-field-full">
                                    <label htmlFor="documentUrl">
                                        Document URL
                                    </label>

                                    <input
                                        id="documentUrl"
                                        name="documentUrl"
                                        type="url"
                                        placeholder="https://..."
                                        value={bookingData.documentUrl}
                                        onChange={handleChange}
                                    />

                                    <small>
                                        Optional link to your ticket,
                                        confirmation or booking document.
                                    </small>
                                </div>
                            </div>

                            <div className="booking-form-actions">
                                <button
                                    type="button"
                                    className="booking-cancel-button"
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="booking-save-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingBookingId
                                            ? "Update Booking"
                                            : "Save Booking"}

                                    {!saving && <span>→</span>}
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {bookings.length === 0 ? (
                    <section className="bookings-empty">
                        <div className="bookings-empty-route">
                            <span>✈</span>
                            <div></div>
                            <span>📍</span>
                        </div>

                        <div className="bookings-empty-icon">
                            🧳
                        </div>

                        <h2>No bookings yet</h2>

                        <p>
                            Add your hotel, flight, train, bus or other
                            reservations so your whole trip stays organized
                            in one place.
                        </p>

                        <button
                            className="booking-empty-button"
                            onClick={openAddForm}
                        >
                            Add Your First Booking
                        </button>
                    </section>
                ) : (
                    <section className="booking-list">
                        {bookings.map((booking) => (
                            <article
                                className="booking-card"
                                key={booking._id}
                            >
                                <div className="booking-card-top">
                                    <div className="booking-type-icon">
                                        {bookingIcons[booking.type] || "📋"}
                                    </div>

                                    <div className="booking-card-title">
                                        <p>
                                            {booking.type || "other"}
                                        </p>

                                        <h3>
                                            {booking.name}
                                        </h3>
                                    </div>

                                    <span
                                        className={`booking-status booking-status-${booking.status}`}
                                    >
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="booking-divider"></div>

                                <div className="booking-details-grid">
                                    <div className="booking-detail">
                                        <span>REFERENCE</span>
                                        <strong>
                                            {booking.bookingReference ||
                                                "Not provided"}
                                        </strong>
                                    </div>

                                    <div className="booking-detail">
                                        <span>PRICE</span>
                                        <strong className="booking-price">
                                            {formatCurrency(booking.price)}
                                        </strong>
                                    </div>

                                    <div className="booking-detail">
                                        <span>START DATE</span>
                                        <strong>
                                            {formatDate(booking.startDate)}
                                        </strong>
                                    </div>

                                    <div className="booking-detail">
                                        <span>END DATE</span>
                                        <strong>
                                            {formatDate(booking.endDate)}
                                        </strong>
                                    </div>

                                    <div className="booking-detail">
                                        <span>LOCATION</span>
                                        <strong>
                                            {booking.location ||
                                                "Not provided"}
                                        </strong>
                                    </div>
                                </div>

                                <div className="booking-card-footer">
                                    <div className="booking-document">
                                        {booking.documentUrl ? (
                                            <>
                                                📎{" "}
                                                <a
                                                    href={booking.documentUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    View document
                                                </a>
                                            </>
                                        ) : (
                                            "No document attached"
                                        )}
                                    </div>

                                    <div className="booking-card-actions">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEditForm(booking)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="booking-delete-button"
                                            onClick={() =>
                                                handleDelete(booking._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </main>

            <footer className="bookings-footer">
                <span>TripMate</span>
                <p>Plan less. Travel more.</p>
            </footer>
        </div>
    );
}

export default Bookings;