package com.xiao9.wb.product.service;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.product.dto.UpsertProductServiceRequest;
import com.xiao9.wb.product.entity.ProductService;
import com.xiao9.wb.product.repository.ProductServiceRepository;
import com.xiao9.wb.site.entity.Site;
import com.xiao9.wb.site.service.SiteService;
import com.xiao9.wb.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class ProductServiceManagerTest {

    private ProductServiceRepository productServiceRepository;
    private SiteService siteService;
    private ProductServiceManager productServiceManager;
    private User user;
    private Site site;

    @BeforeEach
    void setUp() {
        productServiceRepository = mock(ProductServiceRepository.class);
        siteService = mock(SiteService.class);
        productServiceManager = new ProductServiceManager(productServiceRepository, siteService);
        user = User.builder().id(7L).role(User.Role.USER).build();
        site = Site.builder().id(11L).owner(user).build();
    }

    @Test
    void listReturnsAllProductsWhenEnabledFilterIsMissing() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        ProductService first = product(1L, site, "A", true, 0, LocalDateTime.parse("2026-01-01T00:00:00"));
        ProductService second = product(2L, site, "B", false, 1, LocalDateTime.parse("2026-01-02T00:00:00"));
        when(productServiceRepository.findBySiteIdOrderBySortOrderAscCreatedAtAsc(11L))
                .thenReturn(List.of(first, second));

        var products = productServiceManager.list(11L, null, user);

        assertThat(products).extracting("id").containsExactly(1L, 2L);
        verify(productServiceRepository).findBySiteIdOrderBySortOrderAscCreatedAtAsc(11L);
        verify(productServiceRepository, never()).findBySiteIdAndEnabledOrderBySortOrderAscCreatedAtAsc(anyLong(), any());
    }

    @Test
    void listAppliesEnabledFilterWhenPresent() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        ProductService enabled = product(1L, site, "A", true, 0, LocalDateTime.parse("2026-01-01T00:00:00"));
        when(productServiceRepository.findBySiteIdAndEnabledOrderBySortOrderAscCreatedAtAsc(11L, true))
                .thenReturn(List.of(enabled));

        var products = productServiceManager.list(11L, true, user);

        assertThat(products).extracting("enabled").containsExactly(true);
        verify(productServiceRepository).findBySiteIdAndEnabledOrderBySortOrderAscCreatedAtAsc(11L, true);
    }

    @Test
    void createDefaultsSortOrderAndEnabled() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        UpsertProductServiceRequest request = new UpsertProductServiceRequest(
                "Consulting",
                "Enterprise consulting",
                null,
                null,
                null,
                null,
                null
        );
        when(productServiceRepository.save(any(ProductService.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var product = productServiceManager.create(11L, request, user);

        assertThat(product.sortOrder()).isZero();
        assertThat(product.enabled()).isTrue();
        verify(productServiceRepository).save(argThat(saved ->
                saved.getSite() == site && saved.getSortOrder() == 0 && saved.getEnabled()
        ));
    }

    @Test
    void updateRejectsProductOutsideSiteScope() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(productServiceRepository.findByIdAndSiteId(99L, 11L)).thenReturn(Optional.empty());
        UpsertProductServiceRequest request = new UpsertProductServiceRequest(
                "Consulting",
                "Enterprise consulting",
                null,
                null,
                null,
                2,
                false
        );

        assertThatThrownBy(() -> productServiceManager.update(11L, 99L, request, user))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Product service not found");

        verify(productServiceRepository, never()).save(any());
    }

    @Test
    void deleteRejectsProductOutsideSiteScope() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(productServiceRepository.findByIdAndSiteId(99L, 11L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productServiceManager.delete(11L, 99L, user))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Product service not found");

        verify(productServiceRepository, never()).delete(any());
    }

    private ProductService product(Long id, Site site, String name, boolean enabled, int sortOrder, LocalDateTime createdAt) {
        return ProductService.builder()
                .id(id)
                .site(site)
                .name(name)
                .summary(name + " summary")
                .enabled(enabled)
                .sortOrder(sortOrder)
                .createdAt(createdAt)
                .build();
    }
}
