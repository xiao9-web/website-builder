package com.xiao9.wb.template.controller;

import com.xiao9.wb.common.response.ApiResponse;
import com.xiao9.wb.common.response.PageResponse;
import com.xiao9.wb.template.dto.CreateTemplateRequest;
import com.xiao9.wb.template.dto.TemplateDTO;
import com.xiao9.wb.template.service.TemplateService;
import com.xiao9.wb.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
public class TemplateController {

    private final TemplateService templateService;

    @GetMapping
    public ApiResponse<PageResponse<TemplateDTO>> listPublished(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String category
    ) {
        PageResponse<TemplateDTO> templates = templateService.listPublished(page, size, category);
        return ApiResponse.success(templates);
    }

    @GetMapping("/{id}")
    public ApiResponse<TemplateDTO> getById(@PathVariable Long id) {
        TemplateDTO template = templateService.getById(id);
        return ApiResponse.success(template);
    }

    @PostMapping
    public ApiResponse<TemplateDTO> create(
            @Valid @RequestBody CreateTemplateRequest request,
            @AuthenticationPrincipal User user
    ) {
        TemplateDTO template = templateService.create(request, user.getId());
        return ApiResponse.success(template);
    }

    @PutMapping("/{id}/schema")
    public ApiResponse<TemplateDTO> updateSchema(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User user
    ) {
        @SuppressWarnings("unchecked")
        Map<String, Object> schema = (Map<String, Object>) body.get("schema");
        String changelog = (String) body.get("changelog");
        TemplateDTO template = templateService.updateSchema(id, schema, changelog, user.getId());
        return ApiResponse.success(template);
    }

    @PostMapping("/{id}/publish")
    public ApiResponse<TemplateDTO> publish(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        TemplateDTO template = templateService.publish(id, user.getId());
        return ApiResponse.success(template);
    }
}
