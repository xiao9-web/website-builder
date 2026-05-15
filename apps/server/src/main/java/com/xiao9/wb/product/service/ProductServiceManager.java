package com.xiao9.wb.product.service;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.common.exception.ErrorCode;
import com.xiao9.wb.product.dto.ProductServiceDTO;
import com.xiao9.wb.product.dto.UpsertProductServiceRequest;
import com.xiao9.wb.product.entity.ProductService;
import com.xiao9.wb.product.repository.ProductServiceRepository;
import com.xiao9.wb.site.entity.Site;
import com.xiao9.wb.site.service.SiteService;
import com.xiao9.wb.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceManager {

    private final ProductServiceRepository productServiceRepository;
    private final SiteService siteService;

    @Transactional(readOnly = true)
    public List<ProductServiceDTO> list(Long siteId, Boolean enabled, User user) {
        Site site = siteService.requireReadableSite(siteId, user);
        List<ProductService> products = enabled == null
                ? productServiceRepository.findBySiteIdOrderBySortOrderAscCreatedAtAsc(site.getId())
                : productServiceRepository.findBySiteIdAndEnabledOrderBySortOrderAscCreatedAtAsc(site.getId(), enabled);

        return products.stream()
                .map(ProductServiceDTO::from)
                .toList();
    }

    @Transactional
    public ProductServiceDTO create(Long siteId, UpsertProductServiceRequest request, User user) {
        Site site = siteService.requireReadableSite(siteId, user);
        ProductService product = ProductService.builder()
                .site(site)
                .name(request.name())
                .summary(request.summary())
                .description(request.description())
                .imageUrl(request.imageUrl())
                .scenarios(request.scenarios())
                .sortOrder(defaultSortOrder(request.sortOrder()))
                .enabled(defaultEnabled(request.enabled()))
                .build();

        productServiceRepository.save(product);
        log.info("Product service created: {} for site {} by user {}", product.getName(), siteId, user.getId());
        return ProductServiceDTO.from(product);
    }

    @Transactional
    public ProductServiceDTO update(Long siteId, Long productId, UpsertProductServiceRequest request, User user) {
        siteService.requireReadableSite(siteId, user);
        ProductService product = requireProductInSite(siteId, productId);

        product.setName(request.name());
        product.setSummary(request.summary());
        product.setDescription(request.description());
        product.setImageUrl(request.imageUrl());
        product.setScenarios(request.scenarios());
        product.setSortOrder(defaultSortOrder(request.sortOrder()));
        product.setEnabled(defaultEnabled(request.enabled()));

        productServiceRepository.save(product);
        return ProductServiceDTO.from(product);
    }

    @Transactional
    public void delete(Long siteId, Long productId, User user) {
        siteService.requireReadableSite(siteId, user);
        ProductService product = requireProductInSite(siteId, productId);
        productServiceRepository.delete(product);
        log.info("Product service deleted: {} for site {} by user {}", productId, siteId, user.getId());
    }

    @Transactional
    public ProductServiceDTO updateEnabled(Long siteId, Long productId, Boolean enabled, User user) {
        siteService.requireReadableSite(siteId, user);
        ProductService product = requireProductInSite(siteId, productId);
        product.setEnabled(enabled);

        productServiceRepository.save(product);
        return ProductServiceDTO.from(product);
    }

    private ProductService requireProductInSite(Long siteId, Long productId) {
        return productServiceRepository.findByIdAndSiteId(productId, siteId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Product service not found"));
    }

    private Integer defaultSortOrder(Integer sortOrder) {
        return sortOrder != null ? sortOrder : 0;
    }

    private Boolean defaultEnabled(Boolean enabled) {
        return enabled != null ? enabled : true;
    }
}
