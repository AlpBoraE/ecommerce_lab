package com.aadlab.ecommerce.dto;

import java.math.BigDecimal;

public record OrderResponse(
        Long orderId,
        BigDecimal totalPrice,
        String message
) {
}
