package com.blog.service;

import com.blog.dto.stats.DashboardStatsResponse;
import com.blog.entity.Article;
import com.blog.repository.ArticleRepository;
import com.blog.repository.CommentRepository;
import com.blog.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final ArticleRepository articleRepository;
    private final CommentRepository commentRepository;
    private final MediaRepository mediaRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalArticles = articleRepository.count();
        long publishedArticles = articleRepository.countByStatus("published");
        long draftArticles = articleRepository.countByStatus("draft");

        long totalComments = commentRepository.count();
        long pendingComments = commentRepository.countByStatus("pending");

        long totalMedia = mediaRepository.count();

        PageRequest recentPage = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Article> recent = articleRepository.findAll(recentPage).getContent();

        List<DashboardStatsResponse.RecentArticleItem> recentArticles = recent.stream()
                .map(article -> DashboardStatsResponse.RecentArticleItem.builder()
                        .id(article.getId())
                        .title(article.getTitle())
                        .slug(article.getSlug())
                        .status(article.getStatus())
                        .createdAt(article.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return DashboardStatsResponse.builder()
                .totalArticles(totalArticles)
                .publishedArticles(publishedArticles)
                .draftArticles(draftArticles)
                .totalComments(totalComments)
                .pendingComments(pendingComments)
                .totalMedia(totalMedia)
                .recentArticles(recentArticles)
                .build();
    }
}
