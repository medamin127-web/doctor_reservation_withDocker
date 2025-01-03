import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users'; // Adjust URL as necessary

// Get all users
export const getAllUsers = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

// Promote user to Admin
export const promoteToAdmin = async (userId) => {
    try {
        const response = await axios.post(`${API_URL}/${userId}/promoteToAdmin`);
        return response.data;
    } catch (error) {
        console.error('Error promoting to admin:', error);
        return null;
    }
};

// Promote user to Doctor
export const promoteToDoctor = async (userId, specialization, qualification, departmentId) => {
    try {
        const response = await axios.post(
            `${API_URL}/${userId}/promoteToDoctor`,
            { specialization, qualification, departmentId }
        );
        return response.data;
    } catch (error) {
        console.error('Error promoting to doctor:', error);
        return null;
    }
};
