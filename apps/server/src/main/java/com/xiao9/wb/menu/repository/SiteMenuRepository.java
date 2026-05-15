package com.xiao9.wb.menu.repository;

import com.xiao9.wb.menu.entity.SiteMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SiteMenuRepository extends JpaRepository<SiteMenu, Long> {

    List<SiteMenu> findBySiteIdOrderBySortOrderAscCreatedAtAsc(Long siteId);

    Optional<SiteMenu> findByIdAndSiteId(Long id, Long siteId);

    Optional<SiteMenu> findBySiteIdAndSlug(Long siteId, String slug);

    boolean existsByParentId(Long parentId);
}
