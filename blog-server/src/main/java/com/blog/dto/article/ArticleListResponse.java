package com.blog.dto.article;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ArticleListResponse {

    private Long id;
    private String title;
    private String slug;
    private String excerpt;
    private String coverImage;
    private String status;
    private String menuName;
    private List<ArticleResponse.TagResponse> tags;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
}
