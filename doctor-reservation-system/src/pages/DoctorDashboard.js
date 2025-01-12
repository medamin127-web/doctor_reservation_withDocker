import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Card Components
const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children }) => (
    <div className="px-6 py-4 border-b border-gray-200">
        {children}
    </div>
);

const CardTitle = ({ children }) => (
    <h2 className="text-xl font-semibold text-gray-800">
        {children}
    </h2>
);

const CardContent = ({ children }) => (
    <div className="p-6">
        {children}
    </div>
);

const DoctorDashboard = () => {
    const baseUrl = "http://localhost:8080";
    const [state, setState] = useState({
        upcomingAppointments: [],
        todayAppointments: [],
        historyAppointments: [],
        loading: true,
        error: "",
        doctorId: null,
        doctorInfo: null,
        doctorName: null
    });

    // Stat Card Component
    const StatCard = ({ title, value, colorClass }) => (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <p className={`text-2xl font-bold ${colorClass} mt-2`}>{value}</p>
        </div>
    );

    // Appointment Table Component
    const AppointmentTable = ({ appointments, showActions, onComplete, onCancel }) => (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {showActions && "Date"}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        {showActions && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                        <tr key={appointment.appointmentId} className="hover:bg-gray-50">
                            {showActions && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(appointment.appointmentDateTime).toLocaleDateString()}
                                </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(appointment.appointmentDateTime).toLocaleTimeString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {appointment.patient.patientName}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                                    appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                                    'bg-yellow-100 text-yellow-800'}`}>
                                    {appointment.status}
                                </span>
                            </td>
                            {showActions && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    {appointment.status !== "COMPLETED" && (
                                        <button
                                            onClick={() => onComplete(appointment.appointmentId)}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            Complete
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onCancel(appointment.appointmentId)}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Cancel
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    useEffect(() => {
        const fetchDoctorIdAndAppointments = async () => {
            setState(prev => ({ ...prev, loading: true }));
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token found");

                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId;
                
                // Get doctor ID first
                const doctorResponse = await axios.get(`${baseUrl}/api/doctors/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const doctorId = doctorResponse.data.id;

                // Then fetch all other data
                const [todayResponse, upcomingResponse, historyResponse] = await Promise.all([
                    axios.get(`${baseUrl}/api/appointments/doctor/${doctorId}/today`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${baseUrl}/api/appointments/doctor/${doctorId}/upcoming`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${baseUrl}/api/appointments/doctor/${doctorId}/history`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setState(prev => ({
                    ...prev,
                    doctorInfo: doctorResponse.data,
                    doctorId: doctorId,
                    doctorName: decodedToken.fullName,
                    todayAppointments: todayResponse.data,
                    upcomingAppointments: upcomingResponse.data,
                    historyAppointments: historyResponse.data,
                    loading: false
                }));

            } catch (error) {
                console.error("Error fetching data:", error);
                setState(prev => ({
                    ...prev,
                    error: "Failed to fetch appointments. Please try again.",
                    loading: false
                }));
            }
        };

        fetchDoctorIdAndAppointments();
    }, []);

    const handleCompleteClick = async (appointmentId) => {
        try {
            await axios.put(`${baseUrl}/api/appointments/${appointmentId}/status`, null, {
                params: { status: "COMPLETED" }
            });
            
            setState(prev => ({
                ...prev,
                todayAppointments: prev.todayAppointments.map(appointment =>
                    appointment.appointmentId === appointmentId
                        ? { ...appointment, status: "COMPLETED" }
                        : appointment
                )
            }));
        } catch (error) {
            setState(prev => ({ ...prev, error: "Failed to update appointment status." }));
        }
    };

    const handleCancelClick = (appointmentId) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            cancelAppointment(appointmentId);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            await axios.delete(`${baseUrl}/api/appointments/${appointmentId}`);
            setState(prev => ({
                ...prev,
                todayAppointments: prev.todayAppointments.filter(
                    appointment => appointment.appointmentId !== appointmentId
                )
            }));
        } catch (error) {
            setState(prev => ({ ...prev, error: "Failed to cancel appointment." }));
        }
    };

    if (state.loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    const completedAppointmentsCount = state.historyAppointments.filter(
        appointment => appointment.status === "COMPLETED"
    ).length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {state.error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {state.error}
                </div>
            )}

            {state.doctorInfo && (
                <Card className="mb-8">
                    <CardContent>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                <img
                                    src={state.doctorInfo?.profilePictureUrl ? 
                                        `${baseUrl}${state.doctorInfo.profilePictureUrl}` : 
                                        "/path/to/default-avatar.jpg"}
                                    alt={state.doctorName || "Doctor"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-grow">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Welcome Back, Dr. {state.doctorName}
                                </h2>
                                <p className="text-gray-500">{state.doctorInfo.specialization}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto">
                                <StatCard 
                                    title="Today's Appointments" 
                                    value={state.todayAppointments.length}
                                    colorClass="text-blue-600"
                                />
                                <StatCard 
                                    title="Completed" 
                                    value={completedAppointmentsCount}
                                    colorClass="text-green-600"
                                />
                                <StatCard 
                                    title="Upcoming" 
                                    value={state.upcomingAppointments.length}
                                    colorClass="text-yellow-600"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Today's Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {state.todayAppointments.length > 0 ? (
                            <AppointmentTable
                                appointments={state.todayAppointments}
                                showActions={true}
                                onComplete={handleCompleteClick}
                                onCancel={handleCancelClick}
                            />
                        ) : (
                            <p className="text-center text-gray-500 py-4">No appointments for today.</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {state.upcomingAppointments.length > 0 ? (
                            <AppointmentTable
                                appointments={state.upcomingAppointments}
                                showActions={true}
                                onComplete={handleCompleteClick}
                                onCancel={handleCancelClick}
                            />
                        ) : (
                            <p className="text-center text-gray-500 py-4">No upcoming appointments.</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Appointment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {state.historyAppointments.length > 0 ? (
                            <AppointmentTable
                                appointments={state.historyAppointments}
                                showActions={false}
                            />
                        ) : (
                            <p className="text-center text-gray-500 py-4">No appointment history.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DoctorDashboard;