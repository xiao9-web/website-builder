# 系统架构设计

## 整体架构

```
┌─────────────────┐    HTTP API    ┌─────────────────┐
│   Admin 后台    │ ◄─────────────► │   Server 后端   │
│ (Vue3 + Element)│                │ (NestJS + MySQL)│
└─────────────────┘                └─────────────────┘
                                             ▲
                                             │
                                             ▼
┌─────────────────┐                ┌─────────────────┐
│  Frontend 官网  │                │   阿里云 OSS     │
│  (Vue3 + Vite)  │ ◄─────────────► │  + CDN 加速     │
└─────────────────┘   静态资源部署  └─────────────────┘
```

## 核心模块设计

### 1. 内容管理模块 (Content Module)
负责管理所有网站内容数据：
- 菜单管理：支持多级菜单、拖拽排序、图标配置
- 文章管理：富文本编辑、分类标签、SEO配置、草稿/发布状态
- 页面管理：自定义页面、组件拖拽、布局配置
- 媒体库：图片/视频/文件管理，支持分组、标签、搜索

### 2. 模板引擎模块 (Template Engine)
负责模板渲染和静态页面生成：
- 模板解析：解析模板配置，生成Vue组件
- 静态生成：SSG静态页面生成，支持SSR可选
- 组件渲染：动态渲染配置的组件
- 样式编译：Tailwind CSS按需编译，生成最小化CSS

### 3. 部署模块 (Deployment Module)
负责一键部署到阿里云：
- OSS上传：自动上传静态资源到OSS
- CDN刷新：部署完成后自动刷新CDN缓存
- 版本管理：记录每个部署版本，支持一键回滚
- 部署日志：记录部署过程，失败自动回滚

### 4. 系统管理模块 (System Module)
- 用户管理：多用户权限控制
- 操作日志：记录所有后台操作
- 系统配置：阿里云配置、全局参数设置
- 数据备份：自动备份内容和配置数据

## 数据库设计

### 核心表结构

#### menus 菜单表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| name | varchar | 菜单名称 |
| path | varchar | 跳转路径 |
| parent_id | int | 父菜单ID |
| sort | int | 排序 |
| icon | varchar | 图标 |
| is_visible | tinyint | 是否显示 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

#### articles 文章表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| title | varchar | 文章标题 |
| slug | varchar | 别名 |
| content | text | 文章内容 |
| summary | varchar | 摘要 |
| category_id | int | 分类ID |
| tags | varchar | 标签，逗号分隔 |
| seo_title | varchar | SEO标题 |
| seo_description | text | SEO描述 |
| seo_keywords | varchar | SEO关键词 |
| status | tinyint | 状态：0草稿 1发布 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

#### pages 自定义页面表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| title | varchar | 页面标题 |
| slug | varchar | 路径别名 |
| layout_config | json | 布局配置 |
| seo_title | varchar | SEO标题 |
| seo_description | text | SEO描述 |
| seo_keywords | varchar | SEO关键词 |
| status | tinyint | 状态 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

#### site_config 网站配置表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| config_key | varchar | 配置键 |
| config_value | json | 配置值 |
| group | varchar | 配置分组 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

#### deploy_versions 部署版本表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| version | varchar | 版本号 |
| description | text | 版本描述 |
| status | tinyint | 状态：0失败 1成功 |
| deploy_log | text | 部署日志 |
| created_at | datetime | 部署时间 |
| created_by | int | 部署人 |

## API 设计

### RESTful API 规范
- 所有API前缀：`/api/v1`
- 认证方式：JWT Token
- 响应格式：
  ```json
  {
    "code": 0,
    "message": "success",
    "data": {}
  }
  ```

### 核心API列表
- `POST /auth/login` 登录
- `GET /menus` 获取菜单列表
- `POST /menus` 创建菜单
- `PUT /menus/:id` 更新菜单
- `DELETE /menus/:id` 删除菜单
- `GET /articles` 获取文章列表
- `POST /articles` 创建文章
- `PUT /articles/:id` 更新文章
- `DELETE /articles/:id` 删除文章
- `POST /deploy` 触发部署
- `GET /deploy/versions` 获取部署版本列表
- `POST /deploy/rollback/:id` 版本回滚

## 安全设计

1. **认证授权**：JWT Token认证，基于角色的权限控制
2. **输入验证**：所有接口参数校验，防止SQL注入和XSS攻击
3. **文件上传**：限制文件类型和大小，病毒扫描（可选）
4. **API限流**：接口请求频率限制，防止暴力攻击
5. **敏感信息加密**：阿里云AK/SK等敏感信息加密存储
6. **操作审计**：所有敏感操作记录日志，可追溯
