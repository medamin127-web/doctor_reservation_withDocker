import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../App.css"; // Import the CSS file for styling

const departmentSummaries = {
    Cardiology: "The Cardiology department specializes in diagnosing and treating heart conditions. Our team of experienced cardiologists provides exceptional care for your cardiovascular health.",
    Orthopedics: "The Orthopedics department focuses on musculoskeletal issues, offering advanced treatments for bone and joint conditions.",
    "General Medicine": "General Medicine provides comprehensive healthcare for adults, addressing a wide range of illnesses and medical needs.",
    Pediatrics: "Our Pediatrics department ensures the health and well-being of children with compassionate and expert care.",
    Neurology: "The Neurology department handles conditions related to the brain and nervous system, providing cutting-edge diagnostic and treatment options.",
    Psychiatry: "Psychiatry offers mental health support, therapy, and medication management for patients dealing with psychological disorders.",
    Dermatology: "Dermatology provides expert care for skin, hair, and nail conditions, ensuring you look and feel your best.",
    Ophthalmology: "Our Ophthalmology department offers eye care services, including vision correction and treatment for eye diseases.",
    Nephrology: "The Nephrology department specializes in kidney health, treating conditions like chronic kidney disease and hypertension.",
    Otolaryngology: "Otolaryngology focuses on ear, nose, and throat care, offering advanced solutions for ENT issues.",
};

const Department = () => {
    const { departmentName } = useParams();
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/doctors/department/${departmentName}`);
                setDoctors(response.data);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        };

        fetchDoctors();
    }, [departmentName]);

    return (
        <div className="department-container">
            <h1 className="department-title">{departmentName} Department</h1>
            <p className="department-summary">{departmentSummaries[departmentName] || "Explore our expert doctors."}</p>
            <div className="doctor-list">
                {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                        <div key={doctor.id} className="doctor-card">
                            <img
                                src={doctor.user.profilePictureUrl || "https://via.placeholder.com/150"}
                                alt={doctor.user.fullName}
                                className="doctor-image"
                            />
                            <h3 className="doctor-name">{doctor.user.fullName}</h3>
                            <p className="doctor-specialization">Specialization: {doctor.specialization}</p>
                            <p className="doctor-qualification">Qualification: {doctor.qualification}</p>
                            <button
                                className="book-appointment-button"
                                onClick={() => {
                                    window.location.href = `/book-appointment/${doctor.id}`;
                                }}
                            >
                                Book Appointment
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="no-doctors-message">
                        <p>There are currently no doctors available in the {departmentName} department.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Department;