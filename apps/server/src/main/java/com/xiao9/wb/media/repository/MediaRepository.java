package com.xiao9.wb.media.repository;

import com.xiao9.wb.media.entity.Media;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {

    Page<Media> findByUploadedById(Long userId, Pageable pageable);

    Page<Media> findByContentTypeStartingWith(String contentTypePrefix, Pageable pageable);
}
