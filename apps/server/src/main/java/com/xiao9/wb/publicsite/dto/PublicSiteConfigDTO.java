package com.xiao9.wb.publicsite.dto;

import com.xiao9.wb.site.entity.Site;
import com.xiao9.wb.site.entity.SiteConfig;

import java.util.Map;

public record PublicSiteConfigDTO(
        Long siteId,
        String slug,
        String name,
        String description,
        String siteType,
        Map<String, Object> seoConfig,
        Map<String, Object> themeConfig,
        Map<String, Object> navigationConfig,
        Map<String, Object> customConfig,
        Map<String, Object> brandConfig,
        Map<String, Object> contentConfig
) {
    public static PublicSiteConfigDTO from(Site site, SiteConfig config) {
        return new PublicSiteConfigDTO(
                site.getId(),
                site.getSlug(),
                site.getName(),
                site.getDescription(),
                site.getSiteType().name(),
                config.getSeoConfig(),
                config.getThemeConfig(),
                config.getNavigationConfig(),
                config.getCustomConfig(),
                config.getBrandConfig(),
                config.getContentConfig()
        );
    }
}
