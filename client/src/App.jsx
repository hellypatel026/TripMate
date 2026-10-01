import { useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from "react-router-dom";

import useAuthStore from "./store/authStore";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import TripDetails from "./pages/trip/TripDetails";
import TripChatPage from "./pages/chat/tripChatPage";
import Gallery from "./pages/gallery/Gallery";
import Notifications from "./pages/notifications/Notifications";
import Profile from "./pages/profile/Profile";
import Expenses from "./pages/expenses/Expenses";
import Itinerary from "./pages/itinerary/Itinerary";
import Bookings from "./pages/bookings/Bookings";

import "./App.css";


function LandingPage() {
    return (
        <div className="landing-page">

            {/* Decorative travel background */}

            <div className="travel-background">

                <div className="route route-one"></div>
                <div className="route route-two"></div>
                <div className="route route-three"></div>
                <div className="route route-four"></div>

                <div className="travel-marker marker-plane">
                    ✈
                </div>

                <div className="travel-marker marker-location">
                    📍
                </div>

                <div className="travel-marker marker-hotel">
                    🏨
                </div>

                <div className="travel-marker marker-food">
                    🍴
                </div>

                <div className="travel-marker marker-bus">
                    🚌
                </div>

                <div className="travel-marker marker-camera">
                    📸
                </div>

            </div>


            {/* Navbar */}

            <header className="landing-navbar">

                <Link to="/" className="brand">

                    <span className="brand-icon">
                        ✈
                    </span>

                    <span>
                        TripMate
                    </span>

                </Link>


                <nav className="landing-nav-links">

                    <a href="#features">
                        What We Do
                    </a>

                    <Link
                        to="/login"
                        className="nav-signin"
                    >
                        Sign In
                    </Link>

                    <Link
                        to="/register"
                        className="nav-signup"
                    >
                        Sign Up
                    </Link>

                </nav>

            </header>


            <main>

                {/* HERO */}

                <section className="about-hero">

                    <div className="hero-badge">
                        Travel Together.Travel Better.
                    </div>


                    <h1>
                        Your journey.
                        <br />
                        <span>One place.</span>
                    </h1>


                    <p>
                        TripMate brings your entire group trip
                        together, from planning and itineraries
                        to conversations, expenses and memories.
                    </p>


                    <div className="hero-actions">

                        <Link
                            to="/register"
                            className="primary-button"
                        >
                            Start Your Journey
                            <span>→</span>
                        </Link>

                        <a
                            href="#features"
                            className="secondary-button"
                        >
                            Discover TripMate
                        </a>

                    </div>

                </section>


                {/* FEATURES */}

                <section
                    id="features"
                    className="features-section"
                >

                    <div className="section-label">
                        <h2>WHAT TRIPMATE HELPS YOU DO</h2>
                    </div>

                    <h2>
                        Everything your trip needs.
                    </h2>


                    <div className="feature-grid">

                        <div className="feature-card">

                            <div className="feature-icon">
                                🗺️
                            </div>

                            <h3>
                                Plan together
                            </h3>

                            <p>
                                Build and organize your
                                itinerary with your entire group.
                            </p>

                        </div>


                        <div className="feature-card">

                            <div className="feature-icon">
                                💬
                            </div>

                            <h3>
                                Stay connected
                            </h3>

                            <p>
                                Keep conversations and trip
                                updates in one shared place.
                            </p>

                        </div>


                        <div className="feature-card">

                            <div className="feature-icon">
                                💰
                            </div>

                            <h3>
                                Share expenses
                            </h3>

                            <p>
                                Track spending and make group
                                expenses easier to manage.
                            </p>

                        </div>


                        <div className="feature-card">

                            <div className="feature-icon">
                                📸
                            </div>

                            <h3>
                                Save memories
                            </h3>

                            <p>
                                Keep your group's favorite
                                moments together in one gallery.
                            </p>

                        </div>

                    </div>

                </section>


                {/* QUOTE */}

                <section
                    id="journey"
                    className="quote-section"
                >

                    <div className="quote-mark">
                        “
                    </div>

                    <blockquote>
                        Jobs fill your pocket,
                        but adventures fill your soul.
                    </blockquote>

                    <p>
                        The best journeys are the ones
                        shared with the right people.
                    </p>

                </section>

            </main>


            {/* FOOTER */}

            <footer className="landing-footer">

                <div className="brand">

                    <span className="brand-icon">
                        ✈
                    </span>

                    <span>
                        TripMate
                    </span>

                </div>

                <p>
                    Plan less. Travel more.
                </p>

            </footer>

        </div>
    );
}


function App() {

    const getMe = useAuthStore(
        (state) => state.getMe
    );

    useEffect(() => {
        getMe();
    }, [getMe]);

    return (
        <BrowserRouter>

            <Routes>

                {/* Landing */}

                <Route
                    path="/"
                    element={<LandingPage />}
                />


                {/* Authentication */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* Dashboard */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />


                {/* Trip Details */}

                <Route
                    path="/trips/:tripId"
                    element={<TripDetails />}
                />


                {/* Trip Chat */}

                <Route
                    path="/trips/:tripId/chat"
                    element={<TripChatPage />}
                />


                {/* Gallery */}

                <Route
                    path="/trips/:tripId/gallery"
                    element={<Gallery />}
                />


                {/* Expenses */}

                <Route
                    path="/trips/:tripId/expenses"
                    element={<Expenses />}
                />
                <Route
                    path="/trips/:tripId/itinerary"
                    element={<Itinerary />}
                />
                <Route
                    path="/trips/:tripId/bookings"
                    element={<Bookings />}
                />


                {/* Notifications */}

                <Route
                    path="/notifications"
                    element={<Notifications />}
                />


                {/* Profile */}

                <Route
                    path="/profile"
                    element={<Profile />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;