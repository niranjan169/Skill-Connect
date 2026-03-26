// AuthResponse.java
package com.luzo_portal.dto;

public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String role;
    private Long userId;
    private String email;
    private String fullName;

    public AuthResponse() {
    }

    public AuthResponse(String accessToken, String refreshToken, String role, Long userId, String email, String fullName) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.role = role;
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public String getRole() {
        return role;
    }

    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }
}