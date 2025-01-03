import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../adminnav.css'; // Import CSS for styling

const AdminNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <nav className="admin-navbar">
            <div className="admin-navbar-logo">
                <Link to="/">DoctorReserve Admin</Link>
            </div>
            <ul className="admin-navbar-links">
                <li>
                    <Link to="/admin-dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link to="/admin/users">User Management</Link>
                </li>
                <li>
                    <Link to="/admin/doctors">Doctor Management</Link>
                </li>
            </ul>
            <button className="admin-navbar-logout" onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
};

export default AdminNavbar;
