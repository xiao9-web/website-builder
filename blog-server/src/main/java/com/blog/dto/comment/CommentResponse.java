package com.blog.dto.comment;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CommentResponse {

    private Long id;
    private String nickname;
    private String email;
    private String content;
    private String status;
    private LocalDateTime createdAt;
    private Long parentId;
    private List<CommentResponse> replies;
}
