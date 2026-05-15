package com.xiao9.wb.menu.dto;

import com.xiao9.wb.menu.entity.SiteMenu;

import java.time.LocalDateTime;

public record SiteMenuDTO(
        Long id,
        Long siteId,
        Long parentId,
        String label,
        String slug,
        String menuType,
        Integer level,
        Integer sortOrder,
        Boolean visible,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static SiteMenuDTO from(SiteMenu menu) {
        return new SiteMenuDTO(
                menu.getId(),
                menu.getSite().getId(),
                menu.getParent() != null ? menu.getParent().getId() : null,
                menu.getLabel(),
                menu.getSlug(),
                menu.getMenuType().name(),
                calculateLevel(menu),
                menu.getSortOrder(),
                menu.getVisible(),
                menu.getCreatedAt(),
                menu.getUpdatedAt()
        );
    }

    private static int calculateLevel(SiteMenu menu) {
        int level = 1;
        SiteMenu current = menu.getParent();
        while (current != null) {
            level += 1;
            current = current.getParent();
        }
        return level;
    }
}
