package com.blog.dto.setting;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSettingsRequest {

    @NotEmpty(message = "Settings map must not be empty")
    private Map<String, String> settings;
}
