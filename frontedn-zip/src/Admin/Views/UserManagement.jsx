import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';
import API from '../../config/api.config';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'CUSTOMER',
        mobile: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await API.get('/api/users');
            console.log('Fetched users:', response.data);
            setUsers(response.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleOpen = (user = null) => {
        if (user) {
            setSelectedUser(user);
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                password: '',
                role: user.role || 'CUSTOMER',
                mobile: user.mobile || ''
            });
        } else {
            setSelectedUser(null);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                role: 'CUSTOMER',
                mobile: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedUser) {
                const response = await API.put(`/api/users/${selectedUser._id}`, formData);
                console.log('Update response:', response.data);
                toast.success('User updated successfully');
            } else {
                const response = await API.post('/api/users', formData);
                console.log('Create response:', response.data);
                toast.success('User created successfully');
            }
            fetchUsers();
            handleClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Operation failed: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await API.delete(`/api/users/${id}`);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const columns = [
        {
            field: 'srNo',
            headerName: 'Sr. No.',
            width: 80,
            renderCell: (params) => {
                return params.id ? (
                    <span style={{ color: 'black' }}>
                        {users.findIndex(user => user._id === params.id) + 1}
                    </span>
                ) : '';
            },
        },
        { 
            field: 'firstName', 
            headerName: 'First Name', 
            width: 130,
            headerAlign: 'left',
            align: 'left',
        },
        { 
            field: 'lastName', 
            headerName: 'Last Name', 
            width: 130,
            headerAlign: 'left',
            align: 'left',
        },
        { 
            field: 'email', 
            headerName: 'Email', 
            width: 250,
            headerAlign: 'left',
            align: 'left',
        },
        { 
            field: 'role', 
            headerName: 'Role', 
            width: 130,
            headerAlign: 'left',
            align: 'left',
        },
        { 
            field: 'mobile', 
            headerName: 'Mobile', 
            width: 130,
            headerAlign: 'left',
            align: 'left',
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleOpen(params.row)}
                        style={{ marginRight: 8 }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(params.row._id)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div style={{ width: '100%', padding: '20px' }}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen()}
                style={{ marginBottom: 16 }}
            >
                Add New User
            </Button>

            <div style={{ height: '100%', width: 'fit-content', margin: '0 auto' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10, page: 0 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    autoHeight
                    disableRowSelectionOnClick
                    getRowId={(row) => row._id}
                    sx={{
                        backgroundColor: 'white',
                        boxShadow: 2,
                        border: 2,
                        borderColor: 'primary.light',
                        '& .MuiDataGrid-main': {
                            backgroundColor: 'white',
                            overflow: 'hidden',
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid #e0e0e0',
                            fontSize: '14px',
                            color: '#2e7d32',
                            padding: '8px',
                        },
                        '& .MuiDataGrid-row': {
                            '&:nth-of-type(odd)': {
                                backgroundColor: '#f5f5f5',
                            },
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                            },
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#333333',
                            color: '#ffffff',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            minHeight: '56px !important',
                            '& .MuiDataGrid-columnHeader': {
                                padding: '0 16px',
                                height: '56px',
                                backgroundColor: '#333333',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                textTransform: 'uppercase',
                                '&:focus': {
                                    outline: 'none',
                                },
                                '& .MuiDataGrid-columnHeaderTitle': {
                                    fontWeight: 'bold',
                                    color: '#ffffff',
                                },
                            },
                        },
                    }}
                />
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="dense"
                            label="First Name"
                            fullWidth
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Last Name"
                            fullWidth
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Email"
                            type="email"
                            fullWidth
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Password"
                            type="password"
                            fullWidth
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required={!selectedUser}
                        />
                        <TextField
                            margin="dense"
                            label="Role"
                            select
                            fullWidth
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            required
                        >
                            <MenuItem value="CUSTOMER">Customer</MenuItem>
                            <MenuItem value="ADMIN">Admin</MenuItem>
                        </TextField>
                        <TextField
                            margin="dense"
                            label="Mobile"
                            fullWidth
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">
                        {selectedUser ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UserManagement; 