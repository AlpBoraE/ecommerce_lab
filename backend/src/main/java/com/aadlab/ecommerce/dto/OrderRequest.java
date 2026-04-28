package com.aadlab.ecommerce.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record OrderRequest(
        @NotBlank String customerName,
        @NotBlank @Email String customerEmail,
        @NotBlank String address,
        @NotEmpty List<@Valid OrderItemRequest> items
) {
}
