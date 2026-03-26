// ApplicationRequest.java
package com.luzo_portal.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public class ApplicationRequest {

    @NotNull
    private Long jobId;

    private String education;
    private Integer yearsOfExperience;
    private List<String> skills;
    private String resumeUrl;

    public ApplicationRequest() {
    }

	public Long getJobId() {
		return jobId;
	}

	public void setJobId(Long jobId) {
		this.jobId = jobId;
	}

	public String getEducation() {
		return education;
	}

	public void setEducation(String education) {
		this.education = education;
	}

	public Integer getYearsOfExperience() {
		return yearsOfExperience;
	}

	public void setYearsOfExperience(Integer yearsOfExperience) {
		this.yearsOfExperience = yearsOfExperience;
	}

	public List<String> getSkills() {
		return skills;
	}

	public void setSkills(List<String> skills) {
		this.skills = skills;
	}

	public String getResumeUrl() {
		return resumeUrl;
	}

	public void setResumeUrl(String resumeUrl) {
		this.resumeUrl = resumeUrl;
	}

    // getters and setters ...
}