import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import "../App.css";

const Homepage = () => {
    const [userName, setUserName] = useState("User");
    const [departments, setDepartments] = useState([]);
    const [featuredDoctors, setFeaturedDoctors] = useState([]);
    const isAuthenticated = localStorage.getItem("token");

    const departmentImages = {
        Cardiology: "https://www.concilio.com/wp-content/uploads/cardiologie-concilio-votre-conciergerie-medicale_718x452.jpg?x44843",
        Dermatology: "https://prakashhospitals.in/wp-content/uploads/2021/11/shutterstock-316085348-dermatologist-solar22-opener-1486069123.jpg",
        Neurology: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT94mk5h7_rw2rG3kYFZWOZOi4wwUl0npVy_g&s",
        Pediatrics: "https://www.hmsmirdifhospital.ae/cdn/images/banner/1000/pediatrics-and-neonatology-department-1653467809.jpg.jpg.webp",
        Otolaryngology: "https://blog.bioleagues.com/wp-content/uploads/2020/02/ent-blog-post-1.jpg",
        Orthopedics: "https://orthopedicgroupva.com/wp-content/uploads/2024/02/AdobeStock_677080334.jpeg",
        Ophthalmology: "https://images.ctfassets.net/u4vv676b8z52/14hAJjAleHpWEpthC78g53/8cd297277fe873fb61ce26ed175f5e2c/ophthalmic-hero.gif?fm=jpg&q=80",
        Psychiatry: "https://www.madinamerica.com/wp-content/uploads/2023/08/Depositphotos_566967634_S.jpg",
        Nephrology: "https://wp02-media.cdn.ihealthspot.com/wp-content/uploads/sites/197/2020/02/iStock-1156991077.jpg",
        "General Medicine": "https://www.sixsigmahospital.com/wp-content/uploads/2024/02/young-male-psysician-with-patient-measuring-blood-pressure-3-scaled.webp",
    };

    useEffect(() => {
        if (isAuthenticated) {
            try {
                const token = localStorage.getItem("token");
                const decodedToken = jwtDecode(token);
                setUserName(decodedToken.fullName || "User");
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/departments");
                setDepartments(response.data);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        const fetchFeaturedDoctors = async () => {
            try {
                // Step 1: Fetch doctors with the role DOCTOR
                const doctorsResponse = await axios.get("http://localhost:8080/api/users/doctors");
                const doctors = doctorsResponse.data;

                // Step 2: Fetch additional doctor details
                const doctorDetailsPromises = doctors.slice(0, 10).map(async (doctor) => {
                    try {
                        const doctorDetailResponse = await axios.get(`http://localhost:8080/api/doctors/user/${doctor.id}`);
                        return doctorDetailResponse.data; // This will now be a DoctorDto
                    } catch (error) {
                        console.error(`Error fetching details for doctor ID ${doctor.id}:`, error);
                        return null;
                    }
                });

                const detailedDoctors = (await Promise.all(doctorDetailsPromises)).filter(Boolean); // Filter out null values
                setFeaturedDoctors(detailedDoctors);
                console.log(detailedDoctors)
            } catch (error) {
                console.error("Error fetching featured doctors:", error);
            }
        };


        fetchDepartments();
        fetchFeaturedDoctors();
    }, []);

    return (
        <div className="homepage">
            <header className="homepage-header">
                <div className="header-content">
                    {isAuthenticated ? (
                        <>
                            <h1>Welcome, {userName}</h1>
                            <p>Find the best doctors and book appointments instantly.</p>
                        </>
                    ) : (
                        <>
                            <h1>Welcome to Doctor Reservation</h1>
                            <p>Log in or register to find the best doctors and book appointments instantly.</p>
                            <div className="auth-buttons">
                                <Link to="/login" className="button">Login</Link>
                                <Link to="/register" className="button">Register</Link>
                            </div>
                        </>
                    )}
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by specialization, location, or name..."
                        />
                        <button>Search</button>
                    </div>
                </div>
            </header>

            <section className="categories">
                <h2>Browse Specializations</h2>
                <div className="category-list">
                    {departments.map((department) => (
                        <div
                            key={department.id}
                            className="category-card"
                            onClick={() => (window.location.href = `/department/${department.name}`)}
                        >
                            <img src={departmentImages[department.name]} alt={department.name}/>
                            <div className="category-name">{department.name}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="featured-doctors">
                <h2>Featured Doctors</h2>
                <div className="doctors-list">
                    {featuredDoctors.map((doctor) => (
                        <div className="doctor-card" key={doctor.id}>
                          <img
    src={`http://localhost:8080${doctor.profilePictureUrl}` || "https://via.placeholder.com/150?text=Doctor+Image"}
    alt={`${doctor.fullName}'s profile`}
/>

                            <h3>{doctor.fullName}</h3>
                            <p> {doctor.specialization}</p>
                            <p>{doctor.qualification}</p>
                            <button  onClick={() => {
                                window.location.href = `/book-appointment/${doctor.id}`;
                            }}>Book Appointment</button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="testimonials">
                <h2>What Patients Say</h2>
                <div className="testimonials-list">
                    <div className="testimonial-card">
                        <p>"The booking process was so easy, and the doctor was excellent!"</p>
                        <h4>- Sarah Johnson</h4>
                    </div>
                    <div className="testimonial-card">
                        <p>"Great experience! The doctors were professional and helpful."</p>
                        <h4>- Michael Brown</h4>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Homepage;
