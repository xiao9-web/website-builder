package com.xiao9.wb.news.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateNewsStatusRequest(
        @NotBlank(message = "News status is required")
        String status
) {
}
