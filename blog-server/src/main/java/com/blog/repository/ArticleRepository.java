package com.blog.repository;

import com.blog.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    long countByStatus(String status);

    Optional<Article> findBySlug(String slug);

    Page<Article> findByStatus(String status, Pageable pageable);

    Page<Article> findByMenuId(Long menuId, Pageable pageable);

    Page<Article> findByMenuIdAndStatus(Long menuId, String status, Pageable pageable);

    List<Article> findByStatusOrderByPublishedAtDesc(String status);

    @Query(value = "SELECT * FROM articles WHERE search_vector @@ plainto_tsquery('simple', :query) AND status = 'published' ORDER BY ts_rank(search_vector, plainto_tsquery('simple', :query)) DESC",
           countQuery = "SELECT count(*) FROM articles WHERE search_vector @@ plainto_tsquery('simple', :query) AND status = 'published'",
           nativeQuery = true)
    Page<Article> search(@Param("query") String query, Pageable pageable);
}
