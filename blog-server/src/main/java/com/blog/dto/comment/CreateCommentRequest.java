package com.blog.dto.comment;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateCommentRequest {

    @NotBlank
    @Size(max = 50)
    private String nickname;

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

    @NotBlank
    private String content;

    private Long parentId;
}
