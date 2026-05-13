package com.xiao9.wb.site.dto;

import com.xiao9.wb.site.entity.Site;

import java.time.LocalDateTime;

public record SiteDTO(
        Long id,
        String name,
        String description,
        String domain,
        String subdomain,
        String status,
        String siteType,
        Long ownerId,
        Long templateId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static SiteDTO from(Site site) {
        return new SiteDTO(
                site.getId(),
                site.getName(),
                site.getDescription(),
                site.getDomain(),
                site.getSubdomain(),
                site.getStatus().name(),
                site.getSiteType().name(),
                site.getOwner().getId(),
                site.getTemplate() != null ? site.getTemplate().getId() : null,
                site.getCreatedAt(),
                site.getUpdatedAt()
        );
    }
}
