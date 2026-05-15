package com.blog.controller.admin;

import com.blog.dto.common.PageResponse;
import com.blog.dto.media.MediaResponse;
import com.blog.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/media")
@RequiredArgsConstructor
public class AdminMediaController {

    private final MediaService mediaService;

    @GetMapping
    public ResponseEntity<PageResponse<MediaResponse>> list(Pageable pageable) {
        return ResponseEntity.ok(mediaService.list(pageable));
    }

    @PostMapping("/upload")
    public ResponseEntity<MediaResponse> upload(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mediaService.upload(file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        mediaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
