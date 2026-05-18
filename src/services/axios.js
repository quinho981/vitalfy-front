import axios from 'axios';
import router from '@/router';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const STATUS = error?.response?.status;
        const REQUIRES_PRO = error.response?.data?.requires_pro
        
        if (STATUS === 403 && !REQUIRES_PRO) {
            router.push({ name: 'error' }); 
        }

        return Promise.reject(error);
    }
);

export default api;
