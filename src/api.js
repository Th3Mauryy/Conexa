import axios from 'axios';

// Use environment variable or fallback to /api (same domain in production)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
