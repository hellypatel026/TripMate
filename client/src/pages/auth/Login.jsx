import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

function Login() {

    const navigate = useNavigate();

    const login = useAuthStore(
        (state) => state.login
    );

    const isLoading = useAuthStore(
        (state) => state.isLoading
    );


    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        const result = await login(formData);

        if (result.success) {

            navigate("/dashboard");

        } else {

            alert(result.error);

        }

    };


    return (
        <div>

            <h1>Login to TripMate</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <br />

                <button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>

            </form>

        </div>
    );
}

export default Login;