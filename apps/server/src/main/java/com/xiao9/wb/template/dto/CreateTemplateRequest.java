package com.xiao9.wb.template.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Map;

public record CreateTemplateRequest(
        @NotBlank(message = "Template name is required")
        @Size(max = 100, message = "Name must not exceed 100 characters")
        String name,

        @Size(max = 500, message = "Description must not exceed 500 characters")
        String description,

        @Size(max = 50, message = "Category must not exceed 50 characters")
        String category,

        String thumbnail,

        @NotNull(message = "Schema is required")
        Map<String, Object> schema
) {}
