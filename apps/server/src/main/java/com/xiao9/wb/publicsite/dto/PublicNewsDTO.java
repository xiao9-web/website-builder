package com.xiao9.wb.publicsite.dto;

import com.xiao9.wb.news.entity.News;

import java.time.LocalDateTime;

public record PublicNewsDTO(
        Long id,
        String title,
        String slug,
        String summary,
        String content,
        String category,
        String coverImage,
        LocalDateTime publishedAt
) {
    public static PublicNewsDTO from(News news) {
        return new PublicNewsDTO(
                news.getId(),
                news.getTitle(),
                news.getSlug(),
                news.getSummary(),
                news.getContent(),
                news.getCategory(),
                news.getCoverImage(),
                news.getPublishedAt()
        );
    }
}
