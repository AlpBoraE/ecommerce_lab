package com.aadlab.ecommerce.config;

import com.aadlab.ecommerce.exception.ApiException;
import com.aadlab.ecommerce.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthenticatedAuthInterceptor implements HandlerInterceptor {
    private final JwtUtil jwtUtil;

    public AuthenticatedAuthInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Login token is required");
        }

        String token = header.substring("Bearer ".length());
        if (!jwtUtil.isValidUserToken(token)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only user accounts can create orders");
        }

        request.setAttribute("accountUsername", jwtUtil.getUsername(token));
        return true;
    }
}
