package com.luzo_portal.service.impl;

import com.luzo_portal.dto.*;
import com.luzo_portal.entity.RecruiterProfile;
import com.luzo_portal.entity.RefreshToken;
import com.luzo_portal.entity.Skill;
import com.luzo_portal.entity.User;
import com.luzo_portal.exception.BadRequestException;
import com.luzo_portal.repository.RecruiterProfileRepository;
import com.luzo_portal.repository.SkillRepository;
import com.luzo_portal.repository.UserRepository;
import com.luzo_portal.security.CustomUserDetails;
import com.luzo_portal.security.JwtService;
import com.luzo_portal.security.Role;
import com.luzo_portal.service.ActivityLogService;
import com.luzo_portal.service.AuthService;
import com.luzo_portal.service.RefreshTokenService;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final ActivityLogService activityLogService;
    private final RefreshTokenService refreshTokenService;

    public AuthServiceImpl(UserRepository userRepository,
            SkillRepository skillRepository,
            RecruiterProfileRepository recruiterProfileRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            ActivityLogService activityLogService,
            RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.activityLogService = activityLogService;
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    public AuthResponse registerUser(RegisterUserRequest request) {
        if (userRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setLocation(request.getLocation());
        user.setYearsOfExperience(request.getYearsOfExperience());
        user.setEducation(request.getEducation());
        user.setSkills(resolveSkills(request.getSkills()));

        User savedUser = userRepository.save(user);
        activityLogService.log(savedUser.getId(), "USER_REGISTERED", "Registered user: " + savedUser.getEmail());

        String accessToken = jwtService.generateToken(new CustomUserDetails(savedUser), savedUser.getRole());
        String refreshToken = refreshTokenService.createRefreshToken(savedUser).getToken();
        return new AuthResponse(accessToken, refreshToken, savedUser.getRole().name(),
                savedUser.getId(), savedUser.getEmail(), savedUser.getFullName());
    }

    @Override
    public AuthResponse registerRecruiter(RegisterRecruiterRequest request) {
        if (userRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.RECRUITER);

        User savedUser = userRepository.save(user);

        RecruiterProfile profile = new RecruiterProfile();
        profile.setUser(savedUser);
        profile.setCompanyName(request.getCompanyName());
        profile.setCompanyWebsite(request.getCompanyWebsite());
        profile.setCompanyLocation(request.getCompanyLocation());
        profile.setAboutCompany(request.getAboutCompany());
        profile.setApproved(true); // Auto-approve recruiter profile

        recruiterProfileRepository.save(profile);
        activityLogService.log(savedUser.getId(), "RECRUITER_REGISTERED",
                "Registered recruiter for " + request.getCompanyName());

        String accessToken = jwtService.generateToken(new CustomUserDetails(savedUser), savedUser.getRole());
        String refreshToken = refreshTokenService.createRefreshToken(savedUser).getToken();
        return new AuthResponse(accessToken, refreshToken, savedUser.getRole().name(),
                savedUser.getId(), savedUser.getEmail(), savedUser.getFullName());
    }


    @Override
    public AuthResponse login(AuthRequest request) {
        // Precise Error Check
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found: The email address you entered isn't connected to an account."));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Incorrect password: The password you entered is incorrect. Please try again or reset your password.");
        }

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(auth);

        if (!(auth.getPrincipal() instanceof CustomUserDetails)) {
            throw new BadRequestException("System Error: Authentication principal mismatch.");
        }
        
        CustomUserDetails principal = (CustomUserDetails) auth.getPrincipal();

        activityLogService.log(user.getId(), "USER_LOGIN", "Logged in user: " + user.getEmail());

        String accessToken = jwtService.generateToken(principal, principal.getRole());
        String refreshToken = refreshTokenService.createRefreshToken(user).getToken();
        return new AuthResponse(accessToken, refreshToken, principal.getRole().name(),
                principal.getId(), user.getEmail(), user.getFullName());
    }

    @Override
    public AuthResponse refresh(String tokenValue) {
        // Verify the refresh token — throws BadRequestException if invalid/expired
        RefreshToken refreshToken = refreshTokenService.verifyExpiration(tokenValue);
        User user = refreshToken.getUser();

        // Issue a new access token
        String newAccessToken = jwtService.generateToken(new CustomUserDetails(user), user.getRole());

        // Rotate the refresh token (invalidate old, create new)
        String newRefreshToken = refreshTokenService.createRefreshToken(user).getToken();

        return new AuthResponse(newAccessToken, newRefreshToken, user.getRole().name(),
                user.getId(), user.getEmail(), user.getFullName());
    }

    @Override
    public void resetPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found: The email address is not actively registered in our system."));
        
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        activityLogService.log(user.getId(), "PASSWORD_RESET", "User reset their password via Forgot Password flow.");
    }

    @Override
    public void logout(String tokenValue) {
        RefreshToken refreshToken = refreshTokenService.verifyExpiration(tokenValue);
        refreshTokenService.deleteByUser(refreshToken.getUser());
    }

    @Override
    public Role getCurrentUserRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken
                || !(auth.getPrincipal() instanceof CustomUserDetails)) {
            return null;
        }
        return ((CustomUserDetails) auth.getPrincipal()).getRole();
    }

    @Override
    public Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken
                || !(auth.getPrincipal() instanceof CustomUserDetails)) {
            return null;
        }
        return ((CustomUserDetails) auth.getPrincipal()).getId();
    }

    private Set<Skill> resolveSkills(Iterable<String> skillNames) {
        Set<Skill> skills = new HashSet<>();
        if (skillNames == null) {
            return skills;
        }
        for (String name : skillNames) {
            Skill skill = skillRepository.findByNameIgnoreCase(name)
                    .orElseGet(() -> skillRepository.save(new Skill(name)));
            skills.add(skill);
        }
        return skills;
    }
}