# 个人博客 — 需求规格说明书

## 1. 产品定位

| 项目 | 说明 |
|------|------|
| 类型 | 个人技术博客 |
| 用户 | 单人管理员（博主），匿名访客 |
| 目标 | 真实上线使用，非面试展示项目 |
| 风格参考 | 设计感强，类似 Tailwind Blog |
| 优先级 | 先完成博客，再做企业官网 |

## 2. 技术栈

| 层 | 选型 |
|----|------|
| 前端框架 | Next.js 14 (App Router) |
| UI | Tailwind CSS + shadcn/ui |
| 后端 | Spring Boot 3 + Java 17 |
| 数据库 | PostgreSQL 16 (tsvector 中文全文搜索) |
| 缓存 | Redis 7 (仅 token 管理 + 构建锁) |
| 部署 | Docker Compose + Nginx (自有服务器) |
| 认证 | JWT (access + refresh token) |
| Markdown | unified (remark + rehype) |
| 代码高亮 | Shiki (构建时) |
| 编辑器 | WYSIWYG 富文本编辑器 (存储为 Markdown) |

## 3. 发布流程

```
写文章 → 保存草稿 → 点击发布 → 触发 Next.js SSG 构建 → 输出静态 HTML → 部署到 Nginx
```

- 构建期间 Redis 加锁，防止并发构建
- 构建失败自动回滚到上一版本
- 访客访问的是纯静态 HTML，无服务端渲染开销

## 4. 前台页面

### 4.1 全局布局

| 区域 | 内容 |
|------|------|
| 顶部导航栏 | Logo/博客名 + 多级菜单 + 搜索图标 + 主题切换 + 社交链接 |
| 移动端菜单 | 侧边抽屉（右侧滑出） |
| Footer | 简洁风格（版权信息 + 社交链接） |

### 4.2 导航菜单

- 固定 1 个"首页"菜单（不可删除）
- 最多 6 个自定义顶级菜单（后台可增删改）
- 每个菜单最多 3 级嵌套
- Hover 展开子菜单
- 文章必须关联到叶子节点（最末级菜单），一个叶子菜单下可有多篇文章
- "关于"页面通过创建一个"关于"菜单 + 一篇文章实现
- 后台可视化拖拽管理菜单顺序和层级
- 菜单即分类，不再有独立的"分类"概念

### 4.3 首页

- Hero 区域：头像 + 简介文字 + 装饰性背景
- 文章列表：按发布时间倒序
- 列表项信息：标题 + 发布日期 + 分类 + 标签
- 分页：传统分页（页码导航）

### 4.4 文章列表页

- 简洁列表风格（类似 Dan Abramov 博客）
- 列表项：标题 + 发布日期 + 分类 + 标签
- 传统分页

### 4.5 文章详情页

- 顶部封面图（可选）
- 文章标题 + 元信息（日期、分类、标签）
- 正文内容（Markdown 渲染）
- 右侧 TOC 目录导航（仅详情页有）
- 上一篇 / 下一篇导航
- 相关文章推荐
- 评论区

### 4.6 菜单页

- 菜单名 + 该菜单下的文章列表
- 列表样式与文章列表页一致
- 仅叶子菜单有文章列表，非叶子菜单展示子菜单导航

### 4.7 归档页

- 按年分组的时间线展示
- 显示所有已发布文章

### 4.8 搜索

- 点击搜索图标弹出弹窗
- 实时搜索（输入即搜索）
- 基于 PostgreSQL tsvector 中文全文搜索

### 4.9 评论系统

- 自建评论（非第三方）
- 嵌套式评论（支持回复）
- 审核后显示（approve-before-display）
- 访客无需登录即可评论（填写昵称 + 邮箱）

### 4.10 主题

- 支持亮色 / 暗色切换
- 主题色可配置，默认蓝色

## 5. 后台管理

### 5.1 布局

- 管理员自行设计（不限定具体布局）
- 需要登录后才能访问

### 5.2 仪表盘

- 文章总数、评论总数、访问量等基础统计
- 最近发布的文章
- 待审核评论提醒

### 5.3 文章管理

- 文章列表（搜索、筛选、排序）
- WYSIWYG 富文本编辑器
- 编辑器存储格式为 Markdown
- 支持草稿 / 已发布状态
- 支持设置封面图、所属菜单（必选叶子菜单）、标签
- 发布时触发 SSG 构建

### 5.4 菜单管理

- 固定"首页"菜单不可删除
- 最多 6 个自定义顶级菜单
- 树形结构（最多 3 级嵌套）
- 可视化拖拽排序和层级调整
- CRUD 操作

### 5.5 标签管理

- 扁平结构
- CRUD 操作

### 5.6 评论管理

- 评论列表
- 审核通过 / 拒绝 / 删除
- 回复评论

### 5.7 媒体库

- 图片上传和管理
- 在编辑器中插入图片

### 5.8 站点设置

- 博客名称、描述、Logo
- 社交链接配置
- 主题色配置
- Hero 区域内容配置

### 5.9 构建管理

