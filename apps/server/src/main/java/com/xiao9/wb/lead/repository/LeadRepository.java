package com.xiao9.wb.lead.repository;

import com.xiao9.wb.lead.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {

    List<Lead> findBySiteIdOrderByCreatedAtDesc(Long siteId);

    List<Lead> findBySiteIdAndStatusOrderByCreatedAtDesc(Long siteId, Lead.Status status);

    Optional<Lead> findByIdAndSiteId(Long id, Long siteId);
}
