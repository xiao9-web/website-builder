package com.xiao9.wb.site.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateSiteRequest(
        @Size(max = 100, message = "Name must not exceed 100 characters")
        String name,

        @Size(max = 500, message = "Description must not exceed 500 characters")
        String description,

        @Pattern(regexp = "^[a-z0-9][a-z0-9-]*[a-z0-9]$", message = "Slug can only contain lowercase letters, numbers, and hyphens, and must start and end with a letter or number")
        @Size(min = 3, max = 100, message = "Slug must be between 3 and 100 characters")
        String slug,

        @Pattern(regexp = "^[a-z0-9-]+$", message = "Subdomain can only contain lowercase letters, numbers, and hyphens")
        @Size(min = 3, max = 50, message = "Subdomain must be between 3 and 50 characters")
        String subdomain,

        String status
) {}
