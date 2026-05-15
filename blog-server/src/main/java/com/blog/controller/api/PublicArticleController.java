package com.blog.controller.api;

import com.blog.dto.article.ArticleListResponse;
import com.blog.dto.article.ArticleResponse;
import com.blog.dto.common.PageResponse;
import com.blog.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class PublicArticleController {

    private final ArticleService articleService;

    @GetMapping
    public ResponseEntity<PageResponse<ArticleListResponse>> listPublished(Pageable pageable) {
        return ResponseEntity.ok(articleService.listPublished(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<ArticleListResponse>> search(
            @RequestParam("q") String query,
            Pageable pageable) {
        return ResponseEntity.ok(articleService.search(query, pageable));
    }

    @GetMapping("/archive")
    public ResponseEntity<Map<Integer, List<ArticleListResponse>>> archive() {
        return ResponseEntity.ok(articleService.archive());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ArticleResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(articleService.getBySlug(slug));
    }
}
