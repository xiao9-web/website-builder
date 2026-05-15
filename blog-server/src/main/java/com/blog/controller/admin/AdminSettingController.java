package com.blog.controller.admin;

import com.blog.dto.setting.SettingResponse;
import com.blog.dto.setting.UpdateSettingsRequest;
import com.blog.service.SiteSettingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
public class AdminSettingController {

    private final SiteSettingService siteSettingService;

    @GetMapping
    public ResponseEntity<List<SettingResponse>> getAllSettings() {
        return ResponseEntity.ok(siteSettingService.getAllSettings());
    }

    @PutMapping
    public ResponseEntity<List<SettingResponse>> updateSettings(
            @Valid @RequestBody UpdateSettingsRequest request) {
        return ResponseEntity.ok(siteSettingService.updateSettings(request));
    }
}
