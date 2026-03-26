package com.luzo_portal.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "recruiter_profiles")
public class RecruiterProfile extends BaseEntity {

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String companyWebsite;

    @Column(nullable = false)
    private String companyLocation;

    private String aboutCompany;

    @Column(nullable = false)
    private boolean approved = false;

    public RecruiterProfile() {
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
}