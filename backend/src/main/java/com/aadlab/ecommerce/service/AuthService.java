package com.aadlab.ecommerce.service;

import com.aadlab.ecommerce.dto.AuthResponse;
import com.aadlab.ecommerce.dto.LoginRequest;
import com.aadlab.ecommerce.exception.ApiException;
import com.aadlab.ecommerce.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final String adminUsername;
    private final String adminPassword;
    private final JwtUtil jwtUtil;

    public AuthService(
            @Value("${app.admin.username}") String adminUsername,
            @Value("${app.admin.password}") String adminPassword,
            JwtUtil jwtUtil
    ) {
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(LoginRequest request) {
        if (!adminUsername.equals(request.username()) || !adminPassword.equals(request.password())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Username or password is wrong");
        }

        return new AuthResponse(jwtUtil.createToken(request.username(), "ADMIN"), "ADMIN");
    }
}
