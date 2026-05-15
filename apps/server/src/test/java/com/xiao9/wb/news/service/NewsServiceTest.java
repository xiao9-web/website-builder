package com.xiao9.wb.news.service;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.menu.entity.SiteMenu;
import com.xiao9.wb.menu.service.SiteMenuService;
import com.xiao9.wb.news.dto.UpsertNewsRequest;
import com.xiao9.wb.news.entity.News;
import com.xiao9.wb.news.repository.NewsRepository;
import com.xiao9.wb.site.entity.Site;
import com.xiao9.wb.site.service.SiteService;
import com.xiao9.wb.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class NewsServiceTest {

    private NewsRepository newsRepository;
    private SiteService siteService;
    private SiteMenuService siteMenuService;
    private NewsService newsService;
    private User user;
    private Site site;

    @BeforeEach
    void setUp() {
        newsRepository = mock(NewsRepository.class);
        siteService = mock(SiteService.class);
        siteMenuService = mock(SiteMenuService.class);
        newsService = new NewsService(newsRepository, siteService, siteMenuService);
        user = User.builder().id(7L).role(User.Role.USER).build();
        site = Site.builder().id(11L).owner(user).build();
    }

    @Test
    void listReturnsAllNewsWhenStatusFilterIsMissing() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(newsRepository.findBySiteIdOrderByCreatedAtDesc(11L))
                .thenReturn(List.of(news(1L, site, "a", News.Status.DRAFT), news(2L, site, "b", News.Status.PUBLISHED)));

        var result = newsService.list(11L, null, null, user);

        assertThat(result).extracting("id").containsExactly(1L, 2L);
        verify(newsRepository).findBySiteIdOrderByCreatedAtDesc(11L);
        verify(newsRepository, never()).findBySiteIdAndStatusOrderByCreatedAtDesc(anyLong(), any());
    }

    @Test
    void listAppliesStatusFilterWhenPresent() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(newsRepository.findBySiteIdAndStatusOrderByCreatedAtDesc(11L, News.Status.PUBLISHED))
                .thenReturn(List.of(news(2L, site, "b", News.Status.PUBLISHED)));

        var result = newsService.list(11L, "published", null, user);

        assertThat(result).extracting("status").containsExactly("PUBLISHED");
        verify(newsRepository).findBySiteIdAndStatusOrderByCreatedAtDesc(11L, News.Status.PUBLISHED);
    }

    @Test
    void listAppliesMenuFilterWhenPresent() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        News knowledge = news(4L, site, "knowledge", News.Status.DRAFT);
        knowledge.setMenu(menu(31L, "knowledge-center"));
        when(newsRepository.findBySiteIdAndMenuIdOrderByCreatedAtDesc(11L, 31L))
                .thenReturn(List.of(knowledge));

        var result = newsService.list(11L, null, 31L, user);

        assertThat(result).extracting("menuId").containsExactly(31L);
        verify(newsRepository).findBySiteIdAndMenuIdOrderByCreatedAtDesc(11L, 31L);
        verify(newsRepository, never()).findBySiteIdOrderByCreatedAtDesc(anyLong());
    }

    @Test
    void listAppliesMenuAndStatusFiltersTogether() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        News published = news(5L, site, "published-knowledge", News.Status.PUBLISHED);
        published.setMenu(menu(31L, "knowledge-center"));
        when(newsRepository.findBySiteIdAndMenuIdAndStatusOrderByCreatedAtDesc(11L, 31L, News.Status.PUBLISHED))
                .thenReturn(List.of(published));

        var result = newsService.list(11L, "published", 31L, user);

        assertThat(result).extracting("menuId").containsExactly(31L);
        assertThat(result).extracting("status").containsExactly("PUBLISHED");
        verify(newsRepository).findBySiteIdAndMenuIdAndStatusOrderByCreatedAtDesc(11L, 31L, News.Status.PUBLISHED);
        verify(newsRepository, never()).findBySiteIdAndStatusOrderByCreatedAtDesc(anyLong(), any());
    }

    @Test
    void createDefaultsStatusToDraftAndNormalizesSlug() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(newsRepository.findBySiteIdAndSlug(11L, "new-product")).thenReturn(Optional.empty());
        when(newsRepository.save(any(News.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = newsService.create(11L, request("New Product", " New-Product ", null), user);

        assertThat(result.slug()).isEqualTo("new-product");
        assertThat(result.status()).isEqualTo("DRAFT");
        assertThat(result.publishedAt()).isNull();
        verify(newsRepository).save(argThat(saved ->
                saved.getSite() == site
                        && saved.getSlug().equals("new-product")
                        && saved.getStatus() == News.Status.DRAFT
        ));
    }

    @Test
    void createAssignsArticleToReadableMenu() {
        SiteMenu menu = menu(31L, "knowledge-center");
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(newsRepository.findBySiteIdAndSlug(11L, "menu-article")).thenReturn(Optional.empty());
        when(siteMenuService.requireReadableMenu(11L, 31L, user)).thenReturn(menu);
        when(newsRepository.save(any(News.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = newsService.create(11L, request(31L, "Menu Article", "menu-article", "draft"), user);

        assertThat(result.menuId()).isEqualTo(31L);
        verify(siteMenuService).requireReadableMenu(11L, 31L, user);
        verify(newsRepository).save(argThat(saved -> saved.getMenu() == menu));
    }

    @Test
    void createRejectsHomepageMenuAsArticleColumn() {
        SiteMenu home = menu(1L, "home");
        home.setMenuType(SiteMenu.MenuType.HOME);
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(newsRepository.findBySiteIdAndSlug(11L, "home-article")).thenReturn(Optional.empty());
        when(siteMenuService.requireReadableMenu(11L, 1L, user)).thenReturn(home);

        assertThatThrownBy(() -> newsService.create(11L, request(1L, "Home Article", "home-article", "draft"), user))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Homepage menu cannot be used as an article column");

        verify(newsRepository, never()).save(any());
    }

    @Test
    void createDoesNotResolveMenuWhenMenuIdIsMissing() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(newsRepository.findBySiteIdAndSlug(11L, "plain-article")).thenReturn(Optional.empty());
        when(newsRepository.save(any(News.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = newsService.create(11L, request(null, "Plain Article", "plain-article", "draft"), user);

        assertThat(result.menuId()).isNull();
        verify(siteMenuService, never()).requireReadableMenu(anyLong(), anyLong(), any());
    }

    @Test
    void createRejectsDuplicateSlugWithinSite() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(newsRepository.findBySiteIdAndSlug(11L, "duplicate")).thenReturn(Optional.of(news(9L, site, "duplicate", News.Status.DRAFT)));

        assertThatThrownBy(() -> newsService.create(11L, request("Duplicate", "duplicate", null), user))
                .isInstanceOf(BusinessException.class)
                .hasMessage("News slug is already in use");

        verify(newsRepository, never()).save(any());
    }

    @Test
    void updateRejectsNewsOutsideSiteScope() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(newsRepository.findByIdAndSiteId(99L, 11L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> newsService.update(11L, 99L, request("Title", "title", "draft"), user))
                .isInstanceOf(BusinessException.class)
                .hasMessage("News not found");

        verify(newsRepository, never()).save(any());
    }

    @Test
    void updateChangesArticleMenuAssignment() {
        News article = news(8L, site, "article", News.Status.DRAFT);
        SiteMenu menu = menu(32L, "company-news");
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(newsRepository.findByIdAndSiteId(8L, 11L)).thenReturn(Optional.of(article));
        when(newsRepository.findBySiteIdAndSlug(11L, "article")).thenReturn(Optional.of(article));
        when(siteMenuService.requireReadableMenu(11L, 32L, user)).thenReturn(menu);
        when(newsRepository.save(any(News.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = newsService.update(11L, 8L, request(32L, "Article", "article", "draft"), user);

        assertThat(result.menuId()).isEqualTo(32L);
        verify(siteMenuService).requireReadableMenu(11L, 32L, user);
        verify(newsRepository).save(argThat(saved -> saved.getMenu() == menu));
    }

    @Test
    void updateStatusSetsPublishedAtWhenPublishing() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        News draft = news(3L, site, "draft-news", News.Status.DRAFT);
        draft.setPublishedAt(null);
        when(newsRepository.findByIdAndSiteId(3L, 11L)).thenReturn(Optional.of(draft));
        when(newsRepository.save(any(News.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = newsService.updateStatus(11L, 3L, "PUBLISHED", user);

        assertThat(result.status()).isEqualTo("PUBLISHED");
        assertThat(result.publishedAt()).isNotNull();
    }

    @Test
    void updateStatusClearsPublishedAtWhenOffline() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        News published = news(3L, site, "published-news", News.Status.PUBLISHED);
        published.setPublishedAt(LocalDateTime.parse("2026-01-01T00:00:00"));
        when(newsRepository.findByIdAndSiteId(3L, 11L)).thenReturn(Optional.of(published));
        when(newsRepository.save(any(News.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = newsService.updateStatus(11L, 3L, "OFFLINE", user);

        assertThat(result.status()).isEqualTo("OFFLINE");
        assertThat(result.publishedAt()).isNull();
    }

    private UpsertNewsRequest request(String title, String slug, String status) {
        return request(null, title, slug, status);
    }

    private UpsertNewsRequest request(Long menuId, String title, String slug, String status) {
        return new UpsertNewsRequest(
                menuId,
                title,
                slug,
                title + " summary",
                title + " content",
                "公司动态",
                null,
                status
        );
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
                .createdAt(LocalDateTime.parse("2026-01-01T00:00:00"))
                .build();
    }

    private SiteMenu menu(Long id, String slug) {
        return SiteMenu.builder()
                .id(id)
                .site(site)
                .label(slug)
                .slug(slug)
                .menuType(SiteMenu.MenuType.CUSTOM)
                .sortOrder(0)
                .visible(true)
                .build();
    }
}
