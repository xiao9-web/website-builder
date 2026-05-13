package com.xiao9.wb.site.repository;

import com.xiao9.wb.site.entity.SiteConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SiteConfigRepository extends JpaRepository<SiteConfig, Long> {

    Optional<SiteConfig> findBySiteId(Long siteId);
}
