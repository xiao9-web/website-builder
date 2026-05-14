package com.xiao9.wb.site.repository;

import com.xiao9.wb.site.entity.Site;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SiteRepository extends JpaRepository<Site, Long> {

    Page<Site> findByOwnerId(Long ownerId, Pageable pageable);

    Optional<Site> findBySlug(String slug);

    Optional<Site> findByDomain(String domain);

    Optional<Site> findBySubdomain(String subdomain);

    boolean existsByDomain(String domain);

    boolean existsBySubdomain(String subdomain);

    boolean existsBySlug(String slug);
}
