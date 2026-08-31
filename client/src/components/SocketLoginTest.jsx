import { useState } from "react";

function SocketLoginTest() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            console.log("Login response:", data);

        } catch (error) {

            console.error("Login error:", error);

        }

    };

    return (
        <div>

            <h2>Socket Login Test</h2>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
            />

            <br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            <br />

            <button onClick={login}>
                Login
            </button>

        </div>
    );
}

export default SocketLoginTest;