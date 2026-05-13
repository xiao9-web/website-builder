package com.xiao9.wb.media.controller;

import com.xiao9.wb.common.response.ApiResponse;
import com.xiao9.wb.common.response.PageResponse;
import com.xiao9.wb.media.dto.MediaDTO;
import com.xiao9.wb.media.service.MediaService;
import com.xiao9.wb.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/upload")
    public ApiResponse<MediaDTO> upload(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user
    ) {
        MediaDTO media = mediaService.upload(file, user.getId());
        return ApiResponse.success(media);
    }

    @GetMapping
    public ApiResponse<PageResponse<MediaDTO>> listMyMedia(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal User user
    ) {
        PageResponse<MediaDTO> media = mediaService.listByUser(user.getId(), page, size);
        return ApiResponse.success(media);
    }

    @GetMapping("/{id}")
    public ApiResponse<MediaDTO> getById(@PathVariable Long id) {
        MediaDTO media = mediaService.getById(id);
        return ApiResponse.success(media);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        mediaService.delete(id, user.getId());
        return ApiResponse.success();
    }
}
