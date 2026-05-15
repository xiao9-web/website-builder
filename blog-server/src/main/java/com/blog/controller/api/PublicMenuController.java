package com.blog.controller.api;

import com.blog.dto.menu.MenuTreeResponse;
import com.blog.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
public class PublicMenuController {

    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<List<MenuTreeResponse>> getTree() {
        return ResponseEntity.ok(menuService.getTree());
    }
}
