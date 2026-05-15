package com.blog.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {

    private long totalArticles;
    private long publishedArticles;
    private long draftArticles;
    private long totalComments;
    private long pendingComments;
    private long totalMedia;
    private List<RecentArticleItem> recentArticles;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecentArticleItem {
        private Long id;
        private String title;
        private String slug;
        private String status;
        private LocalDateTime createdAt;
    }
}
