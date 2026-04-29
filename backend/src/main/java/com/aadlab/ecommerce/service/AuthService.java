package com.aadlab.ecommerce.service;

import com.aadlab.ecommerce.dto.AuthResponse;
import com.aadlab.ecommerce.dto.LoginRequest;
import com.aadlab.ecommerce.dto.RegisterRequest;
import com.aadlab.ecommerce.entity.UserAccount;
import com.aadlab.ecommerce.exception.ApiException;
import com.aadlab.ecommerce.repository.UserAccountRepository;
import com.aadlab.ecommerce.security.JwtUtil;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final String adminUsername;
    private final String adminPassword;
    private final UserAccountRepository userAccountRepository;
    private final JwtUtil jwtUtil;

    public AuthService(
            @Value("${app.admin.username}") String adminUsername,
            @Value("${app.admin.password}") String adminPassword,
            UserAccountRepository userAccountRepository,
            JwtUtil jwtUtil
    ) {
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
        this.userAccountRepository = userAccountRepository;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedUsername = normalizeUsername(request.username());

        if (adminUsername.toLowerCase(Locale.ROOT).equals(normalizedUsername) && adminPassword.equals(request.password())) {
            return new AuthResponse(jwtUtil.createToken(adminUsername, "ADMIN"), "ADMIN");
        }

        return userAccountRepository.findByUsername(normalizedUsername)
                .filter(userAccount -> userAccount.getPassword().equals(request.password()))
                .map(userAccount -> new AuthResponse(jwtUtil.createToken(userAccount.getUsername(), "USER"), "USER"))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Username or password is wrong"));
    }

    public AuthResponse register(RegisterRequest request) {
        String normalizedUsername = normalizeUsername(request.username());

        if (adminUsername.toLowerCase(Locale.ROOT).equals(normalizedUsername)
                || userAccountRepository.existsByUsername(normalizedUsername)) {
            throw new ApiException(HttpStatus.CONFLICT, "Username is already taken");
        }

        UserAccount userAccount = userAccountRepository.save(new UserAccount(normalizedUsername, request.password()));
        return new AuthResponse(jwtUtil.createToken(userAccount.getUsername(), "USER"), "USER");
    }

    private String normalizeUsername(String username) {
        return username.trim().toLowerCase(Locale.ROOT);
    }
}
