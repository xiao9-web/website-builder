package com.xiao9.wb.auth.controller;

import com.xiao9.wb.auth.dto.LoginRequest;
import com.xiao9.wb.auth.dto.RegisterRequest;
import com.xiao9.wb.auth.dto.TokenResponse;
import com.xiao9.wb.auth.service.AuthService;
import com.xiao9.wb.common.annotation.RateLimit;
import com.xiao9.wb.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @RateLimit(maxRequests = 5, window = 1, timeUnit = TimeUnit.HOURS)
    public ApiResponse<TokenResponse> register(@Valid @RequestBody RegisterRequest request) {
        TokenResponse token = authService.register(request);
        return ApiResponse.success(token);
    }

    @PostMapping("/login")
    @RateLimit(maxRequests = 10, window = 1, timeUnit = TimeUnit.MINUTES)
    public ApiResponse<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse token = authService.login(request);
        return ApiResponse.success(token);
    }

    @PostMapping("/refresh")
    public ApiResponse<TokenResponse> refresh(@RequestHeader("X-Refresh-Token") String refreshToken) {
        TokenResponse token = authService.refresh(refreshToken);
        return ApiResponse.success(token);
    }
}
