package com.xiao9.wb.product.repository;

import com.xiao9.wb.product.entity.ProductService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductServiceRepository extends JpaRepository<ProductService, Long> {

    List<ProductService> findBySiteIdOrderBySortOrderAscCreatedAtAsc(Long siteId);

    List<ProductService> findBySiteIdAndEnabledOrderBySortOrderAscCreatedAtAsc(Long siteId, Boolean enabled);

    Optional<ProductService> findByIdAndSiteId(Long id, Long siteId);
}
