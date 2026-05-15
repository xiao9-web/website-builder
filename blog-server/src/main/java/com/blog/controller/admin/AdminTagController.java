package com.blog.controller.admin;

import com.blog.dto.tag.CreateTagRequest;
import com.blog.dto.tag.TagResponse;
import com.blog.dto.tag.UpdateTagRequest;
import com.blog.entity.Tag;
import com.blog.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/tags")
@RequiredArgsConstructor
public class AdminTagController {

    private final TagService tagService;

    @PostMapping
    public ResponseEntity<Tag> create(@Valid @RequestBody CreateTagRequest request) {
        Tag tag = tagService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(tag);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tag> update(@PathVariable Long id, @Valid @RequestBody UpdateTagRequest request) {
        Tag tag = tagService.update(id, request);
        return ResponseEntity.ok(tag);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tagService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
