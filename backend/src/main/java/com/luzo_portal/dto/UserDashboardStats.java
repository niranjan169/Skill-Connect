package com.luzo_portal.dto;

import com.luzo_portal.entity.ApplicationStatus;

import java.util.Map;

public class UserDashboardStats {

    private long totalApplications;
    private long appliedCount;
    private long shortlistedCount;
    private long rejectedCount;
    private long selectedCount;
    private long savedJobsCount;

    // Virtual fields for frontend mapping
    private long savedJobs;
    private long activeApplications;
    private long rejectedApplications;

    private Map<String, Long> applicationsByStatus;

    public UserDashboardStats() {
    }

    public UserDashboardStats(long totalApplications, long appliedCount, long shortlistedCount,
            long rejectedCount, long selectedCount, long savedJobsCount,
            Map<String, Long> applicationsByStatus) {
        this.totalApplications = totalApplications;
        this.appliedCount = appliedCount;
        this.shortlistedCount = shortlistedCount;
        this.rejectedCount = rejectedCount;
        this.selectedCount = selectedCount;
        this.savedJobsCount = savedJobsCount;
        this.applicationsByStatus = applicationsByStatus;

        // Populate virtual fields
        this.savedJobs = savedJobsCount;
        this.activeApplications = appliedCount + shortlistedCount;
        this.rejectedApplications = rejectedCount;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getAppliedCount() {
        return appliedCount;
    }

    public void setAppliedCount(long appliedCount) {
        this.appliedCount = appliedCount;
    }

    public long getShortlistedCount() {
        return shortlistedCount;
    }

    public void setShortlistedCount(long shortlistedCount) {
        this.shortlistedCount = shortlistedCount;
    }

    public long getRejectedCount() {
        return rejectedCount;
    }

    public void setRejectedCount(long rejectedCount) {
        this.rejectedCount = rejectedCount;
    }

    public long getSelectedCount() {
        return selectedCount;
    }

    public void setSelectedCount(long selectedCount) {
        this.selectedCount = selectedCount;
    }

    public long getSavedJobsCount() {
        return savedJobsCount;
    }

    public void setSavedJobsCount(long savedJobsCount) {
        this.savedJobsCount = savedJobsCount;
    }

    public Map<String, Long> getApplicationsByStatus() {
        return applicationsByStatus;
    }

    public void setApplicationsByStatus(Map<String, Long> applicationsByStatus) {
        this.applicationsByStatus = applicationsByStatus;
    }

    public long getSavedJobs() {
        return savedJobs;
    }

    public void setSavedJobs(long savedJobs) {
        this.savedJobs = savedJobs;
    }

    public long getActiveApplications() {
        return activeApplications;
    }

    public void setActiveApplications(long activeApplications) {
        this.activeApplications = activeApplications;
    }

    public long getRejectedApplications() {
        return rejectedApplications;
    }

    public void setRejectedApplications(long rejectedApplications) {
        this.rejectedApplications = rejectedApplications;
    }
}
