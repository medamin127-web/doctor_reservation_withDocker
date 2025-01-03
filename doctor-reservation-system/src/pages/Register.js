import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../register.css";

const Register = () => {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("PATIENT");
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", "PATIENT");
        if (profilePicture) {
            formData.append("profilePicture", profilePicture);
        }

        try {
            await axios.post("http://localhost:8080/api/users/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/login"); // Redirect to login after successful registration
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                {/* Left Section */}
                <div className="register-image">
                    <img
                        src="https://cdn.dayschedule.com/img/solutions/doctor-appointment-booking-calendar-app.png"
                        alt="Doctor Reservation"
                    />
                    <h2>Welcome to DoctorReserve</h2>
                    <p>Your gateway to hassle-free medical appointments.</p>
                </div>

                {/* Right Section */}
                <div className="register-form">
                    <h2>Register</h2>
                    {error && <p className="error-text">{error}</p>}
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Choose a username"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Create a password"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm your password"
                            />
                        </div>

                        <div className="form-group">
                            <label>Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setProfilePicture(e.target.files[0])}
                            />
                        </div>
                        <button type="submit" className="auth-btn">
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;