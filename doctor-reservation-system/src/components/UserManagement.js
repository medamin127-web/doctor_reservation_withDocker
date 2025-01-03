import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [showDoctorForm, setShowDoctorForm] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [doctorFormData, setDoctorFormData] = useState({
        specialization: "",
        qualification: "",
        departmentIds: [],
    });

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/users/patients")
            .then((response) => setUsers(response.data))
            .catch((error) => console.error("Error fetching users:", error));

        axios
            .get("http://localhost:8080/api/departments")
            .then((response) => setDepartments(response.data))
            .catch((error) => console.error("Error fetching departments:", error));
    }, []);

    const deleteUser = (userId) => {
        axios
            .delete(`http://localhost:8080/api/users/${userId}`)
            .then(() => setUsers(users.filter((user) => user.id !== userId)))
            .catch((error) => console.error("Error deleting user:", error));
    };

    const promoteToAdmin = (userId) => {
        axios
            .post(`http://localhost:8080/api/users/${userId}/promoteToAdmin`)
            .then(() => {
                alert("User promoted to Admin!");
                setUsers((prev) =>
                    prev.map((user) =>
                        user.id === userId ? { ...user, role: "ADMIN" } : user
                    )
                );
            })
            .catch((error) => console.error("Error promoting user to Admin:", error));
    };

    const openDoctorForm = (userId) => {
        setSelectedUserId(userId);
        setShowDoctorForm(true);
    };

    const submitDoctorForm = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token is missing!");
            return;
        }

        const doctorDto = {
            userId: selectedUserId,
            specialization: doctorFormData.specialization,
            qualification: doctorFormData.qualification,
            departmentIds: doctorFormData.departmentIds,
        };

        axios
            .post("http://localhost:8080/api/doctors", doctorDto, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                alert("User converted to Doctor successfully!");
                setUsers((prev) =>
                    prev.map((user) =>
                        user.id === selectedUserId ? { ...user, role: "DOCTOR" } : user
                    )
                );
                setShowDoctorForm(false);
                setDoctorFormData({
                    specialization: "",
                    qualification: "",
                    departmentIds: [],
                });
            })
            .catch((error) => {
                console.error("Error converting user to Doctor:", error.response || error);
                alert(`Error: ${error.response?.data?.message || "Conversion failed."}`);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "departmentIds") {
            const options = Array.from(e.target.options);
            const selectedIds = options
                .filter((option) => option.selected)
                .map((option) => Number(option.value));
            setDoctorFormData((prevState) => ({ ...prevState, [name]: selectedIds }));
        } else {
            setDoctorFormData((prevState) => ({ ...prevState, [name]: value }));
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">User Management</h1>
            <div className="overflow-x-auto">
                <table className="table-auto w-full bg-white rounded-lg shadow-md">
                    <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">ID</th>
                        <th className="py-3 px-6 text-left">Full Name</th>
                        <th className="py-3 px-6 text-left">Email</th>
                        <th className="py-3 px-6 text-left">Role</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                        <th className="py-3 px-6 text-center">Change Role</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-700">
                    {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6">{user.id}</td>
                            <td className="py-3 px-6">{user.fullName}</td>
                            <td className="py-3 px-6">{user.email}</td>
                            <td className="py-3 px-6">{user.role}</td>
                            <td className="py-3 px-6 text-center">
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                            <td className="py-3 px-6 text-center">
                                {user.role === "PATIENT" && (
                                    <>
                                        <button
                                            onClick={() => promoteToAdmin(user.id)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mx-1"
                                        >
                                            Promote to Admin
                                        </button>
                                        <button
                                            onClick={() => openDoctorForm(user.id)}
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mx-1"
                                        >
                                            Change to Doctor
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {showDoctorForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Convert Patient to Doctor</h2>
                    <form onSubmit={submitDoctorForm}>
                        <label className="block mb-3">
                            <span className="text-gray-600">Specialization</span>
                            <input
                                type="text"
                                name="specialization"
                                value={doctorFormData.specialization}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                required
                            />
                        </label>
                        <label className="block mb-3">
                            <span className="text-gray-600">Qualification</span>
                            <input
                                type="text"
                                name="qualification"
                                value={doctorFormData.qualification}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                required
                            />
                        </label>
                        <label className="block mb-3">
                            <span className="text-gray-600">Departments</span>
                            <select
                                name="departmentIds"
                                multiple
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                required
                            >
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDoctorForm(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
