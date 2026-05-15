package com.blog.repository;

import com.blog.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MenuRepository extends JpaRepository<Menu, Long> {

    List<Menu> findByParentIsNullOrderBySortOrder();

    Optional<Menu> findBySlug(String slug);

    long countByParentIsNullAndIsFixedFalse();

    @Query("SELECT COUNT(a) FROM Article a WHERE a.menu.id = :menuId")
    long countArticlesByMenuId(@Param("menuId") Long menuId);
}
