import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5454',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is due to token expiration
        if (error.response?.status === 401 && error.response?.data?.message === 'jwt expired' && !originalRequest._retry) {
            originalRequest._retry = true;

            // Clear the expired token
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');

            // Redirect to login page
            window.location.href = '/login';
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default API; 