package com.blog.service;

import com.blog.dto.auth.LoginRequest;
import com.blog.dto.auth.RefreshRequest;
import com.blog.dto.auth.TokenResponse;
import com.blog.entity.AdminUser;
import com.blog.repository.AdminUserRepository;
import com.blog.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final AdminUserRepository adminUserRepository;

    @Transactional
    public TokenResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String username = authentication.getName();
        String accessToken = jwtTokenProvider.generateTokenForUsername(username);
        String refreshToken = jwtTokenProvider.generateRefreshToken(username);

        AdminUser user = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("User not found"));
        user.setRefreshToken(refreshToken);
        adminUserRepository.save(user);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtTokenProvider.getExpirationSeconds())
                .build();
    }

    @Transactional
    public TokenResponse refresh(RefreshRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        AdminUser user = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!refreshToken.equals(user.getRefreshToken())) {
            throw new IllegalArgumentException("Refresh token does not match");
        }

        String newAccessToken = jwtTokenProvider.generateTokenForUsername(username);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(username);

        user.setRefreshToken(newRefreshToken);
        adminUserRepository.save(user);

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .expiresIn(jwtTokenProvider.getExpirationSeconds())
                .build();
    }

    @Transactional
    public void logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        AdminUser user = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setRefreshToken(null);
        adminUserRepository.save(user);
    }
}
