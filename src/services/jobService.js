import api from './api';

export const jobService = {
    // Public/Candidate job access
    getAllJobs: () => api.get('/jobs'),
    getJobById: (id) => api.get(`/jobs/${id}`),
    searchJobs: (params) => api.get('/jobs/search', { params }),

    // Recommendation/Dashboard jobs
    getRecommendedJobs: () => api.get('/jobs/recommended'),
};
