import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import "./Auth.css";

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

    const [showPassword, setShowPassword] = useState(false);

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
        <div className="auth-page">

            <div className="auth-decoration auth-decoration-one"></div>
            <div className="auth-decoration auth-decoration-two"></div>

            <header className="auth-header">

                <Link to="/" className="auth-brand">

                    <span className="auth-brand-icon">
                        ✈
                    </span>

                    <span>TripMate</span>

                </Link>

                <Link
                    to="/"
                    className="back-home"
                >
                    ← Back to home
                </Link>

            </header>


            <main className="auth-main">

                <div className="auth-card register-card">

                    <div className="auth-icon">
                        ✈
                    </div>

                    <p className="auth-eyebrow">
                        START YOUR JOURNEY
                    </p>

                    <h1>
                        Your next adventure
                        <span> starts here.</span>
                    </h1>

                    <p className="auth-description">
                        Create your TripMate account and
                        start planning unforgettable trips
                        with your people.
                    </p>


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label htmlFor="name">
                                Your name
                            </label>

                            <input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="register-email">
                                Email address
                            </label>

                            <input
                                id="register-email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="register-password">
                                Password
                            </label>

                            <div className="password-input">

                                <input
                                    id="register-password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? "◉" : "◌"}
                                </button>

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Creating account..."
                                : "Create Account"}

                            {!isLoading && (
                                <span>→</span>
                            )}
                        </button>

                    </form>


                    <div className="auth-divider">
                        <span>or</span>
                    </div>


                    <p className="auth-switch">
                        Already have an account?

                        <Link to="/login">
                            Sign in
                        </Link>
                    </p>

                </div>


                <div className="auth-bottom-text">
                    One account. Every adventure.
                </div>

            </main>

        </div>
    );
}

export default Register;