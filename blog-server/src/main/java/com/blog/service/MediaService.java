package com.blog.service;

import com.blog.dto.common.PageResponse;
import com.blog.dto.media.MediaResponse;
import com.blog.entity.Media;
import com.blog.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;

    @Value("${app.upload.path}")
    private String uploadPath;

    @Transactional
    public MediaResponse upload(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID() + extension;

        try {
            Path uploadDir = Paths.get(uploadPath).toAbsolutePath().normalize();
            Files.createDirectories(uploadDir);

            Path targetPath = uploadDir.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetPath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }

        Media media = Media.builder()
                .filename(uniqueFilename)
                .url("/uploads/" + uniqueFilename)
                .mimeType(file.getContentType())
                .size(file.getSize())
                .build();

        Media saved = mediaRepository.save(media);
        return toMediaResponse(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<MediaResponse> list(Pageable pageable) {
        Page<Media> page = mediaRepository.findAll(pageable);

        List<MediaResponse> content = page.getContent().stream()
                .map(this::toMediaResponse)
                .collect(Collectors.toList());

        return PageResponse.<MediaResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    @Transactional
    public void delete(Long id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Media not found: " + id));

        // Delete file from disk
        try {
            Path filePath = Paths.get(uploadPath).toAbsolutePath().normalize().resolve(media.getFilename());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log but don't fail the operation if file is already gone
        }

        mediaRepository.deleteById(id);
    }

    private MediaResponse toMediaResponse(Media media) {
        return MediaResponse.builder()
                .id(media.getId())
                .filename(media.getFilename())
                .url(media.getUrl())
                .mimeType(media.getMimeType())
                .size(media.getSize())
                .createdAt(media.getCreatedAt())
                .build();
    }
}
