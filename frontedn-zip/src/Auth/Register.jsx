import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Box, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import API from '../config/api.config';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            const { confirmPassword, ...submitData } = formData;
            await API.post('/api/auth/register', submitData);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.error || 'Registration failed');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    mt: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    backgroundColor: 'white',
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 1,
                    '& .MuiTextField-root': {
                        backgroundColor: 'white',
                    },
                }}
            >
                <TextField
                    required
                    fullWidth
                    name="firstName"
                    placeholder="First Name *"
                    variant="outlined"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    InputProps={{
                        sx: { borderRadius: 2 }
                    }}
                />

                <TextField
                    required
                    fullWidth
                    name="lastName"
                    placeholder="Last Name *"
                    variant="outlined"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    InputProps={{
                        sx: { borderRadius: 2 }
                    }}
                />

                <TextField
                    required
                    fullWidth
                    name="email"
                    placeholder="Email *"
                    type="email"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                        sx: { borderRadius: 2 }
                    }}
                />

                <TextField
                    required
                    fullWidth
                    name="password"
                    placeholder="Password *"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                        sx: { borderRadius: 2 },
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    placeholder="Confirm Password *"
                    type={showConfirmPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                        sx: { borderRadius: 2 },
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 2,
                        mb: 2,
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor: '#7e57c2',
                        '&:hover': {
                            backgroundColor: '#5e35b1'
                        },
                        fontSize: '1rem',
                        fontWeight: 'normal'
                    }}
                >
                    REGISTER
                </Button>

                <Box sx={{ textAlign: 'center', mt: 1 }}>
                    <span style={{ color: '#000' }}>if you have already account? </span>
                    <Button
                        onClick={() => navigate('/login')}
                        sx={{
                            textTransform: 'uppercase',
                            color: '#7e57c2',
                            '&:hover': {
                                backgroundColor: 'transparent',
                                color: '#5e35b1'
                            }
                        }}
                    >
                        LOGIN
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Register; 