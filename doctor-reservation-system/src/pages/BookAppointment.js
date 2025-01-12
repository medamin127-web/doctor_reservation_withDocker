import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../App.css"
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";


const BookAppointment = () => {
    const baseUrl = "http://localhost:8080";
    const navigate = useNavigate();
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [doctorAvailability, setDoctorAvailability] = useState({});
    const [appointmentDetails, setAppointmentDetails] = useState({
        patientName: "",
        email: "",
        reason: "",
    });
    const [successMessage, setSuccessMessage] = useState("");

    // Fetch doctor details
    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/doctors/${doctorId}`);
               
                setDoctor(response.data);
                console.log(doctor);
            } catch (error) {
                console.error("Error fetching doctor details:", error);
            }
        };

        fetchDoctorDetails();
    }, [doctorId]);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/appointments/doctor/${doctorId}/availability`);
                setDoctorAvailability(response.data);

            } catch (error) {
                console.error("Error fetching availability:", error);
            }
        };
        fetchAvailability();

    }, [doctorId]);



    useEffect(() => {
        if (!selectedDate || !doctorAvailability) return;

        const selectedDay = selectedDate.toLocaleDateString("en-CA");
        const bookedTimes = doctorAvailability[selectedDay]?.map((time) =>
            time.slice(0, 5) // Convert "HH:mm:ss" to "HH:mm"
        ) || [];
        const allSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

        // Filter out booked slots
        const availableSlots = allSlots.filter((slot) => !bookedTimes.includes(slot));
        setTimeSlots(availableSlots);
    }, [selectedDate, doctorAvailability]);


    // Handle form inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAppointmentDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const tileClassName = ({ date, view }) => {
        if (!doctorAvailability || view !== 'month') return null; // Prevent errors

        const dateString = date.toLocaleDateString("en-CA"); // Format the date to match the keys in doctorAvailability
        return doctorAvailability[dateString] ? 'available' : null;
    };

    const tileDisabled = ({ date, view }) => {
        if (view !== "month") return false; // Only disable tiles in the month view

        const today = new Date();
        const dateString = date.toLocaleDateString("en-CA"); // Format date as YYYY-MM-DD

        // Disable past dates
        if (date <= today.setHours(0, 0, 0, 0)) {
            return true;
        }

        // Check if the date exists in doctorAvailability
        const bookedTimes = doctorAvailability[dateString] || [];
        const allSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

        // If all timeslots are booked, disable the date
        return bookedTimes.length === allSlots.length;
    };

    // Submit appointment
    const handleBookAppointment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);


        const appointmentData = {
            patientId: decodedToken.userId, // Use the patient ID
            doctorId: doctorId, // Use the doctor ID
            dateTime: `${selectedDate.toLocaleDateString("en-CA")}T${selectedTime}`, // Format as yyyy-MM-ddTHH:mm
        };

        try {
            const response = await axios.post("http://localhost:8080/api/appointments/book", appointmentData);
            // Construct appointment details to pass to success page
            const appointmentDetails = {
                date: selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }),
                time: selectedTime,
                doctorName: doctor.user.fullName,
                patientName: decodedToken.fullName,
                status: "Scheduled",


            };


            navigate("/booking-success", { state: { appointmentDetails } });
        } catch (error) {
            console.error("Error booking appointment:", error);
        }
    };

    return (
        <div className="book-appointment">
            {doctor ? (
                <div>
                    <header className="doctor-header">
                        <img
                            src={`${baseUrl}${doctor.user.profilePictureUrl}` || "https://via.placeholder.com/150"}
                            alt={doctor.user.fullName}
                        />
                        <div>
                            <h2>Dr. {doctor.user.fullName}</h2>
                            <p>Specialization: {doctor.specialization}</p>
                            <p>Qualification: {doctor.qualification}</p>
                        </div>
                    </header>

                    <main>
                        <div className="appointment-step">
                            <h3>Step 1: Select a Date</h3>
                            <Calendar
                                onChange={setSelectedDate}
                                value={selectedDate}
                                tileDisabled={tileDisabled }
                                tileClassName={tileClassName}
                            />
                        </div>

                        <div className="appointment-step">
                            <h3>Step 2: Select a Time Slot</h3>
                            <div className="time-slots">
                                {timeSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        className={`time-slot ${slot === selectedTime ? "selected" : ""}`}
                                        onClick={() => setSelectedTime(slot)}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="">
                            <form onSubmit={handleBookAppointment} className="confirm-form" >

                                <button type="submit" className="confirm-button">
                                    Confirm Booking
                                </button>
                            </form>
                        </div>

                        {successMessage && (
                            <div className="success-message">
                                <h3>🎉 {successMessage}</h3>
                                <p>We look forward to seeing you soon!</p>
                            </div>
                        )}
                    </main>
                </div>
            ) : (
                <p>Loading doctor details...</p>
            )}
        </div>
    );
};

export default BookAppointment;
