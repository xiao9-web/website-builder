package com.xiao9.wb.site.dto;

import com.xiao9.wb.site.entity.Build;

import java.time.LocalDateTime;

public record BuildDTO(
        Long id,
        Long siteId,
        String status,
        String outputUrl,
        String buildLog,
        long durationMs,
        String triggeredBy,
        LocalDateTime createdAt,
        LocalDateTime completedAt
) {
    public static BuildDTO from(Build build) {
        return new BuildDTO(
                build.getId(),
                build.getSite().getId(),
                build.getStatus().name(),
                build.getOutputUrl(),
                build.getBuildLog(),
                build.getDurationMs(),
                build.getTriggeredBy(),
                build.getCreatedAt(),
                build.getCompletedAt()
        );
    }
}
