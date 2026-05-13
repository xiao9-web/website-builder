package com.xiao9.wb.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.jwt")
public class JwtConfig {

    private String secret;
    private long accessTokenExpiration = 900000; // 15 minutes in ms
    private long refreshTokenExpiration = 604800000; // 7 days in ms
}
