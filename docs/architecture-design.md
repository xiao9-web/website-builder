# 网站构建平台 — 系统架构设计文档

> 版本: v1.0 | 日期: 2026-05-13 | 状态: 设计阶段

---

## 目录

1. [系统概览](#1-系统概览)
2. [模块设计](#2-模块设计)
3. [模板引擎设计（核心）](#3-模板引擎设计核心)
4. [API 设计](#4-api-设计)
5. [数据库设计](#5-数据库设计)
6. [项目结构](#6-项目结构)
7. [部署架构](#7-部署架构)
8. [面试亮点](#8-面试亮点)

---

## 1. 系统概览

### 1.1 定位

代码级模板引擎驱动的网站构建平台。开发者编写模板代码（React 组件 + JSON Schema），用户选择模板并填写配置，系统通过 Next.js SSG 生成高性能静态站点。

支持两类站点：企业官网、个人博客。

### 1.2 高层架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户浏览器                                 │
└──────────────┬──────────────────────────────────┬───────────────┘
               │                                  │
               ▼                                  ▼
┌──────────────────────────┐    ┌──────────────────────────────────┐
│   Next.js 14 Web App     │    │   生成的静态站点 (CDN/Nginx)       │
│   (管理后台 + 预览)       │    │   (用户最终访问的网站)             │
└──────────────┬───────────┘    └──────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Nginx (反向代理 + 负载均衡)                   │
└──────────────┬───────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Spring Boot 3 API Gateway                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────┐  │
│  │ User       │ │ Template   │ │ Site       │ │ Media        │  │
│  │ Service    │ │ Service    │ │ Service    │ │ Service      │  │
│  └────────────┘ └────────────┘ └────────────┘ └──────────────┘  │
└──────────────┬───────────────────────────────────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
┌──────────────┐ ┌──────────┐
│ PostgreSQL   │ │  Redis   │
│ (持久化)     │ │ (缓存)   │
└──────────────┘ └──────────┘
```

### 1.3 核心数据流

```
开发者编写模板 → 注册到模板仓库 → 用户选择模板
→ 填写 JSON Schema 配置 → 后端存储配置
→ 触发 Next.js SSG 构建 → 输出静态 HTML/CSS/JS → 部署到 Nginx
```

### 1.4 设计原则

| 原则 | 说明 |
|------|------|
| 模板即代码 | 模板是 React 组件 + Schema，走 Git 版本管理 |
| 配置驱动渲染 | 用户不写代码，只填配置，系统负责渲染 |
| 静态优先 | 最终产物是静态站点，性能最优 |
| 单体先行 | Spring Boot 单体应用，模块化设计，未来可拆微服务 |
| 面试导向 | 每个设计决策都有明确的技术深度体现 |

---

## 2. 模块设计

### 2.1 User Service（用户服务）

**职责**: 认证、授权、用户管理

```
┌─────────────────────────────────────┐
│           User Service              │
├─────────────────────────────────────┤
│ - JWT 认证 (Access + Refresh Token) │
│ - RBAC 角色模型                     │
│ - OAuth2 社交登录 (GitHub)          │
│ - 用户 Profile 管理                 │
└─────────────────────────────────────┘
```

**角色设计**:

| 角色 | 权限 |
|------|------|
| ADMIN | 全部权限，管理模板、管理用户 |
| DEVELOPER | 创建/发布模板，管理自己的站点 |
| USER | 选择模板、配置站点、管理自己的内容 |

**技术要点**:
- Spring Security 6 + JWT（面试点：自定义 Filter Chain）
- Token 双令牌机制：Access Token 15min + Refresh Token 7d
- Redis 存储 Token 黑名单（登出即失效）
- 自定义注解 `@RequireRole` + AOP 实现声明式权限控制

### 2.2 Template Service（模板服务）

**职责**: 模板注册、版本管理、Schema 校验、模板发现

```
┌─────────────────────────────────────────────┐
│            Template Service                  │
├─────────────────────────────────────────────┤
│ - 模板注册 & 元数据管理                      │
│ - 语义化版本控制 (SemVer)                    │
│ - JSON Schema 校验                           │
│ - 模板分类 & 标签 & 搜索                     │
│ - 模板预览图生成                             │
└─────────────────────────────────────────────┘
```

**模板生命周期**:

```
DRAFT → REVIEW → PUBLISHED → DEPRECATED
  │                              │
  └──── 可随时回到 DRAFT ────────┘
```

**技术要点**:
- Strategy 模式：不同模板类型（博客/官网）使用不同的校验策略和渲染策略
- 版本管理：每次发布生成新版本号，旧版本站点不受影响
- JSON Schema 校验：使用 everit-org/json-schema 库做服务端校验
- Redis 缓存热门模板的 Schema 定义（面试点：缓存穿透/击穿防护）

### 2.3 Site Service（站点服务）

**职责**: 站点创建、配置管理、构建触发、部署管理

```
┌─────────────────────────────────────────────┐
│              Site Service                    │
├─────────────────────────────────────────────┤
│ - 站点 CRUD & 配置存储                       │
│ - 构建任务调度 (异步)                        │
│ - 站点发布 & 版本回滚                        │
│ - 自定义域名绑定                             │
│ - SEO 配置管理                               │
└─────────────────────────────────────────────┘
```

**站点构建流程**:

```
用户保存配置 → 创建构建任务 → 加入消息队列
→ 构建 Worker 拉取任务 → 调用 Next.js build
→ 输出静态文件 → 部署到 Nginx → 更新站点状态
```

**技术要点**:
- Factory 模式：SiteFactory 根据模板类型创建不同的站点构建器
- Observer 模式：站点状态变更通过 Spring Event 通知（构建完成、部署成功等）
- 异步构建：Spring `@Async` + CompletableFuture，避免阻塞用户请求
- 版本回滚：保留最近 5 个构建产物，一键回滚

### 2.4 Media Service（媒体服务）

**职责**: 文件上传、图片处理、存储管理

```
┌─────────────────────────────────────────────┐
│             Media Service                   │
├─────────────────────────────────────────────┤
│ - 文件上传 (分片上传大文件)                   │
│ - 图片压缩 & 格式转换 (WebP)                 │
│ - 缩略图生成 (多尺寸)                        │
│ - 存储抽象层 (本地/OSS 可切换)               │
└─────────────────────────────────────────────┘
```

**技术要点**:
- 策略模式：StorageStrategy 接口，LocalStorage / OSSStorage 实现可切换
- 图片处理：Thumbnailator 库做压缩和缩略图
- 文件去重：基于 MD5 哈希，相同文件不重复存储
- 访问控制：签名 URL，防盗链

---

## 3. 模板引擎设计（核心）

这是整个系统的核心竞争力，也是面试中最值得深入讲解的部分。

### 3.1 模板结构定义

每个模板由以下文件组成：

```
templates/
└── blog-minimal/
    ├── index.tsx              # 主组件入口
    ├── schema.json            # 配置字段定义 (JSON Schema)
    ├── meta.json              # 模板元数据 (名称、描述、分类、预览图)
    ├── components/            # 模板内部子组件
    │   ├── Header.tsx
    │   ├── Footer.tsx
    │   ├── PostList.tsx
    │   └── Sidebar.tsx
    ├── styles/                # 模板样式
    │   └── theme.css
    ├── preview.png            # 模板预览图
    └── README.md              # 模板使用说明
```

### 3.2 Schema 设计规范

schema.json 定义了用户可配置的所有字段，遵循 JSON Schema Draft-07 标准，并扩展了 UI 渲染提示：

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "极简博客模板配置",
  "properties": {
    "site": {
      "type": "object",
      "title": "站点基础信息",
      "properties": {
        "title": {
          "type": "string",
          "title": "站点标题",
          "default": "My Blog",
          "maxLength": 60,
          "x-ui": { "component": "input", "placeholder": "输入你的博客名称" }
        },
        "description": {
          "type": "string",
          "title": "站点描述",
          "default": "",
          "maxLength": 160,
          "x-ui": { "component": "textarea", "rows": 3 }
        },
        "logo": {
          "type": "string",
          "title": "Logo",
          "format": "uri",
          "x-ui": { "component": "image-upload", "accept": "image/*", "maxSize": "2MB" }
        }
      },
      "required": ["title"]
    },
    "theme": {
      "type": "object",
      "title": "主题配置",
      "properties": {
        "primaryColor": {
          "type": "string",
          "title": "主色调",
          "default": "#1a73e8",
          "pattern": "^#[0-9a-fA-F]{6}$",
          "x-ui": { "component": "color-picker" }
        },
        "fontFamily": {
          "type": "string",
          "title": "字体",
          "enum": ["system-ui", "Inter", "Noto Sans SC", "Source Han Serif"],
          "default": "system-ui",
          "x-ui": { "component": "select" }
        },
        "layout": {
          "type": "string",
          "title": "布局模式",
          "enum": ["wide", "narrow", "sidebar"],
          "default": "wide",
          "x-ui": { "component": "radio-card", "previews": true }
        }
      }
    },
    "navigation": {
      "type": "array",
      "title": "导航菜单",
      "items": {
        "type": "object",
        "properties": {
          "label": { "type": "string", "title": "菜单名" },
          "href": { "type": "string", "title": "链接地址" },
          "icon": { "type": "string", "title": "图标", "x-ui": { "component": "icon-picker" } }
        },
        "required": ["label", "href"]
      },
      "maxItems": 8,
      "x-ui": { "component": "sortable-list" }
    },
    "features": {
      "type": "object",
      "title": "功能开关",
      "properties": {
        "enableSearch": { "type": "boolean", "title": "启用搜索", "default": true },
        "enableRSS": { "type": "boolean", "title": "启用 RSS", "default": true },
        "enableTOC": { "type": "boolean", "title": "文章目录", "default": true },
        "codeHighlight": {
          "type": "string",
          "title": "代码高亮主题",
          "enum": ["github", "dracula", "one-dark", "nord"],
          "default": "github"
        }
      }
    }
  }
}
```

**x-ui 扩展字段说明**：这是我们对标准 JSON Schema 的扩展，用于告诉前端配置表单该用什么 UI 组件渲染。这个设计参考了 formily/react-jsonschema-form 的思路，但做了简化。

### 3.3 模板组件规范

模板主组件必须遵循以下接口约定：

```tsx
// Template 组件的 Props 类型由 schema.json 自动推导
import { TemplateProps } from '@website-builder/template-sdk';

interface BlogMinimalConfig {
  site: {
    title: string;
    description?: string;
    logo?: string;
  };
  theme: {
    primaryColor: string;
    fontFamily: string;
    layout: 'wide' | 'narrow' | 'sidebar';
  };
  navigation: Array<{ label: string; href: string; icon?: string }>;
  features: {
    enableSearch: boolean;
    enableRSS: boolean;
    enableTOC: boolean;
    codeHighlight: string;
  };
}

// 模板必须 export default 一个符合 TemplateComponent 接口的组件
const BlogMinimal: TemplateComponent<BlogMinimalConfig> = ({ config, content }) => {
  const { site, theme, navigation, features } = config;

  return (
    <ThemeProvider primaryColor={theme.primaryColor} font={theme.fontFamily}>
      <Layout variant={theme.layout}>
        <Header title={site.title} logo={site.logo} nav={navigation} />
        <Main>
          {content.type === 'post-list' && (
            <PostList posts={content.posts} showTOC={features.enableTOC} />
          )}
          {content.type === 'post-detail' && (
            <PostDetail post={content.post} codeTheme={features.codeHighlight} />
          )}
        </Main>
        <Footer siteName={site.title} enableRSS={features.enableRSS} />
      </Layout>
    </ThemeProvider>
  );
};

export default BlogMinimal;
```

### 3.4 模板注册机制

```
┌──────────────────────────────────────────────────────────────┐
│                    Template Registry                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. 开发者在 packages/templates/ 下创建模板目录               │
│  2. 运行 template-sdk CLI: `wb template register`            │
│  3. CLI 校验 schema.json 合法性 + 组件可渲染性               │
│  4. 生成模板清单 manifest.json (包含所有已注册模板)           │
│  5. 后端启动时加载 manifest，写入 DB 模板表                  │
│  6. 前端通过 API 获取可用模板列表                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**注册流程详细步骤**:

```
wb template register blog-minimal
    │
    ├─ 1. 检查目录结构完整性 (index.tsx, schema.json, meta.json)
    ├─ 2. 校验 schema.json 符合 JSON Schema Draft-07
    ├─ 3. 校验 meta.json 必填字段 (name, version, category, description)
    ├─ 4. TypeScript 编译检查 (确保组件无类型错误)
    ├─ 5. 生成预览截图 (Puppeteer + 默认配置渲染)
    ├─ 6. 计算模板包 hash (用于版本比对)
    └─ 7. 更新 manifest.json，标记版本号
```

### 3.5 渲染管线 (Rendering Pipeline)

这是从用户配置到最终静态站点的完整流程：

```
┌─────────┐     ┌──────────┐     ┌──────────────┐     ┌────────────┐
│ 用户填写 │────▶│ 后端校验  │────▶│ 存储配置到DB  │────▶│ 触发构建    │
│ 配置表单 │     │ Schema   │     │ site_configs │     │ 任务       │
└─────────┘     └──────────┘     └──────────────┘     └─────┬──────┘
                                                            │
                                                            ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────────────────┐
│ 部署到       │◀────│ 输出静态文件  │◀────│ Next.js SSG Build        │
│ Nginx/CDN   │     │ /out 目录    │     │ (getStaticProps 注入配置) │
└─────────────┘     └──────────────┘     └─────────────────────────┘
```

**Next.js SSG 构建细节**:

```tsx
// apps/web/src/app/sites/[siteId]/page.tsx
// 这是动态路由，SSG 时会为每个站点生成静态页面

export async function generateStaticParams() {
  // 从后端获取所有已发布站点的 ID
  const sites = await fetchPublishedSites();
  return sites.map(site => ({ siteId: site.id }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const siteConfig = await fetchSiteConfig(params.siteId);
  return {
    title: siteConfig.site.title,
    description: siteConfig.site.description,
  };
}

export default async function SitePage({ params }) {
  const { siteId } = params;

  // 1. 获取站点配置
  const siteConfig = await fetchSiteConfig(siteId);

  // 2. 获取站点内容 (文章列表等)
  const content = await fetchSiteContent(siteId);

  // 3. 动态加载对应模板组件
  const Template = await loadTemplate(siteConfig.templateId);

  // 4. 渲染模板，注入配置和内容
  return <Template config={siteConfig.config} content={content} />;
}
```

**动态模板加载机制**:

```tsx
// packages/template-sdk/src/loader.ts

// 模板注册表 — 编译时由 webpack/turbopack 插件生成
const TEMPLATE_REGISTRY: Record<string, () => Promise<TemplateModule>> = {
  'blog-minimal': () => import('@website-builder/templates/blog-minimal'),
  'blog-developer': () => import('@website-builder/templates/blog-developer'),
  'corp-standard': () => import('@website-builder/templates/corp-standard'),
  'corp-landing': () => import('@website-builder/templates/corp-landing'),
};

export async function loadTemplate(templateId: string): Promise<TemplateComponent> {
  const loader = TEMPLATE_REGISTRY[templateId];
  if (!loader) {
    throw new TemplateNotFoundError(templateId);
  }
  const module = await loader();
  return module.default;
}
```

### 3.6 Template SDK 设计

SDK 提供给模板开发者使用，包含类型定义、工具函数、CLI 工具：

```
packages/template-sdk/
├── src/
│   ├── types.ts           # TemplateComponent, TemplateProps 等核心类型
│   ├── hooks/             # 模板可用的 React Hooks
│   │   ├── useConfig.ts   # 获取当前配置
│   │   ├── useContent.ts  # 获取站点内容
│   │   ├── useTheme.ts    # 主题相关工具
│   │   └── useMedia.ts    # 媒体资源 URL 解析
│   ├── components/        # 模板可复用的基础组件
│   │   ├── Image.tsx      # 自动优化的图片组件
│   │   ├── Link.tsx       # 站内链接组件
│   │   ├── SEO.tsx        # SEO meta 标签组件
│   │   └── CodeBlock.tsx  # 代码高亮组件
│   ├── schema/            # Schema 相关工具
│   │   ├── validator.ts   # Schema 校验器
│   │   └── generator.ts   # 从 TypeScript 类型生成 Schema
│   ├── cli/               # CLI 工具
│   │   ├── register.ts    # 注册模板
│   │   ├── validate.ts    # 校验模板
│   │   ├── preview.ts     # 本地预览
│   │   └── scaffold.ts    # 脚手架生成模板骨架
│   └── index.ts           # 统一导出
├── package.json
└── tsconfig.json
```

**SDK 核心类型定义**:

```tsx
// packages/template-sdk/src/types.ts

/** 模板组件的标准 Props */
export interface TemplateProps<TConfig = Record<string, unknown>> {
  /** 用户填写的配置数据，结构由 schema.json 定义 */
  config: TConfig;
  /** 站点内容数据 (文章、页面等) */
  content: SiteContent;
  /** 站点元信息 */
  site: SiteMeta;
}

/** 模板组件类型约束 */
export type TemplateComponent<TConfig = Record<string, unknown>> =
  React.FC<TemplateProps<TConfig>>;

/** 站点内容联合类型 */
export type SiteContent =
  | { type: 'post-list'; posts: Post[]; pagination: Pagination }
  | { type: 'post-detail'; post: Post }
  | { type: 'page'; page: Page }
  | { type: 'home'; sections: Section[] };

/** 模板元数据 (meta.json) */
export interface TemplateMeta {
  name: string;                          // 唯一标识符
  displayName: string;                   // 显示名称
  version: string;                       // SemVer 版本号
  category: 'blog' | 'corporate';       // 模板分类
  description: string;                   // 模板描述
  author: string;                        // 作者
  tags: string[];                        // 标签
  preview: string;                       // 预览图路径
  supportedFeatures: string[];           // 支持的功能列表
  minSDKVersion: string;                 // 最低 SDK 版本要求
}
```

### 3.7 配置表单自动生成

前端根据 schema.json 自动生成配置表单，无需为每个模板手写表单：

```tsx
// apps/web/src/components/config-form/SchemaForm.tsx

interface SchemaFormProps {
  schema: JSONSchema;          // 模板的 schema.json
  value: Record<string, any>;  // 当前配置值
  onChange: (value: Record<string, any>) => void;
}

/**
 * 核心思路：递归遍历 schema，根据 type + x-ui 决定渲染哪个表单控件
 * 面试点：这是一个典型的 Compound Components + Render Props 模式应用
 */
export function SchemaForm({ schema, value, onChange }: SchemaFormProps) {
  return (
    <FormProvider value={value} onChange={onChange}>
      {Object.entries(schema.properties).map(([key, fieldSchema]) => (
        <FormSection key={key} title={fieldSchema.title}>
          <FieldRenderer
            schema={fieldSchema}
            path={[key]}
            value={value[key]}
          />
        </FormSection>
      ))}
    </FormProvider>
  );
}

// 字段渲染器 — 根据 schema type 和 x-ui 分发到具体组件
function FieldRenderer({ schema, path, value }) {
  const uiHint = schema['x-ui']?.component;

  // 优先使用 x-ui 指定的组件
  if (uiHint && UI_COMPONENTS[uiHint]) {
    const Component = UI_COMPONENTS[uiHint];
    return <Component schema={schema} path={path} value={value} />;
  }

  // 回退到基于 type 的默认组件
  switch (schema.type) {
    case 'string': return <StringField schema={schema} path={path} value={value} />;
    case 'number': return <NumberField schema={schema} path={path} value={value} />;
    case 'boolean': return <BooleanField schema={schema} path={path} value={value} />;
    case 'array': return <ArrayField schema={schema} path={path} value={value} />;
    case 'object': return <ObjectField schema={schema} path={path} value={value} />;
    default: return null;
  }
}

// UI 组件注册表
const UI_COMPONENTS: Record<string, React.FC<FieldProps>> = {
  'input': InputField,
  'textarea': TextareaField,
  'select': SelectField,
  'color-picker': ColorPickerField,
  'image-upload': ImageUploadField,
  'icon-picker': IconPickerField,
  'radio-card': RadioCardField,
  'sortable-list': SortableListField,
};
```

### 3.8 模板开发工作流

```
1. 脚手架创建
   $ npx wb-template create my-template --category blog
   → 生成标准目录结构 + 示例代码

2. 本地开发
   $ cd packages/templates/my-template
   $ npm run dev
   → 启动 Storybook 式的独立预览环境，热更新

3. Schema 设计
   → 编辑 schema.json，定义用户可配置项
   → SDK 自动生成 TypeScript 类型

4. 组件开发
   → 基于生成的类型编写 React 组件
   → 使用 SDK 提供的 hooks 和基础组件

5. 校验 & 注册
   $ npx wb-template validate
   $ npx wb-template register
   → 校验通过后写入 manifest

6. 预览测试
   $ npx wb-template preview --config sample-config.json
   → 用示例配置渲染完整页面，确认效果
```

---

## 4. API 设计

### 4.1 API 总览

所有 API 遵循 RESTful 规范，统一前缀 `/api/v1`。

| 模块 | 前缀 | 说明 |
|------|------|------|
| Auth | `/api/v1/auth` | 认证相关 |
| Users | `/api/v1/users` | 用户管理 |
| Templates | `/api/v1/templates` | 模板管理 |
| Sites | `/api/v1/sites` | 站点管理 |
| Media | `/api/v1/media` | 媒体资源 |
| Build | `/api/v1/builds` | 构建任务 |

### 4.2 认证 API

```
POST   /api/v1/auth/register          # 用户注册
POST   /api/v1/auth/login             # 登录，返回 JWT
POST   /api/v1/auth/refresh           # 刷新 Access Token
POST   /api/v1/auth/logout            # 登出，Token 加入黑名单
POST   /api/v1/auth/github            # GitHub OAuth 回调
```

### 4.3 模板 API

```
GET    /api/v1/templates              # 模板列表 (分页、筛选、搜索)
GET    /api/v1/templates/:id          # 模板详情 (含 schema)
GET    /api/v1/templates/:id/schema   # 获取模板 Schema 定义
GET    /api/v1/templates/:id/versions # 模板版本历史
POST   /api/v1/templates              # 创建模板 (DEVELOPER+)
PUT    /api/v1/templates/:id          # 更新模板
PATCH  /api/v1/templates/:id/status   # 变更模板状态 (发布/下架)
DELETE /api/v1/templates/:id          # 删除模板 (ADMIN)
```

**模板列表响应示例**:

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "tpl_blog_minimal",
        "displayName": "极简博客",
        "version": "1.2.0",
        "category": "blog",
        "description": "简洁优雅的个人博客模板",
        "preview": "/media/templates/blog-minimal/preview.png",
        "author": "admin",
        "tags": ["博客", "极简", "响应式"],
        "usageCount": 128,
        "createdAt": "2026-01-15T08:00:00Z"
      }
    ],
    "total": 12,
    "page": 1,
    "pageSize": 10
  }
}
```

### 4.4 站点 API

```
GET    /api/v1/sites                  # 我的站点列表
POST   /api/v1/sites                  # 创建站点 (选择模板)
GET    /api/v1/sites/:id              # 站点详情
PUT    /api/v1/sites/:id/config       # 更新站点配置
GET    /api/v1/sites/:id/config       # 获取站点当前配置
POST   /api/v1/sites/:id/build       # 触发站点构建
GET    /api/v1/sites/:id/builds      # 构建历史
POST   /api/v1/sites/:id/rollback    # 回滚到指定版本
PATCH  /api/v1/sites/:id/domain      # 绑定自定义域名
DELETE /api/v1/sites/:id              # 删除站点
```

**创建站点请求示例**:

```json
{
  "name": "我的技术博客",
  "templateId": "tpl_blog_minimal",
  "templateVersion": "1.2.0",
  "config": {
    "site": { "title": "Xiao9 的技术笔记", "description": "记录学习与成长" },
    "theme": { "primaryColor": "#2563eb", "fontFamily": "Inter", "layout": "wide" },
    "navigation": [
      { "label": "首页", "href": "/" },
      { "label": "归档", "href": "/archives" },
      { "label": "关于", "href": "/about" }
    ],
    "features": { "enableSearch": true, "enableRSS": true, "enableTOC": true, "codeHighlight": "one-dark" }
  }
}
```

### 4.5 媒体 API

```
POST   /api/v1/media/upload           # 上传文件
POST   /api/v1/media/upload/chunk     # 分片上传
GET    /api/v1/media                   # 媒体列表
GET    /api/v1/media/:id              # 媒体详情
DELETE /api/v1/media/:id              # 删除媒体
```

### 4.6 统一响应格式

```java
// 成功响应
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "timestamp": 1715590800000
}

// 错误响应
{
  "code": 400,
  "message": "Schema validation failed",
  "errors": [
    { "field": "config.site.title", "message": "不能为空" }
  ],
  "timestamp": 1715590800000
}

// 分页响应
{
  "code": 200,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

### 4.7 全局错误码

| 错误码 | 含义 |
|--------|------|
| 401001 | Token 过期 |
| 401002 | Token 无效 |
| 403001 | 权限不足 |
| 404001 | 模板不存在 |
| 404002 | 站点不存在 |
| 422001 | Schema 校验失败 |
| 422002 | 配置数据不合法 |
| 500001 | 构建任务失败 |

---

## 5. 数据库设计

### 5.1 ER 关系图

```
┌──────────┐       ┌──────────────┐       ┌──────────────┐
│  users   │──1:N──│    sites     │──N:1──│  templates   │
└──────────┘       └──────┬───────┘       └──────┬───────┘
                          │                      │
                     1:N  │                 1:N  │
                          ▼                      ▼
                   ┌──────────────┐       ┌──────────────────┐
                   │ site_configs │       │ template_versions │
                   └──────────────┘       └──────────────────┘
                          │
                     1:N  │
                          ▼
                   ┌──────────────┐
                   │    builds    │
                   └──────────────┘

┌──────────┐
│  media   │──N:1── users
└──────────┘
```

### 5.2 核心表结构

```sql
-- 用户表
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    username        VARCHAR(50) UNIQUE NOT NULL,
    email           VARCHAR(100) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    avatar          VARCHAR(500),
    role            VARCHAR(20) NOT NULL DEFAULT 'USER',  -- ADMIN, DEVELOPER, USER
    github_id       VARCHAR(50),
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, DISABLED
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 模板表
CREATE TABLE templates (
    id              VARCHAR(50) PRIMARY KEY,              -- 如 'blog-minimal'
    display_name    VARCHAR(100) NOT NULL,
    description     TEXT,
    category        VARCHAR(20) NOT NULL,                 -- blog, corporate
    author_id       BIGINT REFERENCES users(id),
    current_version VARCHAR(20) NOT NULL,                 -- 当前最新版本号
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, DEPRECATED
    preview_url     VARCHAR(500),
    tags            TEXT[],                               -- PostgreSQL 数组类型
    usage_count     INTEGER NOT NULL DEFAULT 0,
    schema_hash     VARCHAR(64),                          -- schema 内容 hash，用于变更检测
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 模板版本表 (面试点：版本管理设计)
CREATE TABLE template_versions (
    id              BIGSERIAL PRIMARY KEY,
    template_id     VARCHAR(50) REFERENCES templates(id),
    version         VARCHAR(20) NOT NULL,                 -- SemVer: 1.0.0
    schema_content  JSONB NOT NULL,                       -- 该版本的完整 schema
    changelog       TEXT,                                 -- 变更说明
    package_hash    VARCHAR(64) NOT NULL,                 -- 模板包 hash
    is_breaking     BOOLEAN NOT NULL DEFAULT FALSE,       -- 是否有破坏性变更
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(template_id, version)
);

-- 站点表
CREATE TABLE sites (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL,         -- URL 友好的标识
    owner_id        BIGINT REFERENCES users(id),
    template_id     VARCHAR(50) REFERENCES templates(id),
    template_version VARCHAR(20) NOT NULL,                -- 锁定的模板版本
    domain          VARCHAR(200),                         -- 自定义域名
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- DRAFT, BUILDING, PUBLISHED, OFFLINE
    current_build_id BIGINT,                             -- 当前生效的构建
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 站点配置表 (面试点：JSONB 的使用)
CREATE TABLE site_configs (
    id              BIGSERIAL PRIMARY KEY,
    site_id         BIGINT REFERENCES sites(id) ON DELETE CASCADE,
    version         INTEGER NOT NULL DEFAULT 1,           -- 配置版本号，每次保存递增
    config_data     JSONB NOT NULL,                       -- 用户填写的配置数据
    is_current      BOOLEAN NOT NULL DEFAULT TRUE,        -- 是否为当前生效配置
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(site_id, version)
);

-- 构建记录表
CREATE TABLE builds (
    id              BIGSERIAL PRIMARY KEY,
    site_id         BIGINT REFERENCES sites(id) ON DELETE CASCADE,
    config_version  INTEGER NOT NULL,                     -- 对应的配置版本
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, BUILDING, SUCCESS, FAILED
    output_path     VARCHAR(500),                         -- 构建产物路径
    build_log       TEXT,                                 -- 构建日志
    duration_ms     INTEGER,                             -- 构建耗时
    error_message   TEXT,                                -- 失败原因
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    finished_at     TIMESTAMP
);

-- 媒体资源表
CREATE TABLE media (
    id              BIGSERIAL PRIMARY KEY,
    filename        VARCHAR(255) NOT NULL,                -- 原始文件名
    storage_key     VARCHAR(500) NOT NULL,                -- 存储路径/key
    mime_type       VARCHAR(100) NOT NULL,
    file_size       BIGINT NOT NULL,                     -- 字节数
    width           INTEGER,                             -- 图片宽度
    height          INTEGER,                             -- 图片高度
    md5_hash        VARCHAR(32) NOT NULL,                -- 文件 MD5，用于去重
    uploader_id     BIGINT REFERENCES users(id),
    site_id         BIGINT REFERENCES sites(id),         -- 关联站点 (可选)
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 索引设计
CREATE INDEX idx_sites_owner ON sites(owner_id);
CREATE INDEX idx_sites_template ON sites(template_id);
CREATE INDEX idx_site_configs_site ON site_configs(site_id, is_current);
CREATE INDEX idx_builds_site ON builds(site_id, status);
CREATE INDEX idx_media_uploader ON media(uploader_id);
CREATE INDEX idx_media_md5 ON media(md5_hash);
CREATE INDEX idx_templates_category ON templates(category, status);
CREATE INDEX idx_templates_tags ON templates USING GIN(tags);  -- GIN 索引支持数组查询
```

### 5.3 Redis 缓存设计

| Key 模式 | 值 | TTL | 用途 |
|----------|-----|-----|------|
| `template:schema:{id}:{version}` | Schema JSON | 24h | 热门模板 Schema 缓存 |
| `site:config:{siteId}:current` | 配置 JSON | 1h | 站点当前配置缓存 |
| `template:list:page:{n}` | 列表 JSON | 10min | 模板列表分页缓存 |
| `user:token:blacklist:{jti}` | "1" | 与 Token 剩余有效期一致 | Token 黑名单 |
| `build:lock:{siteId}` | buildId | 10min | 构建任务分布式锁 |
| `rate:limit:{userId}:{api}` | 计数 | 1min | API 限流 |

---

## 6. 项目结构

### 6.1 Monorepo 总体布局

```
website-builder/
├── apps/
│   ├── server/                        # Spring Boot 3 后端
│   │   ├── src/main/java/com/xiao9/wb/
│   │   │   ├── WbApplication.java     # 启动类
│   │   │   ├── config/                # 配置类
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── RedisConfig.java
│   │   │   │   ├── CorsConfig.java
│   │   │   │   └── AsyncConfig.java
│   │   │   ├── common/                # 公共模块
│   │   │   │   ├── response/          # 统一响应封装
│   │   │   │   ├── exception/         # 全局异常处理
│   │   │   │   ├── annotation/        # 自定义注解
│   │   │   │   └── util/              # 工具类
│   │   │   ├── auth/                  # 认证模块
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── filter/            # JWT Filter
│   │   │   │   └── dto/
│   │   │   ├── user/                  # 用户模块
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   └── dto/
│   │   │   ├── template/             # 模板模块
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   │   ├── TemplateService.java
│   │   │   │   │   ├── SchemaValidator.java
│   │   │   │   │   └── strategy/     # 策略模式
│   │   │   │   │       ├── TemplateStrategy.java
│   │   │   │   │       ├── BlogTemplateStrategy.java
│   │   │   │   │       └── CorpTemplateStrategy.java
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   └── dto/
│   │   │   ├── site/                  # 站点模块
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   │   ├── SiteService.java
│   │   │   │   │   ├── BuildService.java
│   │   │   │   │   └── factory/       # 工厂模式
│   │   │   │   │       ├── SiteBuilderFactory.java
│   │   │   │   │       ├── BlogSiteBuilder.java
│   │   │   │   │       └── CorpSiteBuilder.java
│   │   │   │   ├── event/            # 事件驱动
│   │   │   │   │   ├── BuildEvent.java
│   │   │   │   │   └── BuildEventListener.java
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   └── dto/
│   │   │   └── media/                # 媒体模块
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       │   ├── MediaService.java
│   │   │       │   └── storage/       # 策略模式
│   │   │       │       ├── StorageStrategy.java
│   │   │       │       ├── LocalStorageStrategy.java
│   │   │       │       └── OSSStorageStrategy.java
│   │   │       ├── repository/
│   │   │       ├── entity/
│   │   │       └── dto/
│   │   ├── src/main/resources/
│   │   │   ├── application.yml
│   │   │   ├── application-dev.yml
│   │   │   ├── application-prod.yml
│   │   │   └── db/migration/         # Flyway 数据库迁移
│   │   ├── src/test/                  # 测试
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   └── web/                           # Next.js 14 前端
│       ├── src/
│       │   ├── app/                   # App Router
│       │   │   ├── (admin)/           # 管理后台路由组
│       │   │   │   ├── dashboard/
│       │   │   │   ├── templates/
│       │   │   │   ├── sites/
│       │   │   │   │   ├── [id]/
│       │   │   │   │   │   ├── config/    # 站点配置页
│       │   │   │   │   │   ├── builds/    # 构建历史
│       │   │   │   │   │   └── preview/   # 实时预览
│       │   │   │   │   └── new/           # 创建站点
│       │   │   │   └── media/
│       │   │   ├── (auth)/            # 认证路由组
│       │   │   │   ├── login/
│       │   │   │   └── register/
│       │   │   ├── sites/             # 生成的静态站点路由
│       │   │   │   └── [siteId]/
│       │   │   │       └── [...slug]/
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   ├── components/
│       │   │   ├── ui/                # 基础 UI 组件
│       │   │   ├── config-form/       # Schema 表单渲染器
│       │   │   │   ├── SchemaForm.tsx
│       │   │   │   ├── FieldRenderer.tsx
│       │   │   │   └── fields/        # 各类表单字段组件
│       │   │   ├── template-preview/  # 模板预览组件
│       │   │   └── site-builder/      # 站点构建相关组件
│       │   ├── lib/
│       │   │   ├── api.ts             # API 客户端
│       │   │   ├── auth.ts            # 认证工具
│       │   │   └── template-loader.ts # 模板动态加载
│       │   ├── hooks/                 # 自定义 Hooks
│       │   └── types/                 # TypeScript 类型
│       ├── next.config.js
│       ├── tailwind.config.ts
│       ├── package.json
│       └── Dockerfile
│
├── packages/
│   ├── template-sdk/                  # 模板开发 SDK
│   │   ├── src/
│   │   │   ├── types.ts
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   ├── schema/
│   │   │   └── cli/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── templates/                     # 内置模板集合
│   │   ├── blog-minimal/             # 极简博客
│   │   ├── blog-developer/           # 开发者博客
│   │   ├── corp-standard/            # 标准企业官网
│   │   ├── corp-landing/             # 企业落地页
│   │   └── manifest.json             # 模板清单 (自动生成)
│   │
│   └── shared/                        # 共享代码
│       ├── src/
│       │   ├── types/                 # 前后端共享类型
│       │   ├── constants/             # 共享常量
│       │   └── utils/                 # 共享工具函数
│       └── package.json
│
├── docker/
│   ├── docker-compose.yml             # 开发环境编排
│   ├── docker-compose.prod.yml        # 生产环境编排
│   ├── nginx/
│   │   ├── nginx.conf                 # Nginx 主配置
│   │   └── sites/                     # 站点配置模板
│   └── postgres/
│       └── init.sql                   # 数据库初始化
│
├── docs/
│   ├── architecture-design.md         # 本文档
│   ├── api-spec.yaml                  # OpenAPI 规范
│   └── interview-talktrack.md         # 面试讲解稿
│
├── scripts/
│   ├── setup.sh                       # 一键搭建开发环境
│   └── deploy.sh                      # 部署脚本
│
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions CI
│
└── README.md
```

### 6.2 模块依赖关系

```
packages/shared ──────────────────────────────────────┐
       │                                              │
       ▼                                              ▼
packages/template-sdk ──────▶ packages/templates    apps/web
                                     │                │
                                     └────────────────┘
                                            │
apps/server (独立 Java 项目，通过 API 通信) ◀─┘
```

**关键设计决策**：前端 monorepo 使用 pnpm workspace 管理，后端 Spring Boot 是独立项目。前后端通过 HTTP API 通信，不共享运行时代码，只通过 `packages/shared` 共享类型定义（TypeScript 类型导出为 JSON Schema 供后端参考）。

---

## 7. 部署架构

### 7.1 开发环境

```yaml
# docker/docker-compose.yml
services:
  postgres:
    image: postgres:16
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: website_builder
      POSTGRES_USER: wb_dev
      POSTGRES_PASSWORD: dev_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  server:
    build: ../apps/server
    ports: ["8080:8080"]
    depends_on: [postgres, redis]
    environment:
      SPRING_PROFILES_ACTIVE: dev
      DB_HOST: postgres
      REDIS_HOST: redis

  web:
    build: ../apps/web
    ports: ["3000:3000"]
    depends_on: [server]
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8080
```

### 7.2 生产环境架构

```
                    ┌─────────────────┐
                    │   域名 DNS       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Nginx       │
                    │  (反向代理+静态) │
                    └───┬────────┬────┘
                        │        │
            ┌───────────┘        └───────────┐
            ▼                                ▼
   ┌─────────────────┐            ┌──────────────────┐
   │  Next.js (SSR)  │            │  静态站点目录     │
   │  管理后台        │            │  /sites/{slug}/  │
   │  Port 3000      │            │  (纯 HTML/CSS)   │
   └─────────────────┘            └──────────────────┘
            │
            ▼
   ┌─────────────────┐
   │  Spring Boot    │
   │  API Server     │
   │  Port 8080      │
   └────┬───────┬────┘
        │       │
        ▼       ▼
   ┌────────┐ ┌──────┐
   │ PgSQL  │ │Redis │
   └────────┘ └──────┘
```

### 7.3 Nginx 路由规则

```nginx
# 管理后台 → Next.js
location /admin {
    proxy_pass http://localhost:3000;
}

# API 请求 → Spring Boot
location /api {
    proxy_pass http://localhost:8080;
}

# 用户站点 → 静态文件
location /sites {
    alias /var/www/sites;
    try_files $uri $uri/index.html =404;
}

# 自定义域名 → 对应站点静态文件
# 通过 Nginx map 或 Lua 脚本实现域名到站点目录的映射
```

### 7.4 构建产物管理

```
/var/www/sites/
├── my-blog/                    # 站点 slug
│   ├── current -> v3/         # 软链接指向当前版本
│   ├── v1/                    # 历史版本 (保留最近5个)
│   ├── v2/
│   └── v3/
│       ├── index.html
│       ├── posts/
│       ├── about/
│       └── _next/             # Next.js 静态资源
└── corp-site/
    ├── current -> v1/
    └── v1/
```

**回滚机制**：修改软链接即可瞬间回滚，零停机。

---

## 8. 面试亮点

### 8.1 设计模式应用

| 模式 | 应用场景 | 面试讲解要点 |
|------|----------|-------------|
| **Strategy** | 模板校验策略、存储策略 | 不同模板类型有不同的校验规则，通过策略接口解耦。新增模板类型只需新增策略实现，符合开闭原则 |
| **Factory** | 站点构建器工厂 | 根据模板类型创建对应的 Builder，封装了复杂的构建逻辑差异 |
| **Observer** | 站点状态变更事件 | Spring Event 实现松耦合的事件通知，构建完成后自动触发部署、通知等后续动作 |
| **Template Method** | 构建流程骨架 | AbstractSiteBuilder 定义构建步骤骨架，子类实现具体步骤，保证流程一致性 |
| **Registry** | 模板注册表 | 运行时动态注册/发现模板，支持热插拔 |

**Strategy 模式代码示例**:

```java
// 策略接口
public interface TemplateStrategy {
    boolean supports(String category);
    void validate(JsonNode config, JsonNode schema);
    BuildContext prepareBuild(Site site, SiteConfig config);
}

// 博客模板策略
@Component
public class BlogTemplateStrategy implements TemplateStrategy {
    @Override
    public boolean supports(String category) {
        return "blog".equals(category);
    }

    @Override
    public void validate(JsonNode config, JsonNode schema) {
        // 博客特有校验：必须有文章列表配置、RSS 配置等
    }

    @Override
    public BuildContext prepareBuild(Site site, SiteConfig config) {
        // 博客构建准备：生成文章静态路由、RSS feed、sitemap
    }
}

// 策略分发器 — 面试点：如何优雅地选择策略
@Service
@RequiredArgsConstructor
public class TemplateStrategyDispatcher {
    private final List<TemplateStrategy> strategies; // Spring 自动注入所有实现

    public TemplateStrategy getStrategy(String category) {
        return strategies.stream()
            .filter(s -> s.supports(category))
            .findFirst()
            .orElseThrow(() -> new UnsupportedTemplateException(category));
    }
}
```

### 8.2 Spring Boot 技术深度

| 技术点 | 实现 | 面试价值 |
|--------|------|----------|
| **自定义注解 + AOP** | `@RequireRole`、`@RateLimit`、`@Cacheable` | 展示对 Spring AOP 的深入理解，声明式编程思想 |
| **事件驱动** | `ApplicationEventPublisher` + `@EventListener` | 模块间松耦合通信，异步处理 |
| **异步编程** | `@Async` + `CompletableFuture` | 构建任务不阻塞主线程，提升吞吐量 |
| **全局异常处理** | `@RestControllerAdvice` + 自定义异常体系 | 统一错误响应，优雅的异常分层 |
| **数据库迁移** | Flyway | 版本化的数据库变更管理 |
| **参数校验** | JSR 380 + 自定义 Validator | Schema 级别的深度校验 |

**自定义注解示例**:

```java
// 声明式权限控制
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireRole {
    String[] value();  // 允许的角色列表
}

// AOP 切面实现
@Aspect
@Component
public class RoleCheckAspect {
    @Around("@annotation(requireRole)")
    public Object checkRole(ProceedingJoinPoint joinPoint, RequireRole requireRole) throws Throwable {
        String currentRole = SecurityContextHolder.getContext()
            .getAuthentication().getAuthorities().iterator().next().getAuthority();

        if (!Arrays.asList(requireRole.value()).contains(currentRole)) {
            throw new ForbiddenException("权限不足，需要角色: " + Arrays.toString(requireRole.value()));
        }
        return joinPoint.proceed();
    }
}

// 使用方式 — 一行注解搞定权限
@RequireRole({"ADMIN", "DEVELOPER"})
@PostMapping("/templates")
public Result<TemplateVO> createTemplate(@RequestBody @Valid CreateTemplateDTO dto) {
    // ...
}
```

### 8.3 React / Next.js 技术深度

| 技术点 | 实现 | 面试价值 |
|--------|------|----------|
| **Compound Components** | SchemaForm 表单系统 | 组件间隐式通信，灵活组合 |
| **Render Props / Children as Function** | FieldRenderer 字段渲染 | 控制反转，组件复用 |
| **Dynamic Import** | 模板懒加载 | 按需加载模板代码，减小首屏体积 |
| **App Router + SSG** | 站点静态生成 | Next.js 14 最新特性，理解 RSC |
| **ISR (Incremental Static Regeneration)** | 站点增量更新 | 不需要全量重建，单页面按需重新生成 |
| **Context + useReducer** | 表单状态管理 | 复杂表单状态的优雅管理方案 |

**Compound Components 示例**:

```tsx
// 配置表单的 Compound Components 设计
// 面试点：组件间通过 Context 隐式通信，外部使用时像声明式 API

<SchemaForm schema={templateSchema} onSubmit={handleSave}>
  <SchemaForm.Section name="site">
    <SchemaForm.Field name="title" />
    <SchemaForm.Field name="description" />
    <SchemaForm.Field name="logo" />
  </SchemaForm.Section>

  <SchemaForm.Section name="theme">
    <SchemaForm.Field name="primaryColor" />
    <SchemaForm.Field name="layout" />
  </SchemaForm.Section>

  <SchemaForm.Actions>
    <SchemaForm.Submit>保存配置</SchemaForm.Submit>
    <SchemaForm.Preview>实时预览</SchemaForm.Preview>
  </SchemaForm.Actions>
</SchemaForm>
```

### 8.4 性能优化策略

| 优化点 | 方案 | 效果 |
|--------|------|------|
| **静态站点** | Next.js SSG 输出纯 HTML | 首屏加载 < 1s，无服务端渲染开销 |
| **ISR 增量构建** | 单页面按需重建，不全量构建 | 配置变更后秒级生效 |
| **Redis 多级缓存** | Schema 缓存 + 配置缓存 + 列表缓存 | API 响应 < 50ms |
| **图片优化** | 上传时自动压缩 + WebP 转换 + 多尺寸缩略图 | 图片体积减少 60-80% |
| **模板代码分割** | Dynamic import + 按模板懒加载 | 管理后台首屏只加载当前模板代码 |
| **数据库索引** | GIN 索引 (数组)、复合索引、覆盖索引 | 查询性能优化 |
| **构建任务队列** | 异步构建 + 并发控制 | 不阻塞用户操作，系统稳定 |

### 8.5 安全设计

| 安全措施 | 实现方式 |
|----------|----------|
| JWT 双令牌 | Access Token 短期 + Refresh Token 长期，降低泄露风险 |
| Token 黑名单 | Redis 存储已登出 Token，主动失效 |
| RBAC 权限 | 角色 + 资源 + 操作三维权限模型 |
| Schema 校验 | 服务端强校验，防止恶意配置注入 |
| 文件上传安全 | 类型白名单 + 大小限制 + 文件内容检测 |
| API 限流 | 基于 Redis 的滑动窗口限流 |
| SQL 注入防护 | JPA 参数化查询，禁止拼接 SQL |
| XSS 防护 | 配置内容输出时转义，CSP 头 |

### 8.6 面试话术建议

**开场 (30秒)**:
> 这是一个代码级模板引擎驱动的网站构建平台。核心思路是：开发者用 React 写模板组件并定义 JSON Schema 配置项，用户选择模板填写配置，系统通过 Next.js SSG 生成高性能静态站点。

**技术深度 (按面试官兴趣展开)**:
- 问设计模式 → 讲 Strategy + Factory + Observer 的组合使用
- 问 Spring Boot → 讲自定义注解 + AOP + 事件驱动架构
- 问前端 → 讲 Schema 驱动的动态表单 + Compound Components
- 问性能 → 讲 SSG + ISR + Redis 多级缓存 + 图片优化链路
- 问数据库 → 讲 JSONB 存储配置 + 版本管理 + GIN 索引

**亮点总结**:
1. 模板引擎是自研的，不是套用现成方案，体现架构设计能力
2. JSON Schema 驱动表单自动生成，体现对规范和抽象的理解
3. 前后端分离 + 静态站点生成，体现对现代 Web 架构的掌握
4. 设计模式不是为用而用，每个都有明确的业务场景驱动
5. 完整的工程化：CI/CD、Docker、数据库迁移、API 规范

---

## 附录 A: 技术选型决策记录

### ADR-001: 为什么选 Next.js 而不是纯 React SPA

**背景**: 需要同时支持管理后台 (SPA) 和静态站点生成 (SSG)。

**决策**: 使用 Next.js 14 App Router。

**理由**:
- SSG 能力是核心需求，Next.js 原生支持
- App Router 的 Route Groups 可以优雅分离管理后台和站点渲染
- ISR 支持增量更新，不需要全量重建
- React Server Components 减少客户端 JS 体积

**代价**: 学习成本略高于纯 React，部署比纯静态复杂。

### ADR-002: 为什么用 JSON Schema 而不是自定义 DSL

**背景**: 需要一种方式描述模板的可配置字段。

**决策**: 采用 JSON Schema Draft-07 + x-ui 扩展。

**理由**:
- JSON Schema 是行业标准，有成熟的校验库 (Java/JS 都有)
- 前端有 react-jsonschema-form 等生态可参考
- 自定义 DSL 需要写解析器，投入产出比低
- x-ui 扩展字段让 Schema 同时描述数据结构和 UI 渲染

**代价**: JSON Schema 语法较冗长，复杂场景表达力有限。

### ADR-003: 为什么后端选 Spring Boot 而不是 Node.js

**背景**: 用户是 Java 开发者，项目面向 Java 岗位面试。

**决策**: Spring Boot 3 + Java 17。

**理由**:
- 面试目标岗位是 Java 后端，需要展示 Java 技术栈深度
- Spring Boot 生态成熟，AOP/Event/Security 等特性可以充分展示
- Java 17 的新特性 (Records, Sealed Classes, Pattern Matching) 可以体现技术更新意识
- 类型安全，适合复杂业务逻辑

**代价**: 前后端语言不统一，不能共享代码；开发效率略低于 Node.js。

### ADR-004: 为什么用 PostgreSQL 而不是 MySQL

**决策**: PostgreSQL 16。

**理由**:
- JSONB 类型原生支持，适合存储灵活的站点配置数据
- 数组类型 + GIN 索引，适合模板标签查询
- 性能和功能全面优于 MySQL
- 面试中体现对数据库选型的思考

---

## 附录 B: 后续迭代规划

| 阶段 | 内容 | 预计周期 |
|------|------|----------|
| Phase 1 | 核心骨架：用户认证 + 模板注册 + 站点创建 + 基础构建 | 3 周 |
| Phase 2 | 模板完善：4 个内置模板 + Schema 表单 + 实时预览 | 2 周 |
| Phase 3 | 构建系统：异步构建 + 版本管理 + 回滚 | 2 周 |
| Phase 4 | 生产就绪：Docker 部署 + Nginx 配置 + 域名绑定 | 1 周 |
| Phase 5 | 打磨优化：性能优化 + 安全加固 + 面试文档 | 1 周 |

---

*文档结束。本文档将随开发进展持续更新。*
