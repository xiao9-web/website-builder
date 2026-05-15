package com.xiao9.wb.menu.service;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.common.exception.ErrorCode;
import com.xiao9.wb.menu.dto.SiteMenuDTO;
import com.xiao9.wb.menu.dto.UpsertSiteMenuRequest;
import com.xiao9.wb.menu.entity.SiteMenu;
import com.xiao9.wb.menu.repository.SiteMenuRepository;
import com.xiao9.wb.site.entity.Site;
import com.xiao9.wb.site.service.SiteService;
import com.xiao9.wb.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class SiteMenuService {

    private static final int MAX_MENU_LEVEL = 3;

    private final SiteMenuRepository siteMenuRepository;
    private final SiteService siteService;

    @Transactional(readOnly = true)
    public List<SiteMenuDTO> list(Long siteId, User user) {
        Site site = siteService.requireReadableSite(siteId, user);
        return siteMenuRepository.findBySiteIdOrderBySortOrderAscCreatedAtAsc(site.getId())
                .stream()
                .map(SiteMenuDTO::from)
                .toList();
    }

    @Transactional
    public SiteMenuDTO create(Long siteId, UpsertSiteMenuRequest request, User user) {
        Site site = siteService.requireReadableSite(siteId, user);
        SiteMenu parent = resolveParent(site.getId(), request.parentId());
        validateDepth(parent);
        String slug = normalizeSlug(request.slug());
        validateSlugAvailable(site.getId(), slug, null);

        SiteMenu menu = SiteMenu.builder()
                .site(site)
                .parent(parent)
                .label(request.label().trim())
                .slug(slug)
                .menuType(SiteMenu.MenuType.CUSTOM)
                .sortOrder(request.sortOrder() != null ? request.sortOrder() : 0)
                .visible(request.visible() == null || request.visible())
                .build();

        siteMenuRepository.save(menu);
        log.info("Site menu created: {} for site {} by user {}", menu.getLabel(), siteId, user.getId());
        return SiteMenuDTO.from(menu);
    }

    @Transactional
    public SiteMenuDTO update(Long siteId, Long menuId, UpsertSiteMenuRequest request, User user) {
        siteService.requireReadableSite(siteId, user);
        SiteMenu menu = requireMenu(siteId, menuId);
        String slug = normalizeSlug(request.slug());
        validateSlugAvailable(siteId, slug, menu.getId());

        if (menu.getMenuType() == SiteMenu.MenuType.HOME) {
            if (request.parentId() != null) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "Home menu cannot have a parent");
            }
            if (!"home".equals(slug)) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "Home menu slug cannot be changed");
            }
            menu.setParent(null);
        } else {
            SiteMenu parent = resolveParent(siteId, request.parentId());
            if (parent != null && Objects.equals(parent.getId(), menu.getId())) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "Menu cannot be its own parent");
            }
            validateNotDescendantParent(menu, parent);
            validateDepth(parent);
            validateSubtreeDepthAfterMove(siteId, menu, parent);
            menu.setParent(parent);
        }

        menu.setLabel(request.label().trim());
        menu.setSlug(slug);
        menu.setSortOrder(request.sortOrder() != null ? request.sortOrder() : 0);
        menu.setVisible(request.visible() == null || request.visible());

        siteMenuRepository.save(menu);
        return SiteMenuDTO.from(menu);
    }

    @Transactional
    public void delete(Long siteId, Long menuId, User user) {
        siteService.requireReadableSite(siteId, user);
        SiteMenu menu = requireMenu(siteId, menuId);
        if (menu.getMenuType() == SiteMenu.MenuType.HOME) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Home menu cannot be deleted");
        }
        if (siteMenuRepository.existsByParentId(menu.getId())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Delete child menus before deleting this menu");
        }
        siteMenuRepository.delete(menu);
        log.info("Site menu deleted: {} for site {} by user {}", menuId, siteId, user.getId());
    }

    public SiteMenu requireReadableMenu(Long siteId, Long menuId, User user) {
        siteService.requireReadableSite(siteId, user);
        return requireMenu(siteId, menuId);
    }

    private SiteMenu requireMenu(Long siteId, Long menuId) {
        return siteMenuRepository.findByIdAndSiteId(menuId, siteId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Site menu not found"));
    }

    private SiteMenu resolveParent(Long siteId, Long parentId) {
        if (parentId == null) {
            return null;
        }
        return requireMenu(siteId, parentId);
    }

    private void validateDepth(SiteMenu parent) {
        if (parent == null) {
            return;
        }
        if (calculateLevel(parent) >= MAX_MENU_LEVEL) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Menus can have at most three levels");
        }
    }

    private void validateNotDescendantParent(SiteMenu menu, SiteMenu parent) {
        SiteMenu current = parent;
        while (current != null) {
            if (Objects.equals(current.getId(), menu.getId())) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "Menu cannot be moved under its descendant");
            }
            current = current.getParent();
        }
    }

    private void validateSubtreeDepthAfterMove(Long siteId, SiteMenu menu, SiteMenu parent) {
        int targetLevel = parent == null ? 1 : calculateLevel(parent) + 1;
        int subtreeHeight = calculateSubtreeHeight(siteId, menu);
        if (targetLevel + subtreeHeight - 1 > MAX_MENU_LEVEL) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Menus can have at most three levels");
        }
    }

    private int calculateSubtreeHeight(Long siteId, SiteMenu root) {
        List<SiteMenu> menus = siteMenuRepository.findBySiteIdOrderBySortOrderAscCreatedAtAsc(siteId);
        return calculateSubtreeHeight(root, menus);
    }

    private int calculateSubtreeHeight(SiteMenu root, List<SiteMenu> menus) {
        int maxChildHeight = menus.stream()
                .filter(menu -> menu.getParent() != null && Objects.equals(menu.getParent().getId(), root.getId()))
                .mapToInt(child -> calculateSubtreeHeight(child, menus))
                .max()
                .orElse(0);
        return maxChildHeight + 1;
    }

    private int calculateLevel(SiteMenu menu) {
        int level = 1;
        SiteMenu current = menu.getParent();
        while (current != null) {
            level += 1;
            current = current.getParent();
        }
        return level;
    }

    private void validateSlugAvailable(Long siteId, String slug, Long currentMenuId) {
        siteMenuRepository.findBySiteIdAndSlug(siteId, slug)
                .filter(menu -> !Objects.equals(menu.getId(), currentMenuId))
                .ifPresent(menu -> {
                    throw new BusinessException(ErrorCode.BAD_REQUEST, "Menu slug is already in use");
                });
    }

    private String normalizeSlug(String slug) {
        if (slug == null || slug.isBlank()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Menu slug is required");
        }
        String normalized = slug.trim().toLowerCase();
        if (!normalized.matches("^[a-z0-9][a-z0-9-]{1,118}[a-z0-9]$")) {
            throw new BusinessException(
                    ErrorCode.BAD_REQUEST,
                    "Menu slug can only contain lowercase letters, numbers, and hyphens, and must be 3 to 120 characters"
            );
        }
        return normalized;
    }
}
