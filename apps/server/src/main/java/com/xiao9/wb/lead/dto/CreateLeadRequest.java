package com.xiao9.wb.lead.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateLeadRequest(
        @Size(max = 100, message = "Lead name must be at most 100 characters")
        String name,

        @NotBlank(message = "Lead phone is required")
        @Size(max = 50, message = "Lead phone must be at most 50 characters")
        String phone,

        @Size(max = 150, message = "Company name must be at most 150 characters")
        String companyName,

        @Size(max = 100, message = "Cooperation type must be at most 100 characters")
        String cooperationType,

        @NotBlank(message = "Lead message is required")
        String message,

        @Size(max = 500, message = "Source page must be at most 500 characters")
        String sourcePage
) {
}
