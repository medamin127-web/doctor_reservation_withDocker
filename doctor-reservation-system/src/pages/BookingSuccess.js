import React from "react";
import { useLocation, Link } from "react-router-dom";

const BookingSuccess = () => {
    const location = useLocation();
    const appointmentDetails = location.state?.appointmentDetails;

    if (!appointmentDetails) {
        return <p>No appointment details available.</p>;
    }

    const { date, time, doctorName, patientName, status } = appointmentDetails;

    return (
        <div className="booking-success-container">
            <div className="success-card">
                <h1 className="success-title">Appointment Confirmed 🎉</h1>
                <p className="success-message">Your appointment has been successfully scheduled. Details are below:</p>
                <div className="appointment-details">
                    <p><strong>Date:</strong> {date}</p>
                    <p><strong>Time:</strong> {time}</p>
                    <p><strong>Doctor:</strong> Dr. {doctorName}</p>
                    <p><strong>Patient:</strong> {patientName}</p>
                    <p><strong>Status:</strong> {status}</p>
                </div>
                <Link to="/" className="home-link">Go Back to Home</Link>
            </div>
        </div>
    );
};

export default BookingSuccess;
