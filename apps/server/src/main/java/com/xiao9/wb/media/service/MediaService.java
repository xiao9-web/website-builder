package com.xiao9.wb.media.service;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.common.exception.ErrorCode;
import com.xiao9.wb.common.response.PageResponse;
import com.xiao9.wb.media.dto.MediaDTO;
import com.xiao9.wb.media.entity.Media;
import com.xiao9.wb.media.repository.MediaRepository;
import com.xiao9.wb.user.entity.User;
import com.xiao9.wb.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;
    private final UserRepository userRepository;

    @Value("${app.media.upload-dir:./uploads}")
    private String uploadDir;

    @Value("${app.media.base-url:http://localhost:8080/uploads}")
    private String baseUrl;

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
            "video/mp4", "video/webm",
            "application/pdf"
    );

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    @Transactional
    public MediaDTO upload(MultipartFile file, Long userId) {
        validateFile(file);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        String originalFilename = file.getOriginalFilename();
        String extension = getExtension(originalFilename);
        String storedFilename = UUID.randomUUID() + extension;
        String storageKey = "media/" + storedFilename;

        try {
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(storedFilename);
            file.transferTo(filePath.toFile());
        } catch (IOException e) {
            log.error("Failed to store file: {}", originalFilename, e);
            throw new BusinessException(ErrorCode.MEDIA_UPLOAD_FAILED, "Failed to store file");
        }

        String url = baseUrl + "/" + storedFilename;

        Media media = Media.builder()
                .filename(storedFilename)
                .originalFilename(originalFilename)
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .url(url)
                .storageKey(storageKey)
                .uploadedBy(user)
                .build();

        mediaRepository.save(media);
        log.info("Media uploaded: {} by user {}", storedFilename, userId);
        return MediaDTO.from(media);
    }

    @Transactional(readOnly = true)
    public PageResponse<MediaDTO> listByUser(Long userId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Media> mediaPage = mediaRepository.findByUploadedById(userId, pageRequest);

        List<MediaDTO> dtos = mediaPage.getContent().stream()
                .map(MediaDTO::from)
                .toList();

        return PageResponse.of(dtos, page, size, mediaPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public MediaDTO getById(Long id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEDIA_NOT_FOUND));
        return MediaDTO.from(media);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEDIA_NOT_FOUND));

        if (!media.getUploadedBy().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "You can only delete your own media");
        }

        // Delete physical file
        try {
            Path filePath = Paths.get(uploadDir).resolve(media.getFilename());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.warn("Failed to delete file: {}", media.getFilename(), e);
        }

        mediaRepository.delete(media);
        log.info("Media deleted: {} by user {}", id, userId);
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessException(ErrorCode.MEDIA_UPLOAD_FAILED, "File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessException(ErrorCode.MEDIA_UPLOAD_FAILED, "File size exceeds 10MB limit");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new BusinessException(ErrorCode.MEDIA_TYPE_NOT_SUPPORTED);
        }
    }

    private String getExtension(String filename) {
        if (filename == null) return "";
        int dotIndex = filename.lastIndexOf('.');
        return dotIndex >= 0 ? filename.substring(dotIndex) : "";
    }
}
