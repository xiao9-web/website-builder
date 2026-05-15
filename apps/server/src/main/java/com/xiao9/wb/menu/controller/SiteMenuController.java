package com.xiao9.wb.menu.controller;

import com.xiao9.wb.common.response.ApiResponse;
import com.xiao9.wb.menu.dto.SiteMenuDTO;
import com.xiao9.wb.menu.dto.UpsertSiteMenuRequest;
import com.xiao9.wb.menu.service.SiteMenuService;
import com.xiao9.wb.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites/{siteId}/menus")
@RequiredArgsConstructor
public class SiteMenuController {

    private final SiteMenuService siteMenuService;

    @GetMapping
    public ApiResponse<List<SiteMenuDTO>> list(
            @PathVariable Long siteId,
            @AuthenticationPrincipal User user
    ) {
        return ApiResponse.success(siteMenuService.list(siteId, user));
    }

    @PostMapping
    public ApiResponse<SiteMenuDTO> create(
            @PathVariable Long siteId,
            @Valid @RequestBody UpsertSiteMenuRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ApiResponse.success(siteMenuService.create(siteId, request, user));
    }

    @PutMapping("/{menuId}")
    public ApiResponse<SiteMenuDTO> update(
            @PathVariable Long siteId,
            @PathVariable Long menuId,
            @Valid @RequestBody UpsertSiteMenuRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ApiResponse.success(siteMenuService.update(siteId, menuId, request, user));
    }

    @DeleteMapping("/{menuId}")
    public ApiResponse<Void> delete(
            @PathVariable Long siteId,
            @PathVariable Long menuId,
            @AuthenticationPrincipal User user
    ) {
        siteMenuService.delete(siteId, menuId, user);
        return ApiResponse.success();
    }
}
