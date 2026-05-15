package com.blog.dto.article;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class UpdateArticleRequest {

    @Size(max = 200)
    private String title;

    @Size(max = 200)
    private String slug;

    private String content;

    @Size(max = 500)
    private String excerpt;

    private String coverImage;

    private Long menuId;

    private List<Long> tagIds;
}
