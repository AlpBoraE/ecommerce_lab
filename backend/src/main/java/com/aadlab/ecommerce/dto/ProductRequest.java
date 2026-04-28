package com.aadlab.ecommerce.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank String name,
        @NotBlank String description,
        @NotNull @Positive BigDecimal price,
        @NotNull Long categoryId,
        @Min(0) int stock,
        String imageUrl
) {
}
