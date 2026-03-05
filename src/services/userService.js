import api from './api';

export const userService = {
    // Jobs
    getAllJobs: () => api.get('/user/jobs'),
    getJobById: (id) => api.get(`/user/jobs/${id}`),
    searchJobs: (filters) => api.post('/user/jobs/search', filters),

    // Applications
    applyForJob: (data) => api.post('/user/applications', data),
    getMyApplications: () => api.get('/user/applications'),

    // Saved Jobs
    saveJob: (jobId) => api.post(`/user/jobs/${jobId}/save`),
    getSavedJobs: () => api.get('/user/saved-jobs'),
    unsaveJob: (jobId) => api.delete(`/user/jobs/${jobId}/save`),

    // Profile
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data),

    // Dashboard stats
    getDashboardStats: () => api.get('/user/dashboard'),
};
