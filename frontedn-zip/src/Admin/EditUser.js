import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

const EditUser = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: ''
    });

    const { userId } = useParams();  // Get user ID from URL
    const history = useHistory();

    useEffect(() => {
        // Fetch user data to pre-fill the form
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/users/${userId}`);
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };
        fetchUserData();
    }, [userId]);

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/users/${userId}`, userData);
            alert('User updated successfully');
            history.push('/admin/dashboard');  // Redirect to dashboard after success
        } catch (error) {
            console.error("Error updating user: ", error);
            alert('Failed to update user');
        }
    };

    return (
        <div>
            <h2>Edit User</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="text"
                    name="role"
                    value={userData.role}
                    onChange={handleChange}
                    placeholder="Role"
                    required
                />
                <button type="submit">Update User</button>
            </form>
        </div>
    );
};

export default EditUser;

