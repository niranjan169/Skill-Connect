// AdminDashboardStats.java
package com.luzo_portal.dto;

import java.util.Map;

public class AdminDashboardStats {

	private long totalUsers;
	private long totalRecruiters;
	private long totalJobs;
	private long totalApplications;
	private Map<String, Long> platformGrowth;

	public long getTotalUsers() {
		return totalUsers;
	}

	public void setTotalUsers(long totalUsers) {
		this.totalUsers = totalUsers;
	}

	public long getTotalRecruiters() {
		return totalRecruiters;
	}

	public void setTotalRecruiters(long totalRecruiters) {
		this.totalRecruiters = totalRecruiters;
	}

	public long getTotalJobs() {
		return totalJobs;
	}

	public void setTotalJobs(long totalJobs) {
		this.totalJobs = totalJobs;
	}

	public long getTotalApplications() {
		return totalApplications;
	}

	public void setTotalApplications(long totalApplications) {
		this.totalApplications = totalApplications;
	}

	public AdminDashboardStats() {
	}

	public AdminDashboardStats(long totalUsers, long totalRecruiters, long totalJobs, long totalApplications,
			Map<String, Long> platformGrowth) {
		this.totalUsers = totalUsers;
		this.totalRecruiters = totalRecruiters;
		this.totalJobs = totalJobs;
		this.totalApplications = totalApplications;
		this.platformGrowth = platformGrowth;
	}

	public Map<String, Long> getPlatformGrowth() {
		return platformGrowth;
	}

	public void setPlatformGrowth(Map<String, Long> platformGrowth) {
		this.platformGrowth = platformGrowth;
	}

	// getters and setters ...
}