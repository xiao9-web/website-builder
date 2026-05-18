package com.xiao9.wb.publicsite.dto;

import com.xiao9.wb.menu.entity.SiteMenu;

public record PublicMenuDTO(
        Long id,
        Long parentId,
        String label,
        String slug,
        String menuType,
        Integer level,
        Integer sortOrder
) {
    public static PublicMenuDTO from(SiteMenu menu) {
        return new PublicMenuDTO(
                menu.getId(),
                menu.getParent() != null ? menu.getParent().getId() : null,
                menu.getLabel(),
                menu.getSlug(),
                menu.getMenuType().name(),
                calculateLevel(menu),
                menu.getSortOrder()
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