- 手动触发构建
- 构建历史和状态查看
- 构建失败日志

## 6. 数据模型

### articles（文章）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | 主键 |
| title | varchar(200) | 标题 |
| slug | varchar(200) UNIQUE | URL 友好标识 |
| content | text | Markdown 内容 |
| excerpt | varchar(500) | 摘要 |
| cover_image | varchar(500) | 封面图 URL |
| status | enum | draft / published |
| menu_id | bigint FK | 所属菜单（叶子节点） |
| published_at | timestamp | 发布时间 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |
| search_vector | tsvector | 全文搜索向量 |

### menus（菜单）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | 主键 |
| name | varchar(50) | 菜单名 |
| slug | varchar(50) UNIQUE | URL 标识 |
| description | varchar(200) | 描述 |
| parent_id | bigint FK (self) | 父菜单 |
| sort_order | int | 排序 |
| is_fixed | boolean | 是否固定菜单（首页） |

### tags（标签）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | 主键 |
| name | varchar(50) | 标签名 |
| slug | varchar(50) UNIQUE | URL 标识 |

### article_tags（文章-标签关联）

| 字段 | 类型 | 说明 |
|------|------|------|
| article_id | bigint FK | 文章 ID |
| tag_id | bigint FK | 标签 ID |

### comments（评论）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | 主键 |
| article_id | bigint FK | 所属文章 |
| parent_id | bigint FK (self) | 父评论（嵌套回复） |
| nickname | varchar(50) | 昵称 |
| email | varchar(100) | 邮箱 |
| content | text | 评论内容 |
| status | enum | pending / approved / rejected |
| created_at | timestamp | 创建时间 |

### media（媒体）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | 主键 |
| filename | varchar(200) | 文件名 |
| url | varchar(500) | 访问 URL |
| mime_type | varchar(50) | MIME 类型 |
| size | bigint | 文件大小 (bytes) |
| created_at | timestamp | 上传时间 |

### site_settings（站点设置）

| 字段 | 类型 | 说明 |
|------|------|------|
| key | varchar(50) PK | 配置键 |
| value | text | 配置值 (JSON) |

### admin_user（管理员）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | 主键 |
| username | varchar(50) | 用户名 |
| password_hash | varchar(200) | 密码哈希 |
| refresh_token | varchar(500) | 当前 refresh token |

## 7. API 概览

### 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/login | 登录 |
| POST | /api/auth/refresh | 刷新 token |
| POST | /api/auth/logout | 登出 |

### 文章（公开）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/articles | 文章列表（分页） |
| GET | /api/articles/{slug} | 文章详情 |
| GET | /api/articles/archive | 归档列表 |
| GET | /api/articles/search?q= | 搜索 |

### 文章（管理）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/articles | 管理列表 |
| POST | /api/admin/articles | 创建文章 |
| PUT | /api/admin/articles/{id} | 更新文章 |
| DELETE | /api/admin/articles/{id} | 删除文章 |
| POST | /api/admin/articles/{id}/publish | 发布并触发构建 |

### 菜单

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/menus | 菜单树（公开） |
| GET | /api/admin/menus | 菜单管理列表 |
| POST | /api/admin/menus | 创建菜单 |
| PUT | /api/admin/menus/{id} | 更新菜单 |
| DELETE | /api/admin/menus/{id} | 删除菜单 |
| PUT | /api/admin/menus/sort | 批量排序 |

### 标签

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/tags | 标签列表 |
| POST | /api/admin/tags | 创建 |
| PUT | /api/admin/tags/{id} | 更新 |
| DELETE | /api/admin/tags/{id} | 删除 |

### 评论

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/articles/{slug}/comments | 文章评论列表 |
| POST | /api/articles/{slug}/comments | 提交评论 |
| GET | /api/admin/comments | 管理列表 |
| PUT | /api/admin/comments/{id}/approve | 审核通过 |
| PUT | /api/admin/comments/{id}/reject | 拒绝 |
| DELETE | /api/admin/comments/{id} | 删除 |

### 媒体

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/media | 媒体列表 |
| POST | /api/admin/media/upload | 上传 |
| DELETE | /api/admin/media/{id} | 删除 |

### 设置

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/settings | 公开设置 |
| GET | /api/admin/settings | 全部设置 |
| PUT | /api/admin/settings | 更新设置 |

### 构建

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/admin/builds/trigger | 手动触发构建 |
| GET | /api/admin/builds | 构建历史 |
| GET | /api/admin/builds/{id}/log | 构建日志 |

### 统计

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/stats | 仪表盘统计数据 |

## 8. 明确排除的功能

以下功能不在本期范围内：

- 多用户 / RBAC 权限系统
- 文章模板系统
- 首页自定义布局
- 菜单指向独立页面或外部链接
- 消息队列
- 策略模式 / 工厂模式等过度设计
- 国际化 (i18n)
- RSS 订阅（可后期添加）
- SEO 高级配置（基础 meta 标签由 Next.js 自动处理）
- 访客统计系统（可后期接入第三方）
