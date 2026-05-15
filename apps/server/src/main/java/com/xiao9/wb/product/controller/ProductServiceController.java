package com.xiao9.wb.product.controller;

import com.xiao9.wb.common.response.ApiResponse;
import com.xiao9.wb.product.dto.ProductServiceDTO;
import com.xiao9.wb.product.dto.UpdateProductEnabledRequest;
import com.xiao9.wb.product.dto.UpsertProductServiceRequest;
import com.xiao9.wb.product.service.ProductServiceManager;
import com.xiao9.wb.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites/{siteId}/products")
@RequiredArgsConstructor
public class ProductServiceController {

    private final ProductServiceManager productServiceManager;

    @GetMapping
    public ApiResponse<List<ProductServiceDTO>> list(
            @PathVariable Long siteId,
            @RequestParam(required = false) Boolean enabled,
            @AuthenticationPrincipal User user
    ) {
        List<ProductServiceDTO> products = productServiceManager.list(siteId, enabled, user);
        return ApiResponse.success(products);
    }

    @PostMapping
    public ApiResponse<ProductServiceDTO> create(
            @PathVariable Long siteId,
            @Valid @RequestBody UpsertProductServiceRequest request,
            @AuthenticationPrincipal User user
    ) {
        ProductServiceDTO product = productServiceManager.create(siteId, request, user);
        return ApiResponse.success(product);
    }

    @PutMapping("/{productId}")
    public ApiResponse<ProductServiceDTO> update(
            @PathVariable Long siteId,
            @PathVariable Long productId,
            @Valid @RequestBody UpsertProductServiceRequest request,
            @AuthenticationPrincipal User user
    ) {
        ProductServiceDTO product = productServiceManager.update(siteId, productId, request, user);
        return ApiResponse.success(product);
    }

    @DeleteMapping("/{productId}")
    public ApiResponse<Void> delete(
            @PathVariable Long siteId,
            @PathVariable Long productId,
            @AuthenticationPrincipal User user
    ) {
        productServiceManager.delete(siteId, productId, user);
        return ApiResponse.success();
    }

    @PatchMapping("/{productId}/enabled")
    public ApiResponse<ProductServiceDTO> updateEnabled(
            @PathVariable Long siteId,
            @PathVariable Long productId,
            @Valid @RequestBody UpdateProductEnabledRequest request,
            @AuthenticationPrincipal User user
    ) {
        ProductServiceDTO product = productServiceManager.updateEnabled(siteId, productId, request.enabled(), user);
        return ApiResponse.success(product);
    }
}
