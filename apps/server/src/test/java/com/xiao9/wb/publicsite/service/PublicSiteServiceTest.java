package com.xiao9.wb.publicsite.service;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.news.entity.News;
import com.xiao9.wb.news.repository.NewsRepository;
import com.xiao9.wb.product.entity.ProductService;
import com.xiao9.wb.product.repository.ProductServiceRepository;
import com.xiao9.wb.site.entity.Site;
import com.xiao9.wb.site.entity.SiteConfig;
import com.xiao9.wb.site.repository.SiteConfigRepository;
import com.xiao9.wb.site.repository.SiteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class PublicSiteServiceTest {

    private SiteRepository siteRepository;
    private SiteConfigRepository siteConfigRepository;
    private ProductServiceRepository productServiceRepository;
    private NewsRepository newsRepository;
    private PublicSiteService publicSiteService;
    private Site site;

    @BeforeEach
    void setUp() {
        siteRepository = mock(SiteRepository.class);
        siteConfigRepository = mock(SiteConfigRepository.class);
        productServiceRepository = mock(ProductServiceRepository.class);
        newsRepository = mock(NewsRepository.class);
        publicSiteService = new PublicSiteService(siteRepository, siteConfigRepository, productServiceRepository, newsRepository);
        site = Site.builder()
                .id(11L)
                .slug("chunchang")
                .name("山东春昌食品科技股份有限公司")
                .description("黄油等乳制品相关产品与食品科技服务")
                .siteType(Site.SiteType.CORPORATE)
                .status(Site.Status.PUBLISHED)
                .build();
    }

    @Test
    void getConfigReturnsPublicSafeSiteConfig() {
        when(siteRepository.findBySlug("chunchang")).thenReturn(Optional.of(site));
        when(siteConfigRepository.findBySiteId(11L)).thenReturn(Optional.of(config(site)));

        var result = publicSiteService.getConfig(" Chunchang ");

        assertThat(result.siteId()).isEqualTo(11L);
        assertThat(result.slug()).isEqualTo("chunchang");
        assertThat(result.brandConfig()).containsEntry("companyName", "山东春昌食品科技股份有限公司");
    }

    @Test
    void listProductsReturnsEnabledProductsOnly() {
        when(siteRepository.findBySlug("chunchang")).thenReturn(Optional.of(site));
        when(productServiceRepository.findBySiteIdAndEnabledOrderBySortOrderAscCreatedAtAsc(11L, true))
                .thenReturn(List.of(product(1L, site, "黄油产品")));

        var result = publicSiteService.listProducts("chunchang");

        assertThat(result).extracting("name").containsExactly("黄油产品");
        verify(productServiceRepository).findBySiteIdAndEnabledOrderBySortOrderAscCreatedAtAsc(11L, true);
    }

    @Test
    void listNewsReturnsPublishedNewsOnly() {
        when(siteRepository.findBySlug("chunchang")).thenReturn(Optional.of(site));
        when(newsRepository.findBySiteIdAndStatusOrderByCreatedAtDesc(11L, News.Status.PUBLISHED))
                .thenReturn(List.of(news(1L, site, "company-news", News.Status.PUBLISHED)));

        var result = publicSiteService.listNews("chunchang");

        assertThat(result).extracting("slug").containsExactly("company-news");
        verify(newsRepository).findBySiteIdAndStatusOrderByCreatedAtDesc(11L, News.Status.PUBLISHED);
    }

    @Test
    void getNewsBySlugReturnsPublishedNewsOnly() {
        when(siteRepository.findBySlug("chunchang")).thenReturn(Optional.of(site));
        when(newsRepository.findBySiteIdAndSlugAndStatus(11L, "company-news", News.Status.PUBLISHED))
                .thenReturn(Optional.of(news(1L, site, "company-news", News.Status.PUBLISHED)));

        var result = publicSiteService.getNewsBySlug("chunchang", " Company-News ");

        assertThat(result.slug()).isEqualTo("company-news");
        verify(newsRepository).findBySiteIdAndSlugAndStatus(11L, "company-news", News.Status.PUBLISHED);
    }

    @Test
    void getNewsBySlugRejectsDraftNews() {
        when(siteRepository.findBySlug("chunchang")).thenReturn(Optional.of(site));
        when(newsRepository.findBySiteIdAndSlugAndStatus(11L, "draft-news", News.Status.PUBLISHED))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> publicSiteService.getNewsBySlug("chunchang", "draft-news"))
                .isInstanceOf(BusinessException.class)
                .hasMessage("News not found");
    }

    @Test
    void publicApisRejectOfflineSites() {
        site.setStatus(Site.Status.OFFLINE);
        when(siteRepository.findBySlug("chunchang")).thenReturn(Optional.of(site));

        assertThatThrownBy(() -> publicSiteService.listProducts("chunchang"))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Site not found");

        verifyNoInteractions(productServiceRepository);
    }

    private SiteConfig config(Site site) {
        return SiteConfig.builder()
                .site(site)
                .seoConfig(Map.of("title", site.getName(), "description", site.getDescription()))
                .themeConfig(Map.of("primary", "#2F7D4A"))
                .navigationConfig(Map.of("items", List.of(Map.of("label", "首页", "href", "/"))))
                .customConfig(Map.of("mobileContactBar", true))
                .brandConfig(Map.of("companyName", site.getName()))
                .contentConfig(Map.of("hero", Map.of("headline", "绿色健康乳制品供应与合作服务")))
                .build();
    }

    private ProductService product(Long id, Site site, String name) {
        return ProductService.builder()
                .id(id)
                .site(site)
                .name(name)
                .summary(name + " summary")
                .description(name + " description")
                .sortOrder(0)
                .enabled(true)
                .build();
    }

    private News news(Long id, Site site, String slug, News.Status status) {
        return News.builder()
                .id(id)
                .site(site)
                .title(slug)
                .slug(slug)
                .summary(slug + " summary")
                .content(slug + " content")
                .category("公司动态")
                .status(status)
                .publishedAt(LocalDateTime.parse("2026-01-01T00:00:00"))
                .build();
    }
}
