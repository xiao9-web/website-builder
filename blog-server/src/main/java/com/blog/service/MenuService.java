package com.blog.service;

import com.blog.dto.menu.CreateMenuRequest;
import com.blog.dto.menu.MenuTreeResponse;
import com.blog.dto.menu.SortMenuRequest;
import com.blog.dto.menu.UpdateMenuRequest;
import com.blog.entity.Menu;
import com.blog.exception.ResourceNotFoundException;
import com.blog.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;

    @Transactional
    public Menu create(CreateMenuRequest request) {
        // Validate max depth
        int depth = 1;
        Menu parent = null;
        if (request.getParentId() != null) {
            parent = menuRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent menu not found"));
            depth = calculateDepth(parent) + 1;
            if (depth > 3) {
                throw new IllegalStateException("Menu nesting cannot exceed 3 levels");
            }
        } else {
            // Validate max 6 custom top-level menus
            long topLevelCount = menuRepository.countByParentIsNullAndIsFixedFalse();
            if (topLevelCount >= 6) {
                throw new IllegalStateException("Cannot create more than 6 custom top-level menus");
            }
        }

        Menu menu = Menu.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .description(request.getDescription())
                .parent(parent)
                .isFixed(false)
                .build();

        return menuRepository.save(menu);
    }

    @Transactional
    public Menu update(Long id, UpdateMenuRequest request) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found"));

        if (request.getSlug() != null && menu.getIsFixed()) {
            throw new IllegalStateException("Cannot change slug of a fixed menu");
        }

        if (request.getName() != null) {
            menu.setName(request.getName());
        }
        if (request.getSlug() != null) {
            menu.setSlug(request.getSlug());
        }
        if (request.getDescription() != null) {
            menu.setDescription(request.getDescription());
        }
        if (request.getParentId() != null) {
            Menu parent = menuRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent menu not found"));
            int depth = calculateDepth(parent) + 1;
            if (depth > 3) {
                throw new IllegalStateException("Menu nesting cannot exceed 3 levels");
            }
            menu.setParent(parent);
        }

        return menuRepository.save(menu);
    }

    @Transactional
    public void delete(Long id) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found"));

        if (menu.getIsFixed()) {
            throw new IllegalStateException("Cannot delete a fixed menu");
        }

        long articleCount = menuRepository.countArticlesByMenuId(id);
        if (articleCount > 0) {
            throw new IllegalStateException("Cannot delete menu that has articles");
        }

        menuRepository.delete(menu);
    }

    @Transactional(readOnly = true)
    public List<MenuTreeResponse> getTree() {
        List<Menu> roots = menuRepository.findByParentIsNullOrderBySortOrder();
        return roots.stream()
                .map(this::toTreeResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Menu getById(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found"));
    }

    @Transactional
    public void sort(SortMenuRequest request) {
        for (SortMenuRequest.SortItem item : request.getItems()) {
            Menu menu = menuRepository.findById(item.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu not found: " + item.getId()));

            menu.setSortOrder(item.getSortOrder());

            if (item.getParentId() != null) {
                Menu parent = menuRepository.findById(item.getParentId())
                        .orElseThrow(() -> new ResourceNotFoundException("Parent menu not found: " + item.getParentId()));
                menu.setParent(parent);
            } else {
                menu.setParent(null);
            }

            menuRepository.save(menu);
        }
    }

    private int calculateDepth(Menu menu) {
        int depth = 1;
        Menu current = menu;
        while (current.getParent() != null) {
            depth++;
            current = current.getParent();
        }
        return depth;
    }

    private MenuTreeResponse toTreeResponse(Menu menu) {
        return MenuTreeResponse.builder()
                .id(menu.getId())
                .name(menu.getName())
                .slug(menu.getSlug())
                .description(menu.getDescription())
                .sortOrder(menu.getSortOrder())
                .isFixed(menu.getIsFixed())
                .children(menu.getChildren().stream()
                        .map(this::toTreeResponse)
                        .collect(Collectors.toList()))
                .build();
    }
}
