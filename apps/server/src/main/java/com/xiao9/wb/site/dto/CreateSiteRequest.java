package com.xiao9.wb.site.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateSiteRequest(
        @NotBlank(message = "Site name is required")
        @Size(max = 100, message = "Name must not exceed 100 characters")
        String name,

        @Size(max = 500, message = "Description must not exceed 500 characters")
        String description,

        @Pattern(regexp = "^[a-z0-9-]+$", message = "Subdomain can only contain lowercase letters, numbers, and hyphens")
        @Size(min = 3, max = 50, message = "Subdomain must be between 3 and 50 characters")
        String subdomain,

        String siteType,

        Long templateId
) {}
