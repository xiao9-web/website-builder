package com.xiao9.wb.product.dto;

import com.xiao9.wb.product.entity.ProductService;

import java.time.LocalDateTime;
import java.util.List;

public record ProductServiceDTO(
        Long id,
        Long siteId,
        String name,
        String summary,
        String description,
        String imageUrl,
        List<Object> scenarios,
        Integer sortOrder,
        Boolean enabled,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ProductServiceDTO from(ProductService product) {
        return new ProductServiceDTO(
                product.getId(),
                product.getSite().getId(),
                product.getName(),
                product.getSummary(),
                product.getDescription(),
                product.getImageUrl(),
                product.getScenarios(),
                product.getSortOrder(),
                product.getEnabled(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
