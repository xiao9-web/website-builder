package com.website;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 企业官网管理系统启动类
 */
@SpringBootApplication
@MapperScan("com.website.mapper")
public class WebsiteAdminApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebsiteAdminApplication.class, args);
    }
}
