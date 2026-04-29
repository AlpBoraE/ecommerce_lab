package com.aadlab.ecommerce.dto;

import java.math.BigDecimal;

public record AdminOrderItemResponse(
        Long productId,
        String productName,
        int quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal
) {
}
