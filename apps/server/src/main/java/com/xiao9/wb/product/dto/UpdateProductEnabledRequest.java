package com.xiao9.wb.product.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateProductEnabledRequest(
        @NotNull(message = "Product enabled is required")
        Boolean enabled
) {
}
