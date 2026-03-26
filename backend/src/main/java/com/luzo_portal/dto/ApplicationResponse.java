// ApplicationResponse.java
package com.luzo_portal.dto;

import com.luzo_portal.entity.ApplicationStatus;

public class ApplicationResponse {

	private Long applicationId;
	private Long jobId;
	private String jobTitle;
	private String companyName;
	private ApplicationStatus status;
	private String recruiterNotes;

	public ApplicationResponse() {
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public Long getApplicationId() {
		return applicationId;
	}

	public void setApplicationId(Long applicationId) {
		this.applicationId = applicationId;
	}

	public Long getJobId() {
		return jobId;
	}

	public void setJobId(Long jobId) {
		this.jobId = jobId;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public ApplicationStatus getStatus() {
		return status;
	}

	public void setStatus(ApplicationStatus status) {
		this.status = status;
	}

	public String getRecruiterNotes() {
		return recruiterNotes;
	}

	public void setRecruiterNotes(String recruiterNotes) {
		this.recruiterNotes = recruiterNotes;
	}
}