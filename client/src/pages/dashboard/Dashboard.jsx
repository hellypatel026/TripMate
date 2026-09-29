import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import useTripStore from "../../store/tripStore";
import { useNavigate } from "react-router-dom";
function Dashboard() {

    const user = useAuthStore((state) => state.user);

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

    return (
        <div>

            <h1>TripMate Dashboard</h1>
            <button
                onClick={() => {
                    window.location.href = "/profile";
                }}
            >
                My Profile
            </button>
            <button
                onClick={() => {
                    window.location.href = "/notifications";
                }}
            >
                Notifications
            </button>
            {user && (
                <div>
                    <h2>Welcome, {user.name}</h2>
                    <p>Email: {user.email}</p>
                </div>
            )}

            <hr />

            <h2>My Trips</h2>

            <button
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? "Cancel" : "Create New Trip"}
            </button>

            {showForm && (
                <div>

                    <h3>Create Trip</h3>

                    <form onSubmit={handleCreateTrip}>

                        <input
                            type="text"
                            name="name"
                            placeholder="Trip Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <br /><br />

                        <input
                            type="text"
                            name="destination"
                            placeholder="Destination"
                            value={formData.destination}
                            onChange={handleChange}
                            required
                        />

                        <br /><br />

                        <label>Start Date</label>
                        <br />

                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />

                        <br /><br />

                        <label>End Date</label>
                        <br />

                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />

                        <br /><br />

                        <button type="submit">
                            Create Trip
                        </button>

                    </form>

                </div>
            )}

            <hr />

            {isLoading && (
                <p>Loading trips...</p>
            )}

            {!isLoading && trips.length === 0 && (
                <p>You don't have any trips yet.</p>
            )}

            {!isLoading && trips.length > 0 && (
                <div>

                    {trips.map((item) => {

                        const trip = item.trip;

                        return (
                            <div key={trip._id}>

                                <h3
                                    onClick={() => navigate(`/trips/${trip._id}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {trip.name}
                                </h3>

                                <p>
                                    Destination: {trip.destination}
                                </p>

                                <p>
                                    Start Date: {trip.startDate}
                                </p>

                                <p>
                                    End Date: {trip.endDate}
                                </p>

                                <p>
                                    Role: {item.role}
                                </p>

                                <hr />

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
}

export default Dashboard;