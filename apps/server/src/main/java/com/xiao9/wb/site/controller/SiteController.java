package com.xiao9.wb.site.controller;

import com.xiao9.wb.common.response.ApiResponse;
import com.xiao9.wb.common.response.PageResponse;
import com.xiao9.wb.site.dto.BuildDTO;
import com.xiao9.wb.site.dto.CreateSiteRequest;
import com.xiao9.wb.site.dto.SiteConfigDTO;
import com.xiao9.wb.site.dto.SiteDTO;
import com.xiao9.wb.site.dto.UpdateSiteConfigRequest;
import com.xiao9.wb.site.dto.UpdateSiteRequest;
import com.xiao9.wb.site.service.BuildService;
import com.xiao9.wb.site.service.SiteService;
import com.xiao9.wb.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sites")
@RequiredArgsConstructor
public class SiteController {

    private final SiteService siteService;
    private final BuildService buildService;

    @GetMapping
    public ApiResponse<PageResponse<SiteDTO>> listMySites(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal User user
    ) {
        PageResponse<SiteDTO> sites = siteService.list(user, page, size);
        return ApiResponse.success(sites);
    }

    @GetMapping("/{id}")
    public ApiResponse<SiteDTO> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        SiteDTO site = siteService.getById(id, user);
        return ApiResponse.success(site);
    }

    @PostMapping
    public ApiResponse<SiteDTO> create(
            @Valid @RequestBody CreateSiteRequest request,
            @AuthenticationPrincipal User user
    ) {
        SiteDTO site = siteService.create(request, user.getId());
        return ApiResponse.success(site);
    }

    @PutMapping("/{id}")
    public ApiResponse<SiteDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSiteRequest request,
            @AuthenticationPrincipal User user
    ) {
        SiteDTO site = siteService.update(id, request, user);
        return ApiResponse.success(site);
    }

    @GetMapping("/{id}/config")
    public ApiResponse<SiteConfigDTO> getConfig(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        SiteConfigDTO config = siteService.getConfig(id, user);
        return ApiResponse.success(config);
    }

    @PutMapping("/{id}/config")
    public ApiResponse<SiteConfigDTO> updateConfig(
            @PathVariable Long id,
            @RequestBody UpdateSiteConfigRequest request,
            @AuthenticationPrincipal User user
    ) {
        SiteConfigDTO config = siteService.updateConfig(id, request, user);
        return ApiResponse.success(config);
    }

    @PostMapping("/{id}/publish")
    public ApiResponse<SiteDTO> publish(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        SiteDTO site = siteService.publish(id, user);
        return ApiResponse.success(site);
    }

    @PostMapping("/{id}/build")
    public ApiResponse<BuildDTO> triggerBuild(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        siteService.requireReadableSite(id, user);
        BuildDTO build = buildService.triggerBuild(id, "user:" + user.getId());
        return ApiResponse.success(build);
    }

    @GetMapping("/{id}/builds/latest")
    public ApiResponse<BuildDTO> getLatestBuild(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        siteService.requireReadableSite(id, user);
        BuildDTO build = buildService.getLatestBuild(id);
        return ApiResponse.success(build);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        siteService.delete(id, user);
        return ApiResponse.success();
    }
}
