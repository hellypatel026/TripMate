import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import "./Auth.css";

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

    const [showPassword, setShowPassword] = useState(false);

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

                <div className="auth-card">
                    <div className="auth-icon">
                        ✈
                    </div>


                    <p className="auth-eyebrow">
                        WELCOME BACK
                    </p>

                    <h1>
                        Ready for your
                        <span> next journey?</span>
                    </h1>

                    <p className="auth-description">
                        Sign in to continue planning,
                        connecting and travelling together.
                    </p>


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label htmlFor="email">
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="password-input">

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Enter your password"
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
                                ? "Signing in..."
                                : "Sign In"}

                            {!isLoading && (
                                <span>→</span>
                            )}
                        </button>

                    </form>


                    <div className="auth-divider">
                        <span>or</span>
                    </div>


                    <p className="auth-switch">
                        New to TripMate?

                        <Link to="/register">
                            Create an account
                        </Link>
                    </p>

                </div>


                <div className="auth-bottom-text">
                    Plan together. Travel together. Remember together.
                </div>

            </main>

        </div>
    );
}

export default Login;