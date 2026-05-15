package com.blog.dto.media;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MediaResponse {

    private Long id;
    private String filename;
    private String url;
    private String mimeType;
    private Long size;
    private LocalDateTime createdAt;
}
