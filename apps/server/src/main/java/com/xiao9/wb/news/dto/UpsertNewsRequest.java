package com.xiao9.wb.news.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpsertNewsRequest(
        Long menuId,

        @NotBlank(message = "News title is required")
        @Size(max = 200, message = "News title must be at most 200 characters")
        String title,

        @NotBlank(message = "News slug is required")
        @Size(max = 150, message = "News slug must be at most 150 characters")
        String slug,

        @Size(max = 500, message = "News summary must be at most 500 characters")
        String summary,

        String content,

        @Size(max = 50, message = "News category must be at most 50 characters")
        String category,

        @Size(max = 500, message = "News cover image must be at most 500 characters")
        String coverImage,

        String status
) {
}
