package com.xiao9.wb.news.repository;

import com.xiao9.wb.news.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    List<News> findBySiteIdOrderByCreatedAtDesc(Long siteId);

    List<News> findBySiteIdAndStatusOrderByCreatedAtDesc(Long siteId, News.Status status);

    List<News> findBySiteIdAndMenuIdOrderByCreatedAtDesc(Long siteId, Long menuId);

    List<News> findBySiteIdAndMenuIdAndStatusOrderByCreatedAtDesc(Long siteId, Long menuId, News.Status status);

    Optional<News> findByIdAndSiteId(Long id, Long siteId);

    Optional<News> findBySiteIdAndSlug(Long siteId, String slug);

    Optional<News> findBySiteIdAndSlugAndStatus(Long siteId, String slug, News.Status status);
}
