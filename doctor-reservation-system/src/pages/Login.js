import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../register.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                username,
                password,
            });
            const { token, role} = response.data;


            // Save token to local storage
            localStorage.setItem("token", token);
            localStorage.setItem("role",role);

            // Decode token to get user role
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const userRole = decodedToken.role;


            // Navigate based on role
            if (role === "PATIENT") {
                navigate("/");
            } else if (role === "DOCTOR") {
                navigate("/doctor-dashboard");
            } else if (role === "ADMIN") {
                navigate("/admin-dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid username or password.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login to DoctorReserve</h2>
                <p>Manage your appointments with ease.</p>
                {error && <p className="error-text">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="auth-btn">
                        Login
                    </button>
                </form>
                <div className="extra-links">
                    <p>
                        Don't have an account? <a href="/register">Register here</a>
                    </p>
                    <p>
                        Forgot password? <a href="/forgot-password">Click here</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
