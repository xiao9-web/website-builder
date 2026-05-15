package com.blog.service;

import com.blog.dto.setting.SettingResponse;
import com.blog.dto.setting.UpdateSettingsRequest;
import com.blog.entity.SiteSetting;
import com.blog.repository.SiteSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SiteSettingService {

    private static final Set<String> PUBLIC_KEYS = Set.of(
            "blog_name",
            "blog_description",
            "theme_color",
            "social_links",
            "hero_content",
            "logo_url"
    );

    private final SiteSettingRepository siteSettingRepository;

    @Transactional(readOnly = true)
    public List<SettingResponse> getPublicSettings() {
        return siteSettingRepository.findAllById(PUBLIC_KEYS).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SettingResponse> getAllSettings() {
        return siteSettingRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<SettingResponse> updateSettings(UpdateSettingsRequest request) {
        List<SiteSetting> settings = request.getSettings().entrySet().stream()
                .map(entry -> {
                    SiteSetting setting = siteSettingRepository.findById(entry.getKey())
                            .orElse(new SiteSetting());
                    setting.setKey(entry.getKey());
                    setting.setValue(entry.getValue());
                    return setting;
                })
                .collect(Collectors.toList());

        return siteSettingRepository.saveAll(settings).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SettingResponse getSetting(String key) {
        SiteSetting setting = siteSettingRepository.findById(key)
                .orElseThrow(() -> new IllegalArgumentException("Setting not found: " + key));
        return toResponse(setting);
    }

    private SettingResponse toResponse(SiteSetting setting) {
        return SettingResponse.builder()
                .key(setting.getKey())
                .value(setting.getValue())
                .build();
    }
}
