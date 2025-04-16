import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const DeleteUser = ({ userId }) => {
    const history = useHistory();

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/users/${userId}`);
            alert('User deleted successfully');
            history.push('/admin/dashboard');  // Redirect to dashboard after success
        } catch (error) {
            console.error("Error deleting user: ", error);
            alert('Failed to delete user');
        }
    };

    return (
        <button onClick={handleDelete}>Delete User</button>
    );
};

export default DeleteUser;

