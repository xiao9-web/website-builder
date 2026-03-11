-- 创建数据库
CREATE DATABASE IF NOT EXISTS website DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE website;

-- 管理员用户表
CREATE TABLE `sys_user` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `username` varchar(32) NOT NULL COMMENT '用户名',
  `password` varchar(64) NOT NULL COMMENT '密码',
  `nickname` varchar(32) DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `email` varchar(64) DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(11) DEFAULT NULL COMMENT '手机号',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-正常',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(32) DEFAULT NULL COMMENT '最后登录IP',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员用户表';

-- 角色表
CREATE TABLE `sys_role` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `role_name` varchar(32) NOT NULL COMMENT '角色名称',
  `role_code` varchar(32) NOT NULL COMMENT '角色编码',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-正常',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- 菜单表
CREATE TABLE `sys_menu` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `parent_id` bigint NOT NULL DEFAULT '0' COMMENT '父菜单ID',
  `menu_name` varchar(32) NOT NULL COMMENT '菜单名称',
  `menu_type` tinyint NOT NULL COMMENT '菜单类型：0-目录，1-菜单，2-按钮',
  `path` varchar(128) DEFAULT NULL COMMENT '路由路径',
  `component` varchar(128) DEFAULT NULL COMMENT '组件路径',
  `perms` varchar(128) DEFAULT NULL COMMENT '权限标识',
  `icon` varchar(32) DEFAULT NULL COMMENT '菜单图标',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-正常',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单表';

-- 角色菜单关联表
CREATE TABLE `sys_role_menu` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `menu_id` bigint NOT NULL COMMENT '菜单ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_menu` (`role_id`,`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色菜单关联表';

