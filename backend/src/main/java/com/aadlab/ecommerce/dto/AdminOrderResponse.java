package com.aadlab.ecommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record AdminOrderResponse(
        Long id,
        String customerName,
        String customerEmail,
        String address,
        LocalDateTime createdAt,
        BigDecimal totalPrice,
        String status,
        List<AdminOrderItemResponse> items
) {
}
