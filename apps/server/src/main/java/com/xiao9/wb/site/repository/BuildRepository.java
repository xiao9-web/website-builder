package com.xiao9.wb.site.repository;

import com.xiao9.wb.site.entity.Build;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BuildRepository extends JpaRepository<Build, Long> {

    Page<Build> findBySiteIdOrderByCreatedAtDesc(Long siteId, Pageable pageable);

    Optional<Build> findFirstBySiteIdAndStatusOrderByCreatedAtDesc(Long siteId, Build.Status status);
}
