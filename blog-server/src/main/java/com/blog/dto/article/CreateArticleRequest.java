package com.blog.dto.article;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CreateArticleRequest {

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Size(max = 200)
    private String slug;

    private String content;

    @Size(max = 500)
    private String excerpt;

    private String coverImage;

    @NotNull
    private Long menuId;

    private List<Long> tagIds;
}
