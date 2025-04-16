import React, { useState } from 'react';
import axios from 'axios';

const AddUser = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: ''
    });

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/users', userData);
            alert('User added successfully');
        } catch (error) {
            console.error("Error adding user: ", error);
            alert('Failed to add user');
        }
    };

    return (
        <div>
            <h2>Add New User</h2>
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
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <input
                    type="text"
                    name="role"
                    value={userData.role}
                    onChange={handleChange}
                    placeholder="Role (Admin/User)"
                    required
                />
                <button type="submit">Add User</button>
            </form>
        </div>
    );
};

export default AddUser;
