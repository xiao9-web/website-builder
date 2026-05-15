package com.xiao9.wb.news.dto;

import com.xiao9.wb.news.entity.News;

import java.time.LocalDateTime;

public record NewsDTO(
        Long id,
        Long siteId,
        Long menuId,
        String title,
        String slug,
        String summary,
        String content,
        String category,
        String coverImage,
        String status,
        LocalDateTime publishedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static NewsDTO from(News news) {
        return new NewsDTO(
                news.getId(),
                news.getSite().getId(),
                news.getMenu() != null ? news.getMenu().getId() : null,
                news.getTitle(),
                news.getSlug(),
                news.getSummary(),
                news.getContent(),
                news.getCategory(),
                news.getCoverImage(),
                news.getStatus().name(),
                news.getPublishedAt(),
                news.getCreatedAt(),
                news.getUpdatedAt()
        );
    }
}
