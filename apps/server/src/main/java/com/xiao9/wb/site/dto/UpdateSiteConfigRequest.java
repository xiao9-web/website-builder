package com.xiao9.wb.site.dto;

import java.util.Map;

public record UpdateSiteConfigRequest(
        Map<String, Object> seoConfig,
        Map<String, Object> themeConfig,
        Map<String, Object> navigationConfig,
        Map<String, Object> customConfig,
        Map<String, Object> brandConfig,
        Map<String, Object> contentConfig
) {}
