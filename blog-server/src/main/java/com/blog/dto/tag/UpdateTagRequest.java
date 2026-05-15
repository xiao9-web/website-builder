package com.blog.dto.tag;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateTagRequest {

    @Size(max = 50)
    private String name;

    @Size(max = 50)
    private String slug;
}
