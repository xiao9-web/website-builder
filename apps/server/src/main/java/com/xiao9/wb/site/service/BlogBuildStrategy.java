package com.xiao9.wb.site.service;

import com.xiao9.wb.site.entity.Site;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class BlogBuildStrategy implements BuildStrategy {

    @Override
    public Site.SiteType getSiteType() {
        return Site.SiteType.BLOG;
    }

    @Override
    public String build(Site site) throws Exception {
        log.info("Building blog site: {}", site.getName());

        // Blog-specific build logic:
        // 1. Generate static pages from posts
        // 2. Apply blog template with pagination
        // 3. Generate RSS feed
        // 4. Build search index

        // Simulate build process
        String outputUrl = String.format("https://%s.xiao9.com", site.getSubdomain());
        log.info("Blog build completed for site: {}, output: {}", site.getId(), outputUrl);
        return outputUrl;
    }
}
