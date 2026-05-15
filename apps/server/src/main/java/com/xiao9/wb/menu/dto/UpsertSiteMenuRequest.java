package com.xiao9.wb.menu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpsertSiteMenuRequest(
        Long parentId,

        @NotBlank(message = "Menu label is required")
        @Size(max = 100, message = "Menu label must be at most 100 characters")
        String label,

        @NotBlank(message = "Menu slug is required")
        @Size(max = 120, message = "Menu slug must be at most 120 characters")
        String slug,

        Integer sortOrder,

        Boolean visible
) {
}
