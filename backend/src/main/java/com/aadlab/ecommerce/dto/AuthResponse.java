package com.aadlab.ecommerce.dto;

public record AuthResponse(
        String token,
        String role
) {
}
