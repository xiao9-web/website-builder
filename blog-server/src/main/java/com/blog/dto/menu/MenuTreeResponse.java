package com.blog.dto.menu;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuTreeResponse {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private Integer sortOrder;
    private Boolean isFixed;

    @Builder.Default
    private List<MenuTreeResponse> children = new ArrayList<>();
}
