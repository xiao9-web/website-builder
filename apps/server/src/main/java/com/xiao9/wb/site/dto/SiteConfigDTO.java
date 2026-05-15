package com.xiao9.wb.site.dto;

import com.xiao9.wb.site.entity.SiteConfig;

import java.time.LocalDateTime;
import java.util.Map;

public record SiteConfigDTO(
        Long id,
        Long siteId,
        Map<String, Object> seoConfig,
        Map<String, Object> themeConfig,
        Map<String, Object> navigationConfig,
        Map<String, Object> customConfig,
        Map<String, Object> brandConfig,
        Map<String, Object> contentConfig,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static SiteConfigDTO from(SiteConfig config) {
        return new SiteConfigDTO(
                config.getId(),
                config.getSite().getId(),
                config.getSeoConfig(),
                config.getThemeConfig(),
                config.getNavigationConfig(),
                config.getCustomConfig(),
                config.getBrandConfig(),
                config.getContentConfig(),
                config.getCreatedAt(),
                config.getUpdatedAt()
        );
    }
}
