package com.xiao9.wb.news.service;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.common.exception.ErrorCode;
import com.xiao9.wb.menu.entity.SiteMenu;
import com.xiao9.wb.menu.service.SiteMenuService;
import com.xiao9.wb.news.dto.NewsDTO;
import com.xiao9.wb.news.dto.UpsertNewsRequest;
import com.xiao9.wb.news.entity.News;
import com.xiao9.wb.news.repository.NewsRepository;
import com.xiao9.wb.site.entity.Site;
import com.xiao9.wb.site.service.SiteService;
import com.xiao9.wb.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsRepository newsRepository;
    private final SiteService siteService;
    private final SiteMenuService siteMenuService;

    @Transactional(readOnly = true)
    public List<NewsDTO> list(Long siteId, String status, Long menuId, User user) {
        Site site = siteService.requireReadableSite(siteId, user);
        News.Status parsedStatus = status == null || status.isBlank() ? null : parseStatus(status);
        List<News> news;
        if (menuId != null && parsedStatus != null) {
            news = newsRepository.findBySiteIdAndMenuIdAndStatusOrderByCreatedAtDesc(site.getId(), menuId, parsedStatus);
        } else if (menuId != null) {
            news = newsRepository.findBySiteIdAndMenuIdOrderByCreatedAtDesc(site.getId(), menuId);
        } else if (parsedStatus != null) {
            news = newsRepository.findBySiteIdAndStatusOrderByCreatedAtDesc(site.getId(), parsedStatus);
        } else {
            news = newsRepository.findBySiteIdOrderByCreatedAtDesc(site.getId());
        }

        return news.stream()
                .map(NewsDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public NewsDTO get(Long siteId, Long newsId, User user) {
        siteService.requireReadableSite(siteId, user);
        return NewsDTO.from(requireNewsInSite(siteId, newsId));
    }

    @Transactional
    public NewsDTO create(Long siteId, UpsertNewsRequest request, User user) {
        Site site = siteService.requireReadableSite(siteId, user);
        String slug = normalizeSlug(request.slug());
        validateSlugAvailable(site.getId(), slug, null);
        SiteMenu menu = resolveMenu(site.getId(), request.menuId(), user);

        News.Status status = parseOptionalStatus(request.status());
        News news = News.builder()
                .site(site)
                .menu(menu)
                .title(request.title())
                .slug(slug)
                .summary(request.summary())
                .content(request.content())
                .category(request.category())
                .coverImage(request.coverImage())
                .status(status)
                .publishedAt(resolvePublishedAt(null, status))
                .build();

        newsRepository.save(news);
        log.info("News created: {} for site {} by user {}", news.getTitle(), siteId, user.getId());
        return NewsDTO.from(news);
    }

    @Transactional
    public NewsDTO update(Long siteId, Long newsId, UpsertNewsRequest request, User user) {
        siteService.requireReadableSite(siteId, user);
        News news = requireNewsInSite(siteId, newsId);
        String slug = normalizeSlug(request.slug());
        validateSlugAvailable(siteId, slug, news.getId());
        SiteMenu menu = resolveMenu(siteId, request.menuId(), user);

        News.Status status = parseOptionalStatus(request.status());
        news.setMenu(menu);
        news.setTitle(request.title());
        news.setSlug(slug);
        news.setSummary(request.summary());
        news.setContent(request.content());
        news.setCategory(request.category());
        news.setCoverImage(request.coverImage());
        news.setStatus(status);
        news.setPublishedAt(resolvePublishedAt(news.getPublishedAt(), status));

        newsRepository.save(news);
        return NewsDTO.from(news);
    }

    private SiteMenu resolveMenu(Long siteId, Long menuId, User user) {
        if (menuId == null) {
            return null;
        }
        SiteMenu menu = siteMenuService.requireReadableMenu(siteId, menuId, user);
        if (menu.getMenuType() == SiteMenu.MenuType.HOME) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Homepage menu cannot be used as an article column");
        }
        return menu;
    }

    @Transactional
    public void delete(Long siteId, Long newsId, User user) {
        siteService.requireReadableSite(siteId, user);
        News news = requireNewsInSite(siteId, newsId);
        newsRepository.delete(news);
        log.info("News deleted: {} for site {} by user {}", newsId, siteId, user.getId());
    }

    @Transactional
    public NewsDTO updateStatus(Long siteId, Long newsId, String status, User user) {
        siteService.requireReadableSite(siteId, user);
        News news = requireNewsInSite(siteId, newsId);
        News.Status parsedStatus = parseStatus(status);
        news.setStatus(parsedStatus);
        news.setPublishedAt(resolvePublishedAt(news.getPublishedAt(), parsedStatus));

        newsRepository.save(news);
        return NewsDTO.from(news);
    }

    private News requireNewsInSite(Long siteId, Long newsId) {
        return newsRepository.findByIdAndSiteId(newsId, siteId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "News not found"));
    }

    private void validateSlugAvailable(Long siteId, String slug, Long currentNewsId) {
        newsRepository.findBySiteIdAndSlug(siteId, slug)
                .filter(news -> !Objects.equals(news.getId(), currentNewsId))
                .ifPresent(news -> {
                    throw new BusinessException(ErrorCode.BAD_REQUEST, "News slug is already in use");
                });
    }

    private String normalizeSlug(String slug) {
        if (slug == null || slug.isBlank()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "News slug is required");
        }
        String normalized = slug.trim().toLowerCase();
        if (!normalized.matches("^[a-z0-9][a-z0-9-]{1,148}[a-z0-9]$")) {
            throw new BusinessException(
                    ErrorCode.BAD_REQUEST,
                    "News slug can only contain lowercase letters, numbers, and hyphens, and must be 3 to 150 characters"
            );
        }
        return normalized;
    }

    private News.Status parseOptionalStatus(String status) {
        if (status == null || status.isBlank()) {
            return News.Status.DRAFT;
        }
        return parseStatus(status);
    }

    private News.Status parseStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "News status is required");
        }
        try {
            return News.Status.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Invalid news status");
        }
    }

    private LocalDateTime resolvePublishedAt(LocalDateTime currentPublishedAt, News.Status status) {
        if (status == News.Status.PUBLISHED) {
            return currentPublishedAt != null ? currentPublishedAt : LocalDateTime.now();
        }
        return null;
    }
}
