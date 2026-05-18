package com.xiao9.wb.site.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateSiteStatusRequest(
        @NotBlank(message = "Site status is required")
        String status
) {
}
