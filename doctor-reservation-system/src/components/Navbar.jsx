import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Navbar = ({ userRole }) => {
    const isAuthenticated = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear token and redirect to log in
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">DoctorReserve</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/">Home</Link>
                </li>

                <li>
                    <Link to="/">Book Appointment</Link>
                </li>
                <li>
                    <Link to="/">My Appointments</Link>
                </li>

                {userRole === 'DOCTOR' && (
                    <>
                        <li>
                            <Link to="/">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/">My Patients</Link>
                        </li>
                    </>
                )}
                {userRole === 'ADMIN' && (
                    <>
                        <li>
                            <Link to="/">Manage Users</Link>
                        </li>
                        <li>
                            <Link to="/">Reports</Link>
                        </li>
                    </>
                )}
                {userRole === 'PATIENT' && (
                <li>
                    <Link to="/">Profile</Link>
                </li>
                    )}
                <li>
                    {isAuthenticated ? (
                        <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-button">Login</Link>
                            <Link to="/register" className="navbar-button">Register</Link>
                        </>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;