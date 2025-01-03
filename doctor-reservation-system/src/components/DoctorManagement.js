import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorManagement = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/users/doctors")
            .then((response) => setDoctors(response.data))
            .catch((error) => console.error("Error fetching doctors:", error));
    }, []);

    const deleteDoctor = (doctorId) => {
        axios
            .delete(`http://localhost:8080/api/users/doctors/${doctorId}`)
            .then(() => setDoctors(doctors.filter((doctor) => doctor.id !== doctorId)))
            .catch((error) => console.error("Error deleting doctor:", error));
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
                Doctor Management
            </h1>
            <div className="overflow-x-auto">
                <table className="table-auto w-full bg-white rounded-lg shadow-md">
                    <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">ID</th>
                        <th className="py-3 px-6 text-left">Name</th>
                        <th className="py-3 px-6 text-left">Email</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-700">
                    {doctors.map((doctor) => (
                        <tr
                            key={doctor.id}
                            className="border-b border-gray-200 hover:bg-gray-100"
                        >
                            <td className="py-3 px-6">{doctor.id}</td>
                            <td className="py-3 px-6">{doctor.fullName}</td>
                            <td className="py-3 px-6">{doctor.email}</td>
                            <td className="py-3 px-6 text-center">
                                <button
                                    onClick={() => deleteDoctor(doctor.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DoctorManagement;
