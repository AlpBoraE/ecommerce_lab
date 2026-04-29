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
    private final String userUsername;
    private final String userPassword;
    private final JwtUtil jwtUtil;

    public AuthService(
            @Value("${app.admin.username}") String adminUsername,
            @Value("${app.admin.password}") String adminPassword,
            @Value("${app.user.username}") String userUsername,
            @Value("${app.user.password}") String userPassword,
            JwtUtil jwtUtil
    ) {
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
        this.userUsername = userUsername;
        this.userPassword = userPassword;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(LoginRequest request) {
        if (adminUsername.equals(request.username()) && adminPassword.equals(request.password())) {
            return new AuthResponse(jwtUtil.createToken(request.username(), "ADMIN"), "ADMIN");
        }

        if (userUsername.equals(request.username()) && userPassword.equals(request.password())) {
            return new AuthResponse(jwtUtil.createToken(request.username(), "USER"), "USER");
        }

        throw new ApiException(HttpStatus.UNAUTHORIZED, "Username or password is wrong");
    }
}
