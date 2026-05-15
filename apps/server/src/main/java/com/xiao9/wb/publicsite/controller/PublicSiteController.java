package com.xiao9.wb.publicsite.controller;

import com.xiao9.wb.common.response.ApiResponse;
import com.xiao9.wb.publicsite.dto.PublicNewsDTO;
import com.xiao9.wb.publicsite.dto.PublicProductDTO;
import com.xiao9.wb.publicsite.dto.PublicSiteConfigDTO;
import com.xiao9.wb.publicsite.service.PublicSiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/sites/{slug}")
@RequiredArgsConstructor
public class PublicSiteController {

    private final PublicSiteService publicSiteService;

    @GetMapping("/config")
    public ApiResponse<PublicSiteConfigDTO> getConfig(@PathVariable String slug) {
        return ApiResponse.success(publicSiteService.getConfig(slug));
    }

    @GetMapping("/products")
    public ApiResponse<List<PublicProductDTO>> listProducts(@PathVariable String slug) {
        return ApiResponse.success(publicSiteService.listProducts(slug));
    }

    @GetMapping("/news")
    public ApiResponse<List<PublicNewsDTO>> listNews(@PathVariable String slug) {
        return ApiResponse.success(publicSiteService.listNews(slug));
    }

    @GetMapping("/news/{newsSlug}")
    public ApiResponse<PublicNewsDTO> getNews(
            @PathVariable String slug,
            @PathVariable String newsSlug
    ) {
        return ApiResponse.success(publicSiteService.getNewsBySlug(slug, newsSlug));
    }
}
