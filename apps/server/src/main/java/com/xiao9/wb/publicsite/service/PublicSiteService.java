package com.xiao9.wb.publicsite.service;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.common.exception.ErrorCode;
import com.xiao9.wb.news.entity.News;
import com.xiao9.wb.news.repository.NewsRepository;
import com.xiao9.wb.product.repository.ProductServiceRepository;
import com.xiao9.wb.publicsite.dto.PublicNewsDTO;
import com.xiao9.wb.publicsite.dto.PublicProductDTO;
import com.xiao9.wb.publicsite.dto.PublicSiteConfigDTO;
import com.xiao9.wb.site.entity.Site;
import com.xiao9.wb.site.entity.SiteConfig;
import com.xiao9.wb.site.repository.SiteConfigRepository;
import com.xiao9.wb.site.repository.SiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PublicSiteService {

    private final SiteRepository siteRepository;
    private final SiteConfigRepository siteConfigRepository;
    private final ProductServiceRepository productServiceRepository;
    private final NewsRepository newsRepository;

    @Transactional(readOnly = true)
    public PublicSiteConfigDTO getConfig(String slug) {
        Site site = requirePublicSite(slug);
        SiteConfig config = siteConfigRepository.findBySiteId(site.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Site config not found"));
        return PublicSiteConfigDTO.from(site, config);
    }

    @Transactional(readOnly = true)
    public List<PublicProductDTO> listProducts(String slug) {
        Site site = requirePublicSite(slug);
        return productServiceRepository.findBySiteIdAndEnabledOrderBySortOrderAscCreatedAtAsc(site.getId(), true)
                .stream()
                .map(PublicProductDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PublicNewsDTO> listNews(String slug) {
        Site site = requirePublicSite(slug);
        return newsRepository.findBySiteIdAndStatusOrderByCreatedAtDesc(site.getId(), News.Status.PUBLISHED)
                .stream()
                .map(PublicNewsDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PublicNewsDTO getNewsBySlug(String slug, String newsSlug) {
        Site site = requirePublicSite(slug);
        News news = newsRepository.findBySiteIdAndSlugAndStatus(site.getId(), normalizeSlug(newsSlug), News.Status.PUBLISHED)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "News not found"));
        return PublicNewsDTO.from(news);
    }

    private Site requirePublicSite(String slug) {
        Site site = siteRepository.findBySlug(normalizeSlug(slug))
                .orElseThrow(() -> new BusinessException(ErrorCode.SITE_NOT_FOUND));
        if (site.getStatus() == Site.Status.OFFLINE || site.getStatus() == Site.Status.ERROR) {
            throw new BusinessException(ErrorCode.SITE_NOT_FOUND);
        }
        return site;
    }

    private String normalizeSlug(String slug) {
        if (slug == null || slug.isBlank()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Slug is required");
        }
        return slug.trim().toLowerCase();
    }
}
