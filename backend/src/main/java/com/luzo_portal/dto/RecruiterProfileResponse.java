package com.luzo_portal.dto;

public class RecruiterProfileResponse {

    private Long id;
    private Long userId;
    private String userEmail;
    private String userName;
    private String companyName;
    private String companyWebsite;
    private String companyLocation;
    private String aboutCompany;
    private boolean approved;
    private boolean userActive;
    private long jobCount;

    public RecruiterProfileResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyWebsite() {
        return companyWebsite;
    }

    public void setCompanyWebsite(String companyWebsite) {
        this.companyWebsite = companyWebsite;
    }

    public String getCompanyLocation() {
        return companyLocation;
    }

    public void setCompanyLocation(String companyLocation) {
        this.companyLocation = companyLocation;
    }

    public String getAboutCompany() {
        return aboutCompany;
    }

    public void setAboutCompany(String aboutCompany) {
        this.aboutCompany = aboutCompany;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public boolean isUserActive() {
        return userActive;
    }

    public void setUserActive(boolean userActive) {
        this.userActive = userActive;
    }

    public long getJobCount() {
        return jobCount;
    }

    public void setJobCount(long jobCount) {
        this.jobCount = jobCount;
    }
}