-- 栏目分类表
CREATE TABLE `cms_category` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `parent_id` bigint NOT NULL DEFAULT '0' COMMENT '父分类ID',
  `category_name` varchar(64) NOT NULL COMMENT '分类名称',
  `category_code` varchar(32) NOT NULL COMMENT '分类编码',
  `category_type` tinyint NOT NULL COMMENT '分类类型：1-文章分类，2-产品分类',
  `description` varchar(255) DEFAULT NULL COMMENT '分类描述',
  `cover_image` varchar(255) DEFAULT NULL COMMENT '封面图片',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-正常',
  `seo_title` varchar(128) DEFAULT NULL COMMENT 'SEO标题',
  `seo_keywords` varchar(255) DEFAULT NULL COMMENT 'SEO关键词',
  `seo_description` varchar(255) DEFAULT NULL COMMENT 'SEO描述',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_category_code` (`category_code`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='栏目分类表';

-- 文章表
CREATE TABLE `cms_article` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `title` varchar(255) NOT NULL COMMENT '文章标题',
  `sub_title` varchar(255) DEFAULT NULL COMMENT '副标题',
  `category_id` bigint NOT NULL COMMENT '分类ID',
  `cover_image` varchar(255) DEFAULT NULL COMMENT '封面图片',
  `summary` varchar(500) DEFAULT NULL COMMENT '文章摘要',
  `content` longtext NOT NULL COMMENT '文章内容',
  `author` varchar(32) DEFAULT NULL COMMENT '作者',
  `source` varchar(64) DEFAULT NULL COMMENT '来源',
  `tags` varchar(255) DEFAULT NULL COMMENT '标签，多个用逗号分隔',
  `click_count` int NOT NULL DEFAULT '0' COMMENT '点击量',
  `is_top` tinyint NOT NULL DEFAULT '0' COMMENT '是否置顶：0-否，1-是',
  `is_recommend` tinyint NOT NULL DEFAULT '0' COMMENT '是否推荐：0-否，1-是',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '状态：0-草稿，1-已发布，2-已下架',
  `publish_time` datetime DEFAULT NULL COMMENT '发布时间',
  `seo_title` varchar(128) DEFAULT NULL COMMENT 'SEO标题',
  `seo_keywords` varchar(255) DEFAULT NULL COMMENT 'SEO关键词',
  `seo_description` varchar(255) DEFAULT NULL COMMENT 'SEO描述',
  `create_by` bigint NOT NULL COMMENT '创建人',
  `update_by` bigint NOT NULL COMMENT '更新人',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_status` (`status`),
  KEY `idx_publish_time` (`publish_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- 产品表
CREATE TABLE `cms_product` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `product_name` varchar(128) NOT NULL COMMENT '产品名称',
  `product_code` varchar(32) NOT NULL COMMENT '产品编码',
  `category_id` bigint NOT NULL COMMENT '分类ID',
  `cover_image` varchar(255) DEFAULT NULL COMMENT '封面图片',
  `banner_images` varchar(1000) DEFAULT NULL COMMENT '轮播图片，多个用逗号分隔',
  `summary` varchar(500) DEFAULT NULL COMMENT '产品摘要',
  `description` longtext NOT NULL COMMENT '产品描述',
  `price` decimal(10,2) DEFAULT NULL COMMENT '产品价格',
  `specifications` varchar(500) DEFAULT NULL COMMENT '规格参数，JSON格式',
  `tags` varchar(255) DEFAULT NULL COMMENT '标签，多个用逗号分隔',
  `click_count` int NOT NULL DEFAULT '0' COMMENT '点击量',
  `is_top` tinyint NOT NULL DEFAULT '0' COMMENT '是否置顶：0-否，1-是',
  `is_recommend` tinyint NOT NULL DEFAULT '0' COMMENT '是否推荐：0-否，1-是',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '状态：0-下架，1-上架',
  `seo_title` varchar(128) DEFAULT NULL COMMENT 'SEO标题',
  `seo_keywords` varchar(255) DEFAULT NULL COMMENT 'SEO关键词',
  `seo_description` varchar(255) DEFAULT NULL COMMENT 'SEO描述',
  `create_by` bigint NOT NULL COMMENT '创建人',
  `update_by` bigint NOT NULL COMMENT '更新人',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_product_code` (`product_code`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品表';

-- 轮播图表
CREATE TABLE `cms_banner` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `title` varchar(128) DEFAULT NULL COMMENT '标题',
  `image` varchar(255) NOT NULL COMMENT '图片地址',
  `link_url` varchar(255) DEFAULT NULL COMMENT '跳转链接',
  `target` varchar(16) NOT NULL DEFAULT '_blank' COMMENT '打开方式：_self/_blank',
  `position` varchar(32) NOT NULL DEFAULT 'home' COMMENT '位置：home-首页，product-产品页等',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-正常',
  `start_time` datetime DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_position` (`position`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='轮播图表';

-- 留言表
CREATE TABLE `cms_message` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `name` varchar(32) NOT NULL COMMENT '留言人姓名',
  `phone` varchar(11) NOT NULL COMMENT '联系电话',
  `email` varchar(64) DEFAULT NULL COMMENT '邮箱',
  `company` varchar(128) DEFAULT NULL COMMENT '公司名称',
  `content` text NOT NULL COMMENT '留言内容',
  `reply_content` text DEFAULT NULL COMMENT '回复内容',
  `reply_time` datetime DEFAULT NULL COMMENT '回复时间',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '状态：0-未回复，1-已回复，2-已处理',
  `ip` varchar(32) DEFAULT NULL COMMENT '留言IP',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='留言表';

-- 敏感词表
CREATE TABLE `cms_sensitive_word` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `word` varchar(64) NOT NULL COMMENT '敏感词',
  `type` tinyint NOT NULL DEFAULT '1' COMMENT '类型：1-普通，2-违禁',
  `replace_word` varchar(64) NOT NULL DEFAULT '***' COMMENT '替换词',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_word` (`word`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='敏感词表';

-- 系统配置表
CREATE TABLE `sys_config` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `config_key` varchar(64) NOT NULL COMMENT '配置键',
  `config_value` text NOT NULL COMMENT '配置值',
  `config_name` varchar(64) NOT NULL COMMENT '配置名称',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- 操作日志表
CREATE TABLE `sys_log` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `username` varchar(32) NOT NULL COMMENT '操作用户',
  `operation` varchar(64) NOT NULL COMMENT '操作描述',
  `method` varchar(128) NOT NULL COMMENT '方法名',
  `params` text DEFAULT NULL COMMENT '请求参数',
  `ip` varchar(32) DEFAULT NULL COMMENT '操作IP',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '操作状态：0-失败，1-成功',
  `error_msg` text DEFAULT NULL COMMENT '错误信息',
  `duration` bigint NOT NULL COMMENT '耗时，单位毫秒',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_username` (`username`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

-- 插入初始数据
-- 角色
INSERT INTO `sys_role` (`id`, `role_name`, `role_code`, `description`) VALUES
(1, '超级管理员', 'admin', '系统超级管理员，拥有所有权限');

-- 管理员用户（密码123456，MD5加密：e10adc3949ba59abbe56e057f20f883e）
INSERT INTO `sys_user` (`id`, `username`, `password`, `nickname`, `role_id`) VALUES
(1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', '超级管理员', 1);

-- 系统配置
INSERT INTO `sys_config` (`config_key`, `config_value`, `config_name`, `description`) VALUES
('website_name', '企业官网', '网站名称', '网站的名称'),
('website_logo', '/images/logo.png', '网站Logo', '网站Logo地址'),
('website_domain', 'www.yourdomain.com', '网站域名', '网站访问域名'),
('website_icp', '浙ICP备12345678号', 'ICP备案号', '网站ICP备案号'),
('website_copyright', 'Copyright © 2024 公司名称 All Rights Reserved', '版权信息', '网站底部版权信息'),
('contact_phone', '400-123-4567', '联系电话', '公司联系电话'),
('contact_email', 'contact@yourdomain.com', '联系邮箱', '公司联系邮箱'),
('contact_address', '浙江省杭州市XX区XX路XX号', '联系地址', '公司联系地址'),
('contact_wechat', 'your_wechat', '微信公众号', '微信公众号');

-- 敏感词示例
INSERT INTO `cms_sensitive_word` (`word`, `type`, `replace_word`) VALUES
('违禁词1', 2, '***'),
('违禁词2', 2, '***');
