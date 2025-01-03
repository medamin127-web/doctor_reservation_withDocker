import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/admin/users" className="bg-blue-500 text-white p-6 rounded-lg shadow-md hover:bg-blue-600">
                    <h2 className="text-2xl font-semibold mb-2">User Management</h2>
                    <p>Manage all users, promote them to Admins, or convert to Doctors.</p>
                </Link>
                <Link to="/admin/doctors" className="bg-green-500 text-white p-6 rounded-lg shadow-md hover:bg-green-600">
                    <h2 className="text-2xl font-semibold mb-2">Doctor Management</h2>
                    <p>View and manage the list of Doctors in the system.</p>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
