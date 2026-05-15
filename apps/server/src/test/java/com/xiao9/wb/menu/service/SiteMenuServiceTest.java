package com.xiao9.wb.menu.service;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.menu.dto.UpsertSiteMenuRequest;
import com.xiao9.wb.menu.entity.SiteMenu;
import com.xiao9.wb.menu.repository.SiteMenuRepository;
import com.xiao9.wb.site.entity.Site;
import com.xiao9.wb.site.service.SiteService;
import com.xiao9.wb.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class SiteMenuServiceTest {

    private SiteMenuRepository siteMenuRepository;
    private SiteService siteService;
    private SiteMenuService siteMenuService;
    private User user;
    private Site site;

    @BeforeEach
    void setUp() {
        siteMenuRepository = mock(SiteMenuRepository.class);
        siteService = mock(SiteService.class);
        siteMenuService = new SiteMenuService(siteMenuRepository, siteService);
        user = User.builder().id(7L).role(User.Role.USER).build();
        site = Site.builder().id(11L).owner(user).build();
    }

    @Test
    void listReturnsMenusAfterReadableSiteCheck() {
        SiteMenu home = menu(1L, null, "首页", "home", SiteMenu.MenuType.HOME);
        SiteMenu services = menu(2L, null, "产品服务", "services", SiteMenu.MenuType.CUSTOM);
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(siteMenuRepository.findBySiteIdOrderBySortOrderAscCreatedAtAsc(11L)).thenReturn(List.of(home, services));

        var result = siteMenuService.list(11L, user);

        assertThat(result).extracting("slug").containsExactly("home", "services");
        verify(siteService).requireReadableSite(11L, user);
    }

    @Test
    void createFirstLevelMenuNormalizesSlugAndDefaultsVisible() {
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(siteMenuRepository.findBySiteIdAndSlug(11L, "knowledge-center")).thenReturn(Optional.empty());
        when(siteMenuRepository.save(any(SiteMenu.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = siteMenuService.create(11L, request(null, "知识中心", " Knowledge-Center "), user);

        assertThat(result.slug()).isEqualTo("knowledge-center");
        assertThat(result.parentId()).isNull();
        assertThat(result.menuType()).isEqualTo("CUSTOM");
        assertThat(result.visible()).isTrue();
        verify(siteMenuRepository).save(argThat(saved ->
                saved.getSite() == site
                        && saved.getParent() == null
                        && saved.getSlug().equals("knowledge-center")
                        && saved.getMenuType() == SiteMenu.MenuType.CUSTOM
        ));
    }

    @Test
    void createAllowsSecondAndThirdLevelMenus() {
        SiteMenu level1 = menu(21L, null, "一级", "level-one", SiteMenu.MenuType.CUSTOM);
        SiteMenu level2 = menu(22L, level1, "二级", "level-two", SiteMenu.MenuType.CUSTOM);
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(siteMenuRepository.findByIdAndSiteId(21L, 11L)).thenReturn(Optional.of(level1));
        when(siteMenuRepository.findByIdAndSiteId(22L, 11L)).thenReturn(Optional.of(level2));
        when(siteMenuRepository.findBySiteIdAndSlug(11L, "second-child")).thenReturn(Optional.empty());
        when(siteMenuRepository.findBySiteIdAndSlug(11L, "third-child")).thenReturn(Optional.empty());
        when(siteMenuRepository.save(any(SiteMenu.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var second = siteMenuService.create(11L, request(21L, "二级菜单", "second-child"), user);
        var third = siteMenuService.create(11L, request(22L, "三级菜单", "third-child"), user);

        assertThat(second.level()).isEqualTo(2);
        assertThat(third.level()).isEqualTo(3);
    }

    @Test
    void createRejectsFourthLevelMenu() {
        SiteMenu level1 = menu(21L, null, "一级", "level-one", SiteMenu.MenuType.CUSTOM);
        SiteMenu level2 = menu(22L, level1, "二级", "level-two", SiteMenu.MenuType.CUSTOM);
        SiteMenu level3 = menu(23L, level2, "三级", "level-three", SiteMenu.MenuType.CUSTOM);
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(siteMenuRepository.findByIdAndSiteId(23L, 11L)).thenReturn(Optional.of(level3));

        assertThatThrownBy(() -> siteMenuService.create(11L, request(23L, "四级菜单", "level-four"), user))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Menus can have at most three levels");

        verify(siteMenuRepository, never()).save(any());
    }

    @Test
    void createRejectsDuplicateSlugWithinSite() {
        SiteMenu existing = menu(9L, null, "已有", "duplicate", SiteMenu.MenuType.CUSTOM);
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(siteMenuRepository.findBySiteIdAndSlug(11L, "duplicate")).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> siteMenuService.create(11L, request(null, "重复", "duplicate"), user))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Menu slug is already in use");

        verify(siteMenuRepository, never()).save(any());
    }

    @Test
    void updateProtectsHomeMenuParentAndSlug() {
        SiteMenu home = menu(1L, null, "首页", "home", SiteMenu.MenuType.HOME);
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(siteMenuRepository.findByIdAndSiteId(1L, 11L)).thenReturn(Optional.of(home));
        when(siteMenuRepository.findBySiteIdAndSlug(11L, "home")).thenReturn(Optional.of(home));

        assertThatThrownBy(() -> siteMenuService.update(11L, 1L, request(2L, "首页", "home"), user))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Home menu cannot have a parent");

        assertThatThrownBy(() -> siteMenuService.update(11L, 1L, request(null, "首页", "start"), user))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Home menu slug cannot be changed");
    }

    @Test
    void updateRejectsSelfParent() {
        SiteMenu menu = menu(21L, null, "产品服务", "services", SiteMenu.MenuType.CUSTOM);
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(siteMenuRepository.findByIdAndSiteId(21L, 11L)).thenReturn(Optional.of(menu));
        when(siteMenuRepository.findBySiteIdAndSlug(11L, "services")).thenReturn(Optional.of(menu));

        assertThatThrownBy(() -> siteMenuService.update(11L, 21L, request(21L, "产品服务", "services"), user))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Menu cannot be its own parent");
    }

    @Test
    void updateRejectsDescendantParent() {
        SiteMenu parent = menu(21L, null, "一级", "level-one", SiteMenu.MenuType.CUSTOM);
        SiteMenu child = menu(22L, parent, "二级", "level-two", SiteMenu.MenuType.CUSTOM);
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(siteMenuRepository.findByIdAndSiteId(21L, 11L)).thenReturn(Optional.of(parent));
        when(siteMenuRepository.findByIdAndSiteId(22L, 11L)).thenReturn(Optional.of(child));
        when(siteMenuRepository.findBySiteIdAndSlug(11L, "level-one")).thenReturn(Optional.of(parent));

        assertThatThrownBy(() -> siteMenuService.update(11L, 21L, request(22L, "一级", "level-one"), user))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Menu cannot be moved under its descendant");

        verify(siteMenuRepository, never()).save(any());
    }

    @Test
    void updateRejectsMoveThatWouldMakeDescendantsExceedThreeLevels() {
        SiteMenu newParent = menu(10L, null, "新父级", "new-parent", SiteMenu.MenuType.CUSTOM);
        SiteMenu menu = menu(21L, null, "一级", "level-one", SiteMenu.MenuType.CUSTOM);
        SiteMenu child = menu(22L, menu, "二级", "level-two", SiteMenu.MenuType.CUSTOM);
        SiteMenu grandchild = menu(23L, child, "三级", "level-three", SiteMenu.MenuType.CUSTOM);
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(siteMenuRepository.findByIdAndSiteId(21L, 11L)).thenReturn(Optional.of(menu));
        when(siteMenuRepository.findByIdAndSiteId(10L, 11L)).thenReturn(Optional.of(newParent));
        when(siteMenuRepository.findBySiteIdAndSlug(11L, "level-one")).thenReturn(Optional.of(menu));
        when(siteMenuRepository.findBySiteIdOrderBySortOrderAscCreatedAtAsc(11L))
                .thenReturn(List.of(newParent, menu, child, grandchild));

        assertThatThrownBy(() -> siteMenuService.update(11L, 21L, request(10L, "一级", "level-one"), user))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Menus can have at most three levels");

        verify(siteMenuRepository, never()).save(any());
    }

    @Test
    void deleteRejectsHomeMenuAndMenusWithChildren() {
        SiteMenu home = menu(1L, null, "首页", "home", SiteMenu.MenuType.HOME);
        SiteMenu parent = menu(21L, null, "一级", "level-one", SiteMenu.MenuType.CUSTOM);
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(siteMenuRepository.findByIdAndSiteId(1L, 11L)).thenReturn(Optional.of(home));
        when(siteMenuRepository.findByIdAndSiteId(21L, 11L)).thenReturn(Optional.of(parent));
        when(siteMenuRepository.existsByParentId(21L)).thenReturn(true);

        assertThatThrownBy(() -> siteMenuService.delete(11L, 1L, user))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Home menu cannot be deleted");

        assertThatThrownBy(() -> siteMenuService.delete(11L, 21L, user))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Delete child menus before deleting this menu");

        verify(siteMenuRepository, never()).delete(any());
    }

    @Test
    void deleteRemovesCustomLeafMenu() {
        SiteMenu leaf = menu(31L, null, "合作机会", "cooperation", SiteMenu.MenuType.CUSTOM);
        when(siteService.requireReadableSite(11L, user)).thenReturn(site);
        when(siteMenuRepository.findByIdAndSiteId(31L, 11L)).thenReturn(Optional.of(leaf));
        when(siteMenuRepository.existsByParentId(31L)).thenReturn(false);

        siteMenuService.delete(11L, 31L, user);

        verify(siteMenuRepository).delete(leaf);
    }

    private UpsertSiteMenuRequest request(Long parentId, String label, String slug) {
        return new UpsertSiteMenuRequest(parentId, label, slug, null, null);
    }

    private SiteMenu menu(Long id, SiteMenu parent, String label, String slug, SiteMenu.MenuType menuType) {
        return SiteMenu.builder()
                .id(id)
                .site(site)
                .parent(parent)
                .label(label)
                .slug(slug)
                .menuType(menuType)
                .sortOrder(0)
                .visible(true)
                .build();
    }
}
