import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useTripStore from "../../store/tripStore";
import "./Dashboard.css";

function Dashboard() {
    const user = useAuthStore((state) => state.user);
const logout = useAuthStore((state) => state.logout);

    const trips = useTripStore((state) => state.trips);
    const isLoading = useTripStore((state) => state.isLoading);
    const getTrips = useTripStore((state) => state.getTrips);
    const createTrip = useTripStore((state) => state.createTrip);

    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        destination: "",
        startDate: "",
        endDate: ""
    });

    useEffect(() => {
        getTrips();
    }, [getTrips]);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleCreateTrip = async (e) => {
        e.preventDefault();

        const result = await createTrip(formData);

        if (result.success) {

            setFormData({
                name: "",
                destination: "",
                startDate: "",
                endDate: ""
            });

            setShowForm(false);

            alert("Trip created successfully!");

        } else {

            alert(result.error);

        }
    };


    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );
    };


    return (
         <div className="dashboard-page">

        {/* Travel route decoration */}
        <div className="dashboard-travel-background">

            <div className="dashboard-route dashboard-route-one"></div>
            <div className="dashboard-route dashboard-route-two"></div>
            <div className="dashboard-route dashboard-route-three"></div>

            <div className="dashboard-travel-marker dashboard-marker-car">
                🚗
            </div>

            <div className="dashboard-travel-marker dashboard-marker-hotel">
                🏨
            </div>

            <div className="dashboard-travel-marker dashboard-marker-plane">
                ✈
            </div>

            <div className="dashboard-travel-marker dashboard-marker-location">
                📍
            </div>

        </div>

            {/* =========================
                NAVBAR
            ========================= */}

            <header className="dashboard-navbar">

                <Link
                    to="/dashboard"
                    className="dashboard-brand"
                >
                    <span className="dashboard-brand-icon">
                        ✈
                    </span>

                    <span>
                        TripMate
                    </span>
                </Link>


                <nav className="dashboard-nav">

                    <Link
                        to="/dashboard"
                        className="dashboard-nav-link active"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/notifications"
                        className="dashboard-nav-link"
                    >
                        Notifications
                    </Link>

                    <Link
                        to="/profile"
                        className="dashboard-nav-link"
                    >
                        Profile
                    </Link>

                    <button
    className="dashboard-logout"
    onClick={async () => {
        await logout();
        navigate("/", { replace: true });
    }}
>
    Logout
</button>

                </nav>

            </header>


            {/* =========================
                MAIN
            ========================= */}

            <main className="dashboard-main">

                <section className="dashboard-welcome">

                    <div>

                        <p className="dashboard-eyebrow">
                            YOUR TRAVEL SPACE
                        </p>

                        <h1>
                            Welcome back
                            {user?.name
                                ? `, ${user.name.split(" ")[0]}`
                                : ""}
                            
                        </h1>

                        <p className="dashboard-subtitle">
                            Ready to plan your next adventure?
                        </p>

                    </div>


                    <button
                        className="create-trip-button"
                        onClick={() =>
                            setShowForm(!showForm)
                        }
                    >
                        <span>
                            {showForm ? "×" : "+"}
                        </span>

                        {showForm
                            ? "Close"
                            : "Create New Trip"}
                    </button>

                </section>


                {/* =========================
                    CREATE TRIP FORM
                ========================= */}

                {showForm && (

                    <section className="create-trip-panel">

                        <div className="create-trip-heading">

                            <div>
                                <p className="dashboard-eyebrow">
                                    NEW ADVENTURE
                                </p>

                                <h2>
                                    Create a trip
                                </h2>
                            </div>

                            <span className="create-trip-icon">
                                🧭
                            </span>

                        </div>


                        <form
                            className="trip-form"
                            onSubmit={handleCreateTrip}
                        >

                            <div className="trip-form-field">

                                <label htmlFor="trip-name">
                                    Trip name
                                </label>

                                <input
                                    id="trip-name"
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Goa Weekend"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="trip-form-field">

                                <label htmlFor="destination">
                                    Destination
                                </label>

                                <input
                                    id="destination"
                                    type="text"
                                    name="destination"
                                    placeholder="e.g. Goa, India"
                                    value={formData.destination}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="trip-form-field">

                                <label htmlFor="start-date">
                                    Start date
                                </label>

                                <input
                                    id="start-date"
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="trip-form-field">

                                <label htmlFor="end-date">
                                    End date
                                </label>

                                <input
                                    id="end-date"
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <button
                                type="submit"
                                className="save-trip-button"
                            >
                                Create Trip
                                <span>→</span>
                            </button>

                        </form>

                    </section>

                )}


                {/* =========================
                    TRIPS
                ========================= */}

                <section className="trips-section">

                    <div className="trips-heading">

                        <div>
                            <p className="dashboard-eyebrow">
                                YOUR ADVENTURES
                            </p>

                            <h2>
                                My Trips
                            </h2>
                        </div>

                        {!isLoading && trips.length > 0 && (
                            <span className="trip-count">
                                {trips.length}{" "}
                                {trips.length === 1
                                    ? "trip"
                                    : "trips"}
                            </span>
                        )}

                    </div>


                    {isLoading && (

                        <div className="dashboard-state">
                            <div className="loading-dot"></div>
                            <p>Loading your trips...</p>
                        </div>

                    )}


                    {!isLoading && trips.length === 0 && (

                        <div className="empty-trips">

                            <div className="empty-trip-icon">
                                🧳
                            </div>

                            <h3>
                                Your next adventure starts here.
                            </h3>

                            <p>
                                Create your first trip and start
                                planning something memorable.
                            </p>

                            <button
                                className="empty-create-button"
                                onClick={() =>
                                    setShowForm(true)
                                }
                            >
                                Create Your First Trip
                                <span>→</span>
                            </button>

                        </div>

                    )}


                    {!isLoading && trips.length > 0 && (

                        <div className="trip-grid">

                            {trips.map((item) => {

                                const trip = item.trip;

                                return (

                                    <article
                                        className="trip-card"
                                        key={trip._id}
                                    >

                                        <div className="trip-card-visual">

                                            <span className="trip-destination-icon">
                                                🗺️
                                            </span>

                                            <span className="trip-role">
                                                {item.role}
                                            </span>

                                        </div>


                                        <div className="trip-card-body">

                                            <p className="trip-card-label">
                                                TRIP
                                            </p>

                                            <h3>
                                                {trip.name}
                                            </h3>

                                            <div className="trip-location">
                                                <span>📍</span>
                                                {trip.destination}
                                            </div>


                                            <div className="trip-date-row">

                                                <div>
                                                    <span>
                                                        START
                                                    </span>

                                                    <strong>
                                                        {formatDate(
                                                            trip.startDate
                                                        )}
                                                    </strong>
                                                </div>

                                                <span className="date-arrow">
                                                    →
                                                </span>

                                                <div>
                                                    <span>
                                                        END
                                                    </span>

                                                    <strong>
                                                        {formatDate(
                                                            trip.endDate
                                                        )}
                                                    </strong>
                                                </div>

                                            </div>


                                            <button
                                                className="view-trip-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/trips/${trip._id}`
                                                    )
                                                }
                                            >
                                                View Trip
                                                <span>→</span>
                                            </button>

                                        </div>

                                    </article>

                                );
                            })}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default Dashboard;