package com.xiao9.wb.site.service;

import com.xiao9.wb.site.entity.Site;

/**
 * Strategy interface for building sites.
 * Different site types (blog, corporate, etc.) have different build strategies.
 */
public interface BuildStrategy {

    /**
     * Returns the site type this strategy handles.
     */
    Site.SiteType getSiteType();

    /**
     * Executes the build for the given site.
     * Returns the output URL on success.
     */
    String build(Site site) throws Exception;
}
