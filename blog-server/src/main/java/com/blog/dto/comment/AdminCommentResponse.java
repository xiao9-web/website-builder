package com.blog.dto.comment;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminCommentResponse {

    private Long id;
    private String nickname;
    private String email;
    private String content;
    private String status;
    private LocalDateTime createdAt;
    private Long articleId;
    private String articleTitle;
    private String articleSlug;
    private Long parentId;
}
