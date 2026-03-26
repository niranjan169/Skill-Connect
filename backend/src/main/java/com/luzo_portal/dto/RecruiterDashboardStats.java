package com.luzo_portal.dto;

import java.util.List;
import java.util.Map;

public class RecruiterDashboardStats {

    private long totalJobsPosted;
    private long approvedJobs;
    private long pendingJobs;
    private long totalApplications;
    private long newApplications;
    private long shortlistedCandidates;
    private long rejectedCandidates;
    private long selectedCandidates;

    // Virtual fields for frontend mapping
    private long totalJobs;
    private long shortlisted;
    private long selected;
    private List<CandidateApplicationResponse> recentCandidates;

    private Map<String, Long> applicationsByStatus;
    private Map<String, Long> applicationsPerJob;
    private String companyName;
    private boolean profileApproved;

    public RecruiterDashboardStats() {
    }

    public RecruiterDashboardStats(long totalJobsPosted, long approvedJobs, long pendingJobs,
            long totalApplications, long newApplications, long shortlistedCandidates,
            long rejectedCandidates, long selectedCandidates,
            Map<String, Long> applicationsByStatus, Map<String, Long> applicationsPerJob,
            String companyName, boolean profileApproved,
            List<CandidateApplicationResponse> recentCandidates) {
        this.totalJobsPosted = totalJobsPosted;
        this.approvedJobs = approvedJobs;
        this.pendingJobs = pendingJobs;
        this.totalApplications = totalApplications;
        this.newApplications = newApplications;
        this.shortlistedCandidates = shortlistedCandidates;
        this.rejectedCandidates = rejectedCandidates;
        this.selectedCandidates = selectedCandidates;
        this.applicationsByStatus = applicationsByStatus;
        this.applicationsPerJob = applicationsPerJob;
        this.companyName = companyName;
        this.profileApproved = profileApproved;
        this.recentCandidates = recentCandidates;

        // Populate virtual fields
        this.totalJobs = totalJobsPosted;
        this.shortlisted = shortlistedCandidates;
        this.selected = selectedCandidates;
    }

    public Map<String, Long> getApplicationsByStatus() {
        return applicationsByStatus;
    }

    public void setApplicationsByStatus(Map<String, Long> applicationsByStatus) {
        this.applicationsByStatus = applicationsByStatus;
    }

    public Map<String, Long> getApplicationsPerJob() {
        return applicationsPerJob;
    }

    public void setApplicationsPerJob(Map<String, Long> applicationsPerJob) {
        this.applicationsPerJob = applicationsPerJob;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public boolean isProfileApproved() {
        return profileApproved;
    }

    public void setProfileApproved(boolean profileApproved) {
        this.profileApproved = profileApproved;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getShortlisted() {
        return shortlisted;
    }

    public void setShortlisted(long shortlisted) {
        this.shortlisted = shortlisted;
    }

    public long getSelected() {
        return selected;
    }

    public void setSelected(long selected) {
        this.selected = selected;
    }

    public List<CandidateApplicationResponse> getRecentCandidates() {
        return recentCandidates;
    }

    public void setRecentCandidates(List<CandidateApplicationResponse> recentCandidates) {
        this.recentCandidates = recentCandidates;
    }
}
