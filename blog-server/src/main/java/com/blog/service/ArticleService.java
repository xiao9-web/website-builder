package com.blog.service;

import com.blog.dto.article.*;
import com.blog.dto.common.PageResponse;
import com.blog.entity.Article;
import com.blog.entity.Menu;
import com.blog.entity.Tag;
import com.blog.repository.ArticleRepository;
import com.blog.repository.MenuRepository;
import com.blog.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final MenuRepository menuRepository;
    private final TagRepository tagRepository;

    @Transactional
    public ArticleResponse create(CreateArticleRequest request) {
        Menu menu = menuRepository.findById(request.getMenuId())
                .orElseThrow(() -> new IllegalArgumentException("Menu not found: " + request.getMenuId()));

        if (menu.getChildren() != null && !menu.getChildren().isEmpty()) {
            throw new IllegalArgumentException("Articles can only be assigned to leaf menus (menus with no children)");
        }

        Article article = Article.builder()
                .title(request.getTitle())
                .slug(request.getSlug())
                .content(request.getContent())
                .excerpt(request.getExcerpt())
                .coverImage(request.getCoverImage())
                .menu(menu)
                .status("draft")
                .build();

        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(request.getTagIds()));
            article.setTags(tags);
        }

        Article saved = articleRepository.save(article);
        return toArticleResponse(saved);
    }

    @Transactional
    public ArticleResponse update(Long id, UpdateArticleRequest request) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found: " + id));

        if (request.getTitle() != null) {
            article.setTitle(request.getTitle());
        }
        if (request.getSlug() != null) {
            article.setSlug(request.getSlug());
        }
        if (request.getContent() != null) {
            article.setContent(request.getContent());
        }
        if (request.getExcerpt() != null) {
            article.setExcerpt(request.getExcerpt());
        }
        if (request.getCoverImage() != null) {
            article.setCoverImage(request.getCoverImage());
        }
        if (request.getMenuId() != null) {
            Menu menu = menuRepository.findById(request.getMenuId())
                    .orElseThrow(() -> new IllegalArgumentException("Menu not found: " + request.getMenuId()));
            if (menu.getChildren() != null && !menu.getChildren().isEmpty()) {
                throw new IllegalArgumentException("Articles can only be assigned to leaf menus (menus with no children)");
            }
            article.setMenu(menu);
        }
        if (request.getTagIds() != null) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(request.getTagIds()));
            article.setTags(tags);
        }

        Article saved = articleRepository.save(article);
        return toArticleResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!articleRepository.existsById(id)) {
            throw new IllegalArgumentException("Article not found: " + id);
        }
        articleRepository.deleteById(id);
    }

    @Transactional
    public ArticleResponse publish(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found: " + id));

        article.setStatus("published");
        article.setPublishedAt(LocalDateTime.now());

        Article saved = articleRepository.save(article);
        return toArticleResponse(saved);
    }

    @Transactional(readOnly = true)
    public ArticleResponse getById(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found: " + id));
        return toArticleResponse(article);
    }

    @Transactional(readOnly = true)
    public ArticleResponse getBySlug(String slug) {
        Article article = articleRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Article not found: " + slug));
        return toArticleResponse(article);
    }

    @Transactional(readOnly = true)
    public PageResponse<ArticleListResponse> list(Pageable pageable, String status) {
        Page<Article> page;
        if (status != null && !status.isBlank()) {
            page = articleRepository.findByStatus(status, pageable);
        } else {
            page = articleRepository.findAll(pageable);
        }
        return toPageResponse(page);
    }

    @Transactional(readOnly = true)
    public PageResponse<ArticleListResponse> listPublished(Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "publishedAt")
        );
        Page<Article> page = articleRepository.findByStatus("published", sortedPageable);
        return toPageResponse(page);
    }

    @Transactional(readOnly = true)
    public PageResponse<ArticleListResponse> listByMenu(Long menuId, Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "publishedAt")
        );
        Page<Article> page = articleRepository.findByMenuIdAndStatus(menuId, "published", sortedPageable);
        return toPageResponse(page);
    }

    @Transactional(readOnly = true)
    public PageResponse<ArticleListResponse> search(String query, Pageable pageable) {
        Page<Article> page = articleRepository.search(query, pageable);
        return toPageResponse(page);
    }

    @Transactional(readOnly = true)
    public Map<Integer, List<ArticleListResponse>> archive() {
        List<Article> articles = articleRepository.findByStatusOrderByPublishedAtDesc("published");
        return articles.stream()
                .filter(a -> a.getPublishedAt() != null)
                .collect(Collectors.groupingBy(
                        a -> a.getPublishedAt().getYear(),
                        TreeMap::new,
                        Collectors.mapping(this::toArticleListResponse, Collectors.toList())
                ))
                .descendingMap();
    }

    private ArticleResponse toArticleResponse(Article article) {
        return ArticleResponse.builder()
                .id(article.getId())
                .title(article.getTitle())
                .slug(article.getSlug())
                .content(article.getContent())
                .excerpt(article.getExcerpt())
                .coverImage(article.getCoverImage())
                .status(article.getStatus())
                .menuId(article.getMenu() != null ? article.getMenu().getId() : null)
                .menuName(article.getMenu() != null ? article.getMenu().getName() : null)
                .tags(article.getTags().stream()
                        .map(tag -> ArticleResponse.TagResponse.builder()
                                .id(tag.getId())
                                .name(tag.getName())
                                .slug(tag.getSlug())
                                .build())
                        .collect(Collectors.toList()))
                .publishedAt(article.getPublishedAt())
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .build();
    }

    private ArticleListResponse toArticleListResponse(Article article) {
        return ArticleListResponse.builder()
                .id(article.getId())
                .title(article.getTitle())
                .slug(article.getSlug())
                .excerpt(article.getExcerpt())
                .coverImage(article.getCoverImage())
                .status(article.getStatus())
                .menuName(article.getMenu() != null ? article.getMenu().getName() : null)
                .tags(article.getTags().stream()
                        .map(tag -> ArticleResponse.TagResponse.builder()
                                .id(tag.getId())
                                .name(tag.getName())
                                .slug(tag.getSlug())
                                .build())
                        .collect(Collectors.toList()))
                .publishedAt(article.getPublishedAt())
                .createdAt(article.getCreatedAt())
                .build();
    }

    private PageResponse<ArticleListResponse> toPageResponse(Page<Article> page) {
        List<ArticleListResponse> content = page.getContent().stream()
                .map(this::toArticleListResponse)
                .collect(Collectors.toList());

        return PageResponse.<ArticleListResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }
}
