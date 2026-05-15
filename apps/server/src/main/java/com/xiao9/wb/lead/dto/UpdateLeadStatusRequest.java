package com.xiao9.wb.lead.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateLeadStatusRequest(
        @NotBlank(message = "Lead status is required")
        String status
) {
}
