import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Users List</h2>
      <Link to="/admin/users/add">Add New User</Link>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <p>{user.firstName} {user.lastName} ({user.email})</p>
            <Link to={`/admin/users/edit/${user._id}`}>Edit</Link>
            {/* You can add a Delete button here as well */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
