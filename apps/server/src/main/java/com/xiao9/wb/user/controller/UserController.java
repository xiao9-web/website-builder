package com.xiao9.wb.user.controller;

import com.xiao9.wb.common.response.ApiResponse;
import com.xiao9.wb.user.dto.UserDTO;
import com.xiao9.wb.user.entity.User;
import com.xiao9.wb.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<UserDTO> getCurrentUser(@AuthenticationPrincipal User user) {
        UserDTO dto = userService.getUserById(user.getId());
        return ApiResponse.success(dto);
    }

    @GetMapping("/{id}")
    public ApiResponse<UserDTO> getById(@PathVariable Long id) {
        UserDTO dto = userService.getUserById(id);
        return ApiResponse.success(dto);
    }

    @PutMapping("/me")
    public ApiResponse<UserDTO> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String avatar
    ) {
        UserDTO dto = userService.updateProfile(user.getId(), name, avatar);
        return ApiResponse.success(dto);
    }
}
