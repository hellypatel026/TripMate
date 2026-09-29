import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import useAuthStore from "./store/authStore";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import TripDetails from "./pages/trip/TripDetails";
import "./App.css";
import TripChat from "./pages/chat/TripChat";
import { useParams } from "react-router-dom";
import Gallery from "./pages/gallery/Gallery";
import Notifications from "./pages/notifications/Notifications";
import Profile from "./pages/profile/Profile";
function TripChatWrapper() {
    const { tripId } = useParams();

    return <TripChat tripId={tripId} />;
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

                <Route
                    path="/"
                    element={<h1>Welcome to TripMate</h1>}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />
                <Route
                    path="/trips/:tripId"
                    element={<TripDetails />}
                />
                <Route
                    path="/trips/:tripId/chat"
                    element={<TripChatWrapper />}
                />
                <Route
                    path="/trips/:tripId/gallery"
                    element={<Gallery />}
                />
                <Route
                    path="/notifications"
                    element={<Notifications />}
                />
                <Route
                    path="/profile"
                    element={<Profile />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;