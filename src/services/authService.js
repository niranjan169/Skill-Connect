import api from './api';

export const authService = {
    loginUser: (credentials) => api.post('/auth/login', credentials),

    registerUser: (data) => api.post('/auth/register/user', data),
    registerRecruiter: (data) => api.post('/auth/register/recruiter', data),
    registerAdmin: (data) => api.post('/auth/register/admin', data),
};
