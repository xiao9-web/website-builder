package com.blog.controller.api;

import com.blog.dto.comment.CommentResponse;
import com.blog.dto.comment.CreateCommentRequest;
import com.blog.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles/{slug}/comments")
@RequiredArgsConstructor
public class PublicCommentController {

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getByArticle(@PathVariable String slug) {
        return ResponseEntity.ok(commentService.getByArticle(slug));
    }

    @PostMapping
    public ResponseEntity<CommentResponse> submit(
            @PathVariable String slug,
            @Valid @RequestBody CreateCommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.submit(slug, request));
    }
}
