package com.xiao9.wb.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record UpsertProductServiceRequest(
        @NotBlank(message = "Product name is required")
        @Size(max = 100, message = "Product name must be at most 100 characters")
        String name,

        @NotBlank(message = "Product summary is required")
        @Size(max = 500, message = "Product summary must be at most 500 characters")
        String summary,

        String description,

        @Size(max = 500, message = "Product image URL must be at most 500 characters")
        String imageUrl,

        List<Object> scenarios,

        Integer sortOrder,

        Boolean enabled
) {
}
