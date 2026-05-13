package com.xiao9.wb.user.dto;

import com.xiao9.wb.user.entity.User;

import java.time.LocalDateTime;

public record UserDTO(
        Long id,
        String name,
        String email,
        String avatar,
        String role,
        LocalDateTime createdAt
) {
    public static UserDTO from(User user) {
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAvatar(),
                user.getRole().name(),
                user.getCreatedAt()
        );
    }
}
