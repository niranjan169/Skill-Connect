package com.luzo_portal.controller;

import com.luzo_portal.dto.*;
import com.luzo_portal.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/user")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterUserRequest request) {
        return ResponseEntity.ok(authService.registerUser(request));
    }

    @PostMapping("/register/recruiter")
    public ResponseEntity<AuthResponse> registerRecruiter(@Valid @RequestBody RegisterRecruiterRequest request) {
        return ResponseEntity.ok(authService.registerRecruiter(request));
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password has been successfully reset. You may now login."));
    }

    /**
     * Exchange a valid refresh token for a new access token + rotated refresh
     * token.
     * Body: { "refreshToken": "..." }
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(authService.refresh(refreshToken));
    }

    /**
     * Invalidate the refresh token (log out from all devices sharing the same
     * token).
     * Body: { "refreshToken": "..." }
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken != null && !refreshToken.isBlank()) {
            authService.logout(refreshToken);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return ResponseEntity.ok(Map.of("error", "No auth found"));
        return ResponseEntity.ok(Map.of(
            "name", auth.getName(),
            "authorities", auth.getAuthorities().stream().map(org.springframework.security.core.GrantedAuthority::getAuthority).toList()
        ));
    }
}