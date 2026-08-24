import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

function Register() {

    const navigate = useNavigate();

    const register = useAuthStore(
        (state) => state.register
    );

    const isLoading = useAuthStore(
        (state) => state.isLoading
    );


    const [formData, setFormData] = useState({
        name: "",
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

        const result = await register(formData);

        if (result.success) {

            navigate("/dashboard");

        } else {

            alert(result.error);

        }

    };


    return (
        <div>

            <h1>Create TripMate Account</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <br />

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
                    {isLoading
                        ? "Creating account..."
                        : "Register"}
                </button>

            </form>

        </div>
    );
}

export default Register;