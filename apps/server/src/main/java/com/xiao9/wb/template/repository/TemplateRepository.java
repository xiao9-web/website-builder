package com.xiao9.wb.template.repository;

import com.xiao9.wb.template.entity.Template;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Long> {

    Page<Template> findByStatus(Template.Status status, Pageable pageable);

    Page<Template> findByCategory(String category, Pageable pageable);

    Page<Template> findByAuthorId(Long authorId, Pageable pageable);

    Page<Template> findByStatusAndCategory(Template.Status status, String category, Pageable pageable);

    Optional<Template> findByCode(String code);
}
