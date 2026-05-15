package com.blog.dto.article;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ArticleResponse {

    private Long id;
    private String title;
    private String slug;
    private String content;
    private String excerpt;
    private String coverImage;
    private String status;
    private Long menuId;
    private String menuName;
    private List<TagResponse> tags;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    public static class TagResponse {
        private Long id;
        private String name;
        private String slug;
    }
}
