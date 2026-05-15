package com.blog.service;

import com.blog.dto.comment.AdminCommentResponse;
import com.blog.dto.comment.CommentResponse;
import com.blog.dto.comment.CreateCommentRequest;
import com.blog.dto.common.PageResponse;
import com.blog.entity.Article;
import com.blog.entity.Comment;
import com.blog.repository.ArticleRepository;
import com.blog.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;

    @Transactional
    public CommentResponse submit(String articleSlug, CreateCommentRequest request) {
        Article article = articleRepository.findBySlug(articleSlug)
                .orElseThrow(() -> new IllegalArgumentException("Article not found: " + articleSlug));

        Comment comment = Comment.builder()
                .article(article)
                .nickname(request.getNickname())
                .email(request.getEmail())
                .content(request.getContent())
                .status("pending")
                .build();

        if (request.getParentId() != null) {
            Comment parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent comment not found: " + request.getParentId()));
            comment.setParent(parent);
        }

        Comment saved = commentRepository.save(comment);
        return toCommentResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getByArticle(String articleSlug) {
        Article article = articleRepository.findBySlug(articleSlug)
                .orElseThrow(() -> new IllegalArgumentException("Article not found: " + articleSlug));

        List<Comment> approvedComments = commentRepository.findByArticleIdAndStatus(article.getId(), "approved");

        // Build nested tree: group by parentId, then assemble top-level with children
        Map<Long, List<Comment>> childrenMap = approvedComments.stream()
                .filter(c -> c.getParent() != null)
                .collect(Collectors.groupingBy(c -> c.getParent().getId()));

        return approvedComments.stream()
                .filter(c -> c.getParent() == null)
                .map(c -> toNestedCommentResponse(c, childrenMap))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<AdminCommentResponse> listAll(Pageable pageable, String status) {
        Page<Comment> page;
        if (status != null && !status.isBlank()) {
            page = commentRepository.findByStatus(status, pageable);
        } else {
            page = commentRepository.findAll(pageable);
        }

        List<AdminCommentResponse> content = page.getContent().stream()
                .map(this::toAdminCommentResponse)
                .collect(Collectors.toList());

        return PageResponse.<AdminCommentResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    @Transactional
    public void approve(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found: " + id));
        comment.setStatus("approved");
        commentRepository.save(comment);
    }

    @Transactional
    public void reject(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found: " + id));
        comment.setStatus("rejected");
        commentRepository.save(comment);
    }

    @Transactional
    public void delete(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new IllegalArgumentException("Comment not found: " + id);
        }
        commentRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public long countPending() {
        return commentRepository.countByStatus("pending");
    }

    private CommentResponse toCommentResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .nickname(comment.getNickname())
                .email(comment.getEmail())
                .content(comment.getContent())
                .status(comment.getStatus())
                .createdAt(comment.getCreatedAt())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .replies(new ArrayList<>())
                .build();
    }

    private CommentResponse toNestedCommentResponse(Comment comment, Map<Long, List<Comment>> childrenMap) {
        List<CommentResponse> replies = childrenMap.getOrDefault(comment.getId(), new ArrayList<>())
                .stream()
                .map(c -> toNestedCommentResponse(c, childrenMap))
                .collect(Collectors.toList());

        return CommentResponse.builder()
                .id(comment.getId())
                .nickname(comment.getNickname())
                .email(comment.getEmail())
                .content(comment.getContent())
                .status(comment.getStatus())
                .createdAt(comment.getCreatedAt())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .replies(replies)
                .build();
    }

    private AdminCommentResponse toAdminCommentResponse(Comment comment) {
        return AdminCommentResponse.builder()
                .id(comment.getId())
                .nickname(comment.getNickname())
                .email(comment.getEmail())
                .content(comment.getContent())
                .status(comment.getStatus())
                .createdAt(comment.getCreatedAt())
                .articleId(comment.getArticle().getId())
                .articleTitle(comment.getArticle().getTitle())
                .articleSlug(comment.getArticle().getSlug())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .build();
    }
}
