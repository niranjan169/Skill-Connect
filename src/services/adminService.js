import api from './api';

export const adminService = {
    // Dashboard
    getDashboardStats: () => api.get('/admin/dashboard'),

    // Users
    getAllUsers: () => api.get('/admin/users'),
    blockUser: (userId, active) => api.post(`/admin/users/${userId}/status?active=${active}`),

    // Recruiters
    getAllRecruiters: () => api.get('/admin/recruiters'),
    approveRecruiter: (id) => api.post(`/admin/recruiters/${id}/approve`),
    blockRecruiter: (userId, active) => api.post(`/admin/users/${userId}/status?active=${active}`),

    // Jobs
    getAllJobs: () => api.get('/admin/jobs'),
    getPendingJobs: () => api.get('/admin/jobs/pending'),
    approveJob: (id) => api.post(`/admin/jobs/${id}/approve`),
    rejectJob: (id) => api.post(`/admin/jobs/${id}/reject`),

    // Applications
    getAllApplications: () => api.get('/admin/applications'),
};
