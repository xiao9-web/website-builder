package com.blog.controller.api;

import com.blog.dto.tag.TagResponse;
import com.blog.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class PublicTagController {

    private final TagService tagService;

    @GetMapping
    public ResponseEntity<List<TagResponse>> list() {
        return ResponseEntity.ok(tagService.list());
    }
}
