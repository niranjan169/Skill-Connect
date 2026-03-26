import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Solaris Interceptor: Handle JWT with robustness
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Solaris Response Interceptor: Handle global errors and refresh logic
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Auto-refresh logic if 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const res = await axios.post('/api/auth/refresh', { refreshToken });
                    const { accessToken: newToken, refreshToken: newRefresh } = res.data;
                    
                    localStorage.setItem('accessToken', newToken);
                    localStorage.setItem('refreshToken', newRefresh);
                    
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh token failed -> Force Logout
                    localStorage.clear();
                    window.location.href = '/login';
                }
            }
        }
        
        // Return clear error message from backend if available
        return Promise.reject(error.response?.data?.error || error.message || 'Server Error');
    }
);

export default api;
