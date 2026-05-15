package com.xiao9.wb.publicsite.dto;

import com.xiao9.wb.product.entity.ProductService;

import java.util.List;

public record PublicProductDTO(
        Long id,
        String name,
        String summary,
        String description,
        String imageUrl,
        List<Object> scenarios,
        Integer sortOrder
) {
    public static PublicProductDTO from(ProductService product) {
        return new PublicProductDTO(
                product.getId(),
                product.getName(),
                product.getSummary(),
                product.getDescription(),
                product.getImageUrl(),
                product.getScenarios(),
                product.getSortOrder()
        );
    }
}
