package com.blog.controller.api;

import com.blog.dto.setting.SettingResponse;
import com.blog.service.SiteSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class PublicSettingController {

    private final SiteSettingService siteSettingService;

    @GetMapping
    public ResponseEntity<List<SettingResponse>> getPublicSettings() {
        return ResponseEntity.ok(siteSettingService.getPublicSettings());
    }
}
