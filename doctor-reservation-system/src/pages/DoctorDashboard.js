import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const DoctorDashboard = () => {
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [historyAppointments, setHistoryAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [doctorId, setDoctorId] = useState(null);
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [doctorName,setDoctoName]= useState(null);
    useEffect(() => {
        const fetchDoctorIdAndAppointments = async () => {
            setLoading(true);
            try {
                // Fetching doctor ID from token
                const token = localStorage.getItem("token");
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const userId = decodedToken.userId;
                    setDoctoName(decodedToken.fullName)

                    // Fetch the doctor ID using the user ID
                    const response = await axios.get(`http://localhost:8080/api/doctors/user/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setDoctorId(response.data);
                    console.log(response.data)
                    // Fetch doctor details (e.g., name and picture)
                    const doctorDetails = await axios.get(`http://localhost:8080/api/doctors/${response.data}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setDoctorInfo(doctorDetails.data);


                    // Now fetch the appointments for the fetched doctor ID
                    const todayResponse = await axios.get(`http://localhost:8080/api/appointments/doctor/${response.data}/today`);
                    const historyResponse = await axios.get(`http://localhost:8080/api/appointments/doctor/${response.data}/history`);

                    setTodayAppointments(todayResponse.data);
                    setHistoryAppointments(historyResponse.data);
                }
            } catch (err) {
                setError("Failed to fetch appointments. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorIdAndAppointments();
    }, []);

    const handleCompleteClick = async (appointmentId) => {
        try {
            // Make API call to mark the appointment as completed
            await axios.put(`http://localhost:8080/api/appointments/${appointmentId}/status`, null, {
                params: { status: "COMPLETED" },
            });
            setTodayAppointments(prevAppointments =>
                prevAppointments.map(appointment =>
                    appointment.appointmentId === appointmentId
                        ? { ...appointment, status: "COMPLETED" }
                        : appointment
                )
            );
        } catch (err) {
            setError("Failed to update appointment status.");
        }
    };

    const handleCancelClick = (appointmentId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
        if (confirmCancel) {
            cancelAppointment(appointmentId);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            await axios.delete(`http://localhost:8080/api/appointments/${appointmentId}`);
            setTodayAppointments(prevAppointments =>
                prevAppointments.filter(appointment => appointment.appointmentId !== appointmentId)
            );
        } catch (err) {
            setError("Failed to cancel appointment.");
        }
    };

    // Count completed appointments for summary
    const completedAppointmentsCount = historyAppointments.filter(appointment => appointment.status === "COMPLETED").length;

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Doctor Info Panel */}
            {doctorInfo && (
                <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
                        <img
                            src={doctorInfo.profilePicture || "/path/to/default-avatar.jpg"} // Default avatar if no picture
                            alt={doctorInfo.name}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-semibold text-gray-800">Welcome Back, Dr. {doctorName}</h2>
                        <p className="text-sm text-gray-500">{doctorInfo.specialization}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center mt-4 md:mt-0">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-600">Today's Appointments</h3>
                            <p className="text-xl font-bold text-blue-600">{todayAppointments.length}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-600">Completed Appointments</h3>
                            <p className="text-xl font-bold text-green-600">{completedAppointmentsCount}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-600">Upcoming Appointments</h3>
                            <p className="text-xl font-bold text-yellow-600">
                                {todayAppointments.filter(appointment => appointment.status !== "COMPLETED").length}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Handling */}
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}

            {/* Loading Indicator */}
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div className="space-y-8">
                    {/* Today's Appointments */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Appointments</h2>
                        {todayAppointments.length > 0 ? (
                            <div className="overflow-auto">
                                <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-4 py-2">Time</th>
                                        <th className="border px-4 py-2">Patient</th>
                                        <th className="border px-4 py-2">Status</th>
                                        <th className="border px-4 py-2">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {todayAppointments.map((appointment) => (
                                        <tr key={appointment.appointmentId} className="hover:bg-gray-50">
                                            <td className="border px-4 py-2">
                                                {new Date(appointment.appointmentDateTime).toLocaleTimeString()}
                                            </td>
                                            <td className="border px-4 py-2">{appointment.patient.patientName}</td>
                                            <td className="border px-4 py-2">{appointment.status}</td>
                                            <td className="border px-4 py-2 flex gap-2">
                                                {appointment.status !== "COMPLETED" && (
                                                    <button
                                                        onClick={() => handleCompleteClick(appointment.appointmentId)}
                                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                                                    >
                                                        Mark as Completed
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleCancelClick(appointment.appointmentId)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                                                >
                                                    Cancel
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No appointments for today.</p>
                        )}
                    </div>

                    {/* Appointment History */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointment History</h2>
                        {historyAppointments.length > 0 ? (
                            <div className="overflow-auto">
                                <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-4 py-2">Date</th>
                                        <th className="border px-4 py-2">Time</th>
                                        <th className="border px-4 py-2">Patient</th>
                                        <th className="border px-4 py-2">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {historyAppointments.map((appointment) => (
                                        <tr key={appointment.appointmentId} className="hover:bg-gray-50">
                                            <td className="border px-4 py-2">
                                                {new Date(appointment.appointmentDateTime).toLocaleDateString()}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {new Date(appointment.appointmentDateTime).toLocaleTimeString()}
                                            </td>
                                            <td className="border px-4 py-2">{appointment.patient.patientName}</td>
                                            <td className="border px-4 py-2">{appointment.status}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No completed appointments.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
