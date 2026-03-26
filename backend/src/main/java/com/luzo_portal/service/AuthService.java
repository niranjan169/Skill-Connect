package com.luzo_portal.service;

import com.luzo_portal.dto.*;
import com.luzo_portal.security.Role;

public interface AuthService {

    AuthResponse registerUser(RegisterUserRequest request);
    AuthResponse registerRecruiter(RegisterRecruiterRequest request);



    AuthResponse login(AuthRequest request);
    void resetPassword(ForgotPasswordRequest request);

    AuthResponse refresh(String refreshToken);

    void logout(String refreshToken);

    Role getCurrentUserRole();

    Long getCurrentUserId();
}
