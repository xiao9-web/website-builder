package com.xiao9.wb.template.dto;

import com.xiao9.wb.template.entity.Template;

import java.time.LocalDateTime;
import java.util.Map;

public record TemplateDTO(
        Long id,
        String name,
        String description,
        String category,
        String thumbnail,
        Map<String, Object> schema,
        String status,
        int currentVersion,
        Long authorId,
        String authorName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TemplateDTO from(Template template) {
        return new TemplateDTO(
                template.getId(),
                template.getName(),
                template.getDescription(),
                template.getCategory(),
                template.getThumbnail(),
                template.getSchema(),
                template.getStatus().name(),
                template.getCurrentVersion(),
                template.getAuthor().getId(),
                template.getAuthor().getName(),
                template.getCreatedAt(),
                template.getUpdatedAt()
        );
    }
}
