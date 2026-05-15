package com.blog.controller.admin;

import com.blog.dto.comment.AdminCommentResponse;
import com.blog.dto.common.PageResponse;
import com.blog.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/comments")
@RequiredArgsConstructor
public class AdminCommentController {

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<PageResponse<AdminCommentResponse>> listAll(
            Pageable pageable,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(commentService.listAll(pageable, status));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Void> approve(@PathVariable Long id) {
        commentService.approve(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Void> reject(@PathVariable Long id) {
        commentService.reject(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        commentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
