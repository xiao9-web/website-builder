package com.blog.controller.admin;

import com.blog.dto.article.ArticleListResponse;
import com.blog.dto.article.ArticleResponse;
import com.blog.dto.article.CreateArticleRequest;
import com.blog.dto.article.UpdateArticleRequest;
import com.blog.dto.common.PageResponse;
import com.blog.service.ArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/articles")
@RequiredArgsConstructor
public class AdminArticleController {

    private final ArticleService articleService;

    @GetMapping
    public ResponseEntity<PageResponse<ArticleListResponse>> list(
            Pageable pageable,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(articleService.list(pageable, status));
    }

    @PostMapping
    public ResponseEntity<ArticleResponse> create(@Valid @RequestBody CreateArticleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(articleService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticleResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateArticleRequest request) {
        return ResponseEntity.ok(articleService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        articleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<ArticleResponse> publish(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.publish(id));
    }
}
