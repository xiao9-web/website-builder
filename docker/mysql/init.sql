-- 初始化数据库
CREATE DATABASE IF NOT EXISTS website_builder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE website_builder;

-- 设置时区
SET time_zone = '+08:00';

-- 创建初始管理员账号将由后端服务自动创建
