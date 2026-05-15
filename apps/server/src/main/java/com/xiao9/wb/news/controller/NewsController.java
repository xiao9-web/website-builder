package com.xiao9.wb.news.controller;

import com.xiao9.wb.common.response.ApiResponse;
import com.xiao9.wb.news.dto.NewsDTO;
import com.xiao9.wb.news.dto.UpdateNewsStatusRequest;
import com.xiao9.wb.news.dto.UpsertNewsRequest;
import com.xiao9.wb.news.service.NewsService;
import com.xiao9.wb.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites/{siteId}/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    @GetMapping
    public ApiResponse<List<NewsDTO>> list(
            @PathVariable Long siteId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long menuId,
            @AuthenticationPrincipal User user
    ) {
        List<NewsDTO> news = newsService.list(siteId, status, menuId, user);
        return ApiResponse.success(news);
    }

    @PostMapping
    public ApiResponse<NewsDTO> create(
            @PathVariable Long siteId,
            @Valid @RequestBody UpsertNewsRequest request,
            @AuthenticationPrincipal User user
    ) {
        NewsDTO news = newsService.create(siteId, request, user);
        return ApiResponse.success(news);
    }

    @GetMapping("/{newsId}")
    public ApiResponse<NewsDTO> get(
            @PathVariable Long siteId,
            @PathVariable Long newsId,
            @AuthenticationPrincipal User user
    ) {
        NewsDTO news = newsService.get(siteId, newsId, user);
        return ApiResponse.success(news);
    }

    @PutMapping("/{newsId}")
    public ApiResponse<NewsDTO> update(
            @PathVariable Long siteId,
            @PathVariable Long newsId,
            @Valid @RequestBody UpsertNewsRequest request,
            @AuthenticationPrincipal User user
    ) {
        NewsDTO news = newsService.update(siteId, newsId, request, user);
        return ApiResponse.success(news);
    }

    @DeleteMapping("/{newsId}")
    public ApiResponse<Void> delete(
            @PathVariable Long siteId,
            @PathVariable Long newsId,
            @AuthenticationPrincipal User user
    ) {
        newsService.delete(siteId, newsId, user);
        return ApiResponse.success();
    }

    @PatchMapping("/{newsId}/status")
    public ApiResponse<NewsDTO> updateStatus(
            @PathVariable Long siteId,
            @PathVariable Long newsId,
            @Valid @RequestBody UpdateNewsStatusRequest request,
            @AuthenticationPrincipal User user
    ) {
        NewsDTO news = newsService.updateStatus(siteId, newsId, request.status(), user);
        return ApiResponse.success(news);
    }
}
