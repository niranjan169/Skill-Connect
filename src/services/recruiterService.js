import api from './api';

export const recruiterService = {
    // Jobs
    createJob: (data) => api.post('/recruiter/jobs', data),
    getMyJobs: () => api.get('/recruiter/jobs'),
    updateJob: (id, data) => api.put(`/recruiter/jobs/${id}`, data),
    deleteJob: (id) => api.delete(`/recruiter/jobs/${id}`),

    // Applications
    getApplicants: (jobId) => api.get(`/recruiter/jobs/${jobId}/applicants`),
    filterApplicants: (jobId, filters) => api.post(`/recruiter/jobs/${jobId}/applicants/filter`, filters),
    updateApplicationStatus: (id, status, notes) => {
        const params = new URLSearchParams({ status });
        if (notes) params.append('notes', notes);
        return api.patch(`/recruiter/applications/${id}?${params.toString()}`);
    },

    // Profile
    getProfile: () => api.get('/recruiter/profile'),
    updateProfile: (data) => api.put('/recruiter/profile', data),

    // Dashboard
    getDashboardStats: () => api.get('/recruiter/dashboard'),
};
