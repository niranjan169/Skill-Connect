// RegisterRecruiterRequest.java
package com.luzo_portal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRecruiterRequest {

    @NotBlank
    private String fullName;

    @Email
    @NotBlank
    private String email;

    @Size(min = 6)
    private String password;

    @NotBlank
    private String companyName;

    @NotBlank
    private String companyWebsite;

    @NotBlank
    private String companyLocation;

    public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	private String aboutCompany;

    public RegisterRecruiterRequest() {
    }

    // getters and setters ...
    // (generate with Eclipse)
}