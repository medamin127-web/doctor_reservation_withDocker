import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import HomePage from './pages/Homepage';
import Footer from './components/Footer';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Department from "./pages/Department";
import BookAppointment from "./pages/BookAppointment";
import BookingSuccess from "./pages/BookingSuccess";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from './components/UserManagement';
import DoctorManagement from './components/DoctorManagement';



function App() {

    const location = useLocation();
    const userRole = localStorage.getItem('role');

    // Define admin routes
    const adminRoutes = ['/admin/users', '/admin/doctors', '/admin-dashboard'];
    const isAdminRoute = adminRoutes.includes(location.pathname);

    // Define excluded routes
    const excludedRoutes = ['/login', '/register'];
    const isExcluded = excludedRoutes.includes(location.pathname);

    return (
        <>
            {/* Conditionally render the navbar */}
            {!isExcluded && (
                isAdminRoute ? (
                    <AdminNavbar />
                ) : (
                    <Navbar userRole={userRole} />
                )
            )}

            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/doctors" element={<DoctorManagement />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/department/:departmentName" element={<Department />} />
                    <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
                    <Route path="/booking-success" element={<BookingSuccess />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </main>

            {/* Render Footer */}
            {!isExcluded && <Footer />}
        </>
    );
}

const Root = () => (
    <Router>
        <App />
    </Router>
);

export default Root;