package com.blog.dto.menu;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateMenuRequest {

    @Size(max = 50)
    private String name;

    @Size(max = 50)
    private String slug;

    @Size(max = 200)
    private String description;

    private Long parentId;
}
