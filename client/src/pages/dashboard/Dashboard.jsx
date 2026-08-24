import { useEffect } from "react";
import useAuthStore from "../../store/authStore";

function Dashboard() {

    const user = useAuthStore(
        (state) => state.user
    );

    const getMe = useAuthStore(
        (state) => state.getMe
    );


    useEffect(() => {

        getMe();

    }, [getMe]);


    return (
        <div>

            <h1>TripMate Dashboard</h1>

            {user && (
                <div>

                    <h2>
                        Welcome, {user.name}
                    </h2>

                    <p>
                        Email: {user.email}
                    </p>

                </div>
            )}

        </div>
    );
}

export default Dashboard;