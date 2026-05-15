package com.blog.dto.menu;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SortMenuRequest {

    @NotEmpty
    @Valid
    private List<SortItem> items;

    @Data
    public static class SortItem {

        @NotNull
        private Long id;

        private Long parentId;

        @NotNull
        private Integer sortOrder;
    }
}
