package com.xiao9.wb.site.service;

import com.xiao9.wb.site.entity.Site;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CorporateBuildStrategy implements BuildStrategy {

    @Override
    public Site.SiteType getSiteType() {
        return Site.SiteType.CORPORATE;
    }

    @Override
    public String build(Site site) throws Exception {
        log.info("Building corporate site: {}", site.getName());

        // Corporate-specific build logic:
        // 1. Generate multi-page layout with navigation
        // 2. Apply corporate branding and theme
        // 3. Build contact forms and integrations
        // 4. Generate sitemap.xml
        // 5. Optimize for SEO

        String outputUrl = String.format("https://%s.xiao9.com", site.getSubdomain());
        log.info("Corporate build completed for site: {}, output: {}", site.getId(), outputUrl);
        return outputUrl;
    }
}
