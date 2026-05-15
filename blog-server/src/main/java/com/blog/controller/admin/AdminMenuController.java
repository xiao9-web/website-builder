package com.blog.controller.admin;

import com.blog.dto.menu.CreateMenuRequest;
import com.blog.dto.menu.MenuTreeResponse;
import com.blog.dto.menu.SortMenuRequest;
import com.blog.dto.menu.UpdateMenuRequest;
import com.blog.entity.Menu;
import com.blog.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/menus")
@RequiredArgsConstructor
public class AdminMenuController {

    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<List<MenuTreeResponse>> getTree() {
        return ResponseEntity.ok(menuService.getTree());
    }

    @PostMapping
    public ResponseEntity<Menu> create(@Valid @RequestBody CreateMenuRequest request) {
        Menu menu = menuService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(menu);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Menu> update(@PathVariable Long id, @Valid @RequestBody UpdateMenuRequest request) {
        Menu menu = menuService.update(id, request);
        return ResponseEntity.ok(menu);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        menuService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/sort")
    public ResponseEntity<Void> sort(@Valid @RequestBody SortMenuRequest request) {
        menuService.sort(request);
        return ResponseEntity.ok().build();
    }
}
