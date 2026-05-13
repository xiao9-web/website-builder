package com.xiao9.wb.media.dto;

import com.xiao9.wb.media.entity.Media;

import java.time.LocalDateTime;

public record MediaDTO(
        Long id,
        String filename,
        String originalFilename,
        String contentType,
        long fileSize,
        String url,
        String thumbnailUrl,
        Long uploadedBy,
        LocalDateTime createdAt
) {
    public static MediaDTO from(Media media) {
        return new MediaDTO(
                media.getId(),
                media.getFilename(),
                media.getOriginalFilename(),
                media.getContentType(),
                media.getFileSize(),
                media.getUrl(),
                media.getThumbnailUrl(),
                media.getUploadedBy().getId(),
                media.getCreatedAt()
        );
    }
}
