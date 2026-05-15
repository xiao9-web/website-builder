# 个人博客 — 技术设计文档

**版本**：v1.0  
**日期**：2026-05-14  
**状态**：设计阶段  
**关联需求**：`docs/REQUIREMENTS_BLOG.md`

---

## 一、技术栈

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| 框架 | Vue 3.4 + Composition API | `<script setup>` 语法 |
| 语言 | TypeScript 5 | 全量类型检查 |
| 构建工具 | Vite 5 | 开发热更新 + 生产构建 |
| 路由 | Vue Router 4 | Hash / History 模式 |
| 状态管理 | Pinia | 文章缓存、搜索状态 |
| Markdown 渲染 | marked + highlight.js | 代码高亮 |
| 目录生成 | 自定义（解析 H2/H3） | TOC + 滚动高亮 |
| 动画 | CSS Transitions + IntersectionObserver | 无额外依赖 |
| 图标 | CSS emoji / SVG inline | 无图标库依赖 |
| 字体 | 系统字体栈 + Google Fonts（可选） | 首字节无阻塞 |

---

## 二、视觉设计系统

### 2.1 核心风格关键词

> **流光溢彩、色彩斑斓、简洁通透、阅读友好**

参考截图核心特征：
- Hero 区：多色渐变背景（粉→紫→蓝→薰衣草，柔和流动感）
- 内容区：纯白卡片，充足留白
- 导航：细线底部，磨砂玻璃效果
- 侧边栏：轻量卡片，圆角头像

### 2.2 CSS 设计令牌（Design Tokens）

```css
:root {
  /* ── 主色系 ── */
  --primary:        #3B82F6;   /* 蓝，链接/强调 */
  --primary-light:  #EFF6FF;   /* 浅蓝，标签背景 */
  --primary-dark:   #1D4ED8;   /* 深蓝，hover */

  /* ── 文字 ── */
  --text:           #1F2937;   /* 标题/正文 */
  --text-secondary: #6B7280;   /* 摘要/日期 */
  --text-light:     #9CA3AF;   /* 次要信息 */

  /* ── 背景 ── */
  --bg:             #FFFFFF;
  --bg-section:     #F9FAFB;   /* 极浅灰卡片 */
  --bg-code:        #1E293B;   /* 代码块深色背景 */

  /* ── 边框 ── */
  --border:         #E5E7EB;
  --border-light:   #F3F4F6;

  /* ── 流光渐变（Hero 核心） ── */
  --gradient-iridescent: linear-gradient(
    135deg,
    #fce4ec 0%,    /* 玫粉 */
    #ede7f6 20%,   /* 薰衣草紫 */
    #e3f2fd 40%,   /* 天蓝 */
    #f3e5f5 60%,   /* 浅紫 */
    #e8f5e9 80%,   /* 淡绿 */
    #fff9c4 100%   /* 浅黄 */
  );

  /* 动态版（CSS animation，用于 Hero 呼吸感） */
  --gradient-hero-start: #fce4ec;
  --gradient-hero-mid:   #dbeafe;
  --gradient-hero-end:   #ede9fe;

  /* ── 圆角 ── */
  --radius-sm:   6px;
  --radius:      10px;
  --radius-lg:   16px;
  --radius-full: 9999px;

  /* ── 阴影 ── */
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.06);
  --shadow-md:  0 4px 16px rgba(0,0,0,0.08);
  --shadow-lg:  0 12px 40px rgba(0,0,0,0.12);

  /* ── 间距 ── */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 40px;
  --space-2xl: 64px;

  /* ── 导航高度 ── */
  --nav-height: 60px;

  /* ── 文章正文宽度 ── */
  --article-width: 780px;

  /* ── 过渡 ── */
  --transition: 0.2s ease;
}
```

### 2.3 Hero 流光动画

```css
/* 多色渐变背景 + 缓慢位移动画 */
.hero-bg {
  background: linear-gradient(
    -45deg,
    #fce4ec, #ede7f6, #dbeafe, #ecfdf5, #fef9c3, #fce7f3
  );
  background-size: 400% 400%;
  animation: iridescent 12s ease infinite;
}

@keyframes iridescent {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### 2.4 字体系统

```css
/* 界面字体 */
body {
  font-family: -apple-system, BlinkMacSystemFont,
    'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', 'Helvetica Neue', sans-serif;
}

/* 文章正文（宋体系，提升长文阅读舒适度） */
.article-body {
  font-family: 'Georgia', 'Noto Serif SC',
    'Source Han Serif SC', 'STSong', serif;
  font-size: 17px;
  line-height: 1.9;
}

/* 代码 */
code, pre {
  font-family: 'JetBrains Mono', 'Fira Code',
    'Cascadia Code', Consolas, monospace;
  font-size: 14px;
}
```

---

## 三、路由结构

```
/                          → 首页（Home）
/articles                  → 文章列表（Articles）
/articles/:slug            → 文章详情（ArticleDetail）
/categories                → 分类页（Categories）
/categories/:name          → 分类文章列表
/tags                      → 标签页（Tags）
/tags/:name                → 标签文章列表
/archive                   → 归档（Archive）
/about                     → 关于我（About）
```

```typescript
// router/index.ts
const routes = [
  { path: '/',                      component: () => import('../views/Home.vue') },
  { path: '/articles',              component: () => import('../views/Articles.vue') },
  { path: '/articles/:slug',        component: () => import('../views/ArticleDetail.vue') },
  { path: '/categories',            component: () => import('../views/Categories.vue') },
  { path: '/categories/:name',      component: () => import('../views/ArticlesByCategory.vue') },
  { path: '/tags',                  component: () => import('../views/Tags.vue') },
  { path: '/tags/:name',            component: () => import('../views/ArticlesByTag.vue') },
  { path: '/archive',               component: () => import('../views/Archive.vue') },
  { path: '/about',                 component: () => import('../views/About.vue') },
  { path: '/:pathMatch(.*)*',       redirect: '/' },
]
```

---

## 四、页面详细设计

### 4.1 首页（Home）

```
┌─────────────────────────────────────────────────────────┐
│ 导航栏：Logo + 菜单 + 搜索图标（透明→磨砂玻璃效果）       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  【Hero 区 - 流光斑斓渐变背景，高度 500-600px】           │
│                                                         │
│     ┌──────────────────────────────────────┐            │
│     │  圆形头像（96px）                     │            │
│     │  博主名字（36px，加粗）               │            │
│     │  一句话简介（16px，灰色）             │            │
│     │  社交图标（GitHub / 掘金 / Email）    │            │
│     │  [浏览文章] [关于我]  两个按钮        │            │
│     └──────────────────────────────────────┘            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  最新文章（主体）                 │  侧边栏              │
│                                  │                      │
│  精选文章（大卡片，渐变封面）      │  作者卡片            │
│                                  │  ─────              │
│  最新文章列表（卡片）             │  标签云              │
│   ┌────────────────────────┐    │  ─────              │
│   │ 标题（加粗）            │    │  分类列表            │
│   │ 摘要（2行，灰色）       │    │  ─────              │
│   │ 分类 · 标签 · 日期      │    │  归档统计            │
│   └────────────────────────┘    │                      │
│                                  │                      │
│  [查看全部文章]                   │                      │
├─────────────────────────────────────────────────────────┤
│  页脚：版权 + ICP 备案                                   │
└─────────────────────────────────────────────────────────┘
```

**关键交互**：
- Hero 背景渐变动画（12s 循环，缓慢流动）
- 文章卡片 hover：向上 4px + 阴影加深
- 导航栏滚动后：`backdrop-filter: blur(12px)` 磨砂玻璃

---

### 4.2 文章列表页（Articles）

```
┌──────────────────────────────────────────────────────┐
│ 页面标题区（小型流光渐变背景，高度 200px）              │
│   "全部文章"  ·  共 XX 篇                             │
├──────────────────────────────────────────────────────┤
│ 搜索框 + 分类筛选 Tab                                 │
├───────────────────────────┬──────────────────────────┤
│                           │                          │
│  文章卡片列表（单列）       │  侧边栏（同首页）         │
│  ┌─────────────────────┐  │                          │
│  │ 封面色块 + 日期       │  │  作者卡 / 标签 / 分类    │
│  │ 分类标签             │  │                          │
│  │ 标题（大，加粗）      │  │                          │
│  │ 摘要（3行）          │  │                          │
│  │ 标签 · 阅读时长      │  │                          │
│  └─────────────────────┘  │                          │
│                           │                          │
│  分页组件                  │                          │
└───────────────────────────┴──────────────────────────┘
```

---

### 4.3 文章详情页（ArticleDetail）— 核心页面

```
┌──────────────────────────────────────────────────────┐
│ 导航（固定）+ 阅读进度条（顶部蓝色细线）               │
├──────────────────────────────────────────────────────┤
│ 文章头部（流光渐变背景）                               │
│   面包屑导航                                          │
│   分类标签                                            │
│   文章标题（大，居中，最大 720px）                     │
│   日期 · 分类 · 阅读时长 · 阅读量                     │
├──────────────────────────────────────────────────────┤
│                              │                        │
│  文章正文                    │  TOC 目录（sticky）     │
│  ─────────────────────────  │  ─ H2：背景介绍         │
│  最大宽度 780px              │  ─ H2：重要意义         │
│  衬线字体，17px，行高 1.9    │     ─ H3：子标题        │
│                              │  ─ H2：未来展望         │
│  代码块（深色背景）           │  ────────────          │
│  ┌──────────────────────┐   │  作者信息卡             │
│  │ language  [复制]      │   │                        │
│  │ const x = 1;         │   │                        │
│  └──────────────────────┘   │                        │
│                              │                        │
│  引用块（左竖线）             │                        │
│  表格（带斑马纹）             │                        │
│                              │                        │
├──────────────────────────────┴────────────────────────┤
│  文章标签 · 分享按钮                                   │
│  上一篇 / 下一篇                                      │
│  相关文章（同分类 3 篇）                               │
└──────────────────────────────────────────────────────┘
```

**阅读进度条实现**：
```typescript
// 监听 scroll，计算页面读取百分比
const scrollProgress = computed(() => {
  const scrolled = window.scrollY
  const total = document.body.scrollHeight - window.innerHeight
  return Math.min((scrolled / total) * 100, 100)
})
```

**TOC 滚动高亮实现**：
```typescript
// IntersectionObserver 监听各标题
// 当 H2/H3 进入视口时，对应 TOC 项高亮
```

---

### 4.4 归档页（Archive）

```
2026 年  (12 篇)
  ▼ 5 月
      2026-05-14  ●  Vue 3 组合式函数最佳实践
      2026-05-12  ●  TypeScript 类型体操进阶
  ▼ 4 月
      2026-04-28  ●  从零搭建 NestJS 后端
2025 年  (36 篇)
  ▶ 12 月  (收起)
  ...
```

样式：左侧彩色时间轴竖线（渐变色），年份折叠展开动画。

---

### 4.5 标签页（Tags）

标签云展示，字号 12-24px 根据文章数比例计算，颜色使用 HSL 随机色相（但固定饱和度/亮度保证可读性）：

```typescript
const tagFontSize = (count: number, max: number) =>
  12 + Math.round((count / max) * 12)

const tagColor = (index: number) =>
  `hsl(${(index * 37) % 360}, 70%, 45%)`
```

---

### 4.6 关于我（About）

```
┌──────────────────────────────────────────┐
│ 流光渐变背景（同首页 Hero，高度 300px）    │
│   圆形头像 + 名字 + 职位                  │
│   社交链接图标                            │
├──────────────────────────────────────────┤
│ 个人简介（Markdown 渲染，最大宽度 760px） │
├──────────────────────────────────────────┤
│ 技术栈（图标网格，按前端/后端/工具分组）   │
├──────────────────────────────────────────┤
│ 工作经历（时间轴）                        │
├──────────────────────────────────────────┤
│ 开源项目卡片                              │
└──────────────────────────────────────────┘
```

---

## 五、组件架构

```
src/
├── App.vue                      # 根组件：导航 + 路由出口 + 页脚
├── components/
│   ├── NavBar.vue               # 导航栏（磨砂玻璃 + 滚动效果）
│   ├── Footer.vue               # 页脚
│   ├── HeroBg.vue               # 流光渐变背景（可复用）
│   ├── ArticleCard.vue          # 文章卡片（列表页使用）
│   ├── ArticleFeatured.vue      # 精选文章大卡片
│   ├── Sidebar.vue              # 右侧侧边栏（作者/标签/分类/归档）
│   ├── TagBadge.vue             # 标签徽章
│   ├── ReadingProgress.vue      # 顶部阅读进度条
│   ├── TableOfContents.vue      # 文章目录（TOC）
│   ├── CodeBlock.vue            # 代码块（语言名 + 复制按钮）
│   ├── BackToTop.vue            # 返回顶部浮动按钮
│   ├── ArticleNav.vue           # 上一篇/下一篇
│   └── Pagination.vue           # 分页组件
├── views/
│   ├── Home.vue
│   ├── Articles.vue
│   ├── ArticleDetail.vue
│   ├── Categories.vue
│   ├── Tags.vue
│   ├── Archive.vue
│   └── About.vue
├── stores/
│   └── blog.ts                  # Pinia：文章列表、搜索状态、当前文章
├── composables/
│   ├── useScrollProgress.ts     # 阅读进度
│   ├── useTOC.ts               # 目录生成与高亮
│   ├── useReadingTime.ts       # 预计阅读时长计算
│   └── useReveal.ts            # IntersectionObserver 滚动动画
├── utils/
│   ├── markdown.ts              # Markdown 解析（marked + highlight.js）
│   └── date.ts                  # 日期格式化工具
└── router/
    └── index.ts
```

---

## 六、数据模型（Mock 阶段）

### 文章（Article）

```typescript
interface Article {
  id: number
  slug: string             // URL 标识，如 "vue3-best-practices"
  title: string
  summary: string          // 摘要（约 120 字）
  content: string          // Markdown 正文
  category: string         // 分类名
  tags: string[]           // 标签数组
  coverColor: string       // 封面渐变（无图时显示色块）
  coverEmoji?: string      // 封面 emoji（视觉替代）
  date: string             // "2026-05-14"
  views: number            // 阅读量
  readingTime: number      // 预计阅读分钟数
  featured?: boolean       // 是否精选/置顶
}
```

### 分类（Category）

```typescript
interface Category {
  name: string
  count: number
  color: string            // 分类色（用于标签徽章）
  description: string
}
```

### 作者配置（Author）

```typescript
interface Author {
  name: string
  avatar: string           // 头像 URL 或 emoji
  bio: string              // 一句话简介
  location: string
  github: string
  email: string
  juejin?: string
  wechat?: string
}
```

---

## 七、关键交互实现方案

### 7.1 导航栏磨砂玻璃效果

```css
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  height: var(--nav-height);
  transition: all var(--transition);
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
}
```

### 7.2 代码块一键复制

```typescript
const copyCode = async (code: string) => {
  await navigator.clipboard.writeText(code)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
```

### 7.3 文章目录（TOC）生成

```typescript
// 解析文章 Markdown 中的 ## 和 ### 标题
const parseTOC = (content: string) => {
  const lines = content.split('\n')
  return lines
    .filter(l => /^#{2,3}\s/.test(l))
    .map(l => ({
      level: l.match(/^#+/)?.[0].length ?? 2,
      text: l.replace(/^#+\s/, ''),
      id: l.replace(/^#+\s/, '').toLowerCase().replace(/\s/g, '-')
    }))
}
```

### 7.4 阅读时长计算

```typescript
const calcReadingTime = (content: string) => {
  const words = content.replace(/[^a-zA-Z一-龥]/g, '').length
  return Math.max(1, Math.ceil(words / 200))   // 200字/分钟
}
```

---

## 八、响应式断点

| 断点 | 宽度 | 变化 |
|------|------|------|
| Desktop | > 1280px | 双栏（主体 + 侧边栏） |
| Laptop | 1024-1280px | 双栏，侧边栏变窄 |
| Tablet | 768-1024px | 单栏，侧边栏隐藏 |
| Mobile | < 768px | 单栏，汉堡菜单，字号缩小 |

```css
/* 主容器最大宽度 */
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

/* 文章正文 */
@media (max-width: 1024px) {
  .article-sidebar { display: none; }
  .article-layout { grid-template-columns: 1fr; }
}

/* 移动端 */
@media (max-width: 768px) {
  .nav-menu { display: none; }
  .hamburger { display: flex; }
  .hero-title { font-size: 28px; }
}
```

---

## 九、文件目录结构（完整）

```
blog/                         ← 博客项目根目录
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── src/
    ├── main.ts
    ├── App.vue
    ├── style.css             ← 全局样式 + CSS 变量
    ├── router/
    │   └── index.ts
    ├── stores/
    │   └── blog.ts
    ├── composables/
    │   ├── useScrollProgress.ts
    │   ├── useTOC.ts
    │   ├── useReadingTime.ts
    │   └── useReveal.ts
    ├── utils/
    │   ├── markdown.ts
    │   └── date.ts
    ├── data/
    │   ├── articles.ts       ← Mock 文章数据（原型阶段）
    │   ├── categories.ts     ← Mock 分类
    │   └── author.ts         ← Mock 作者信息
    ├── components/
    │   ├── NavBar.vue
    │   ├── Footer.vue
    │   ├── HeroBg.vue
    │   ├── ArticleCard.vue
    │   ├── ArticleFeatured.vue
    │   ├── Sidebar.vue
    │   ├── TagBadge.vue
    │   ├── ReadingProgress.vue
    │   ├── TableOfContents.vue
    │   ├── CodeBlock.vue
    │   ├── BackToTop.vue
    │   ├── ArticleNav.vue
    │   └── Pagination.vue
    └── views/
        ├── Home.vue
        ├── Articles.vue
        ├── ArticleDetail.vue
        ├── Categories.vue
        ├── Tags.vue
        ├── Archive.vue
        └── About.vue
```

---

## 十、实现阶段规划

### Phase 1 — 静态视觉原型（当前阶段）

| 优先级 | 页面/组件 | 关键效果 |
|--------|---------|---------|
| P0 | 首页 | 流光渐变 Hero + 文章列表 + 侧边栏 |
| P0 | 文章详情 | Markdown 渲染 + TOC + 进度条 |
| P0 | 导航 + 页脚 | 磨砂玻璃效果 |
| P1 | 文章列表页 | 搜索 + 分类筛选（前端过滤） |
| P1 | 归档页 | 时间轴 + 折叠动画 |
| P1 | 标签云 + 分类页 | 词云样式 |
| P2 | 关于我 | 技术栈 + 时间轴 |

### Phase 2 — 接入真实 API

- 替换 `src/data/*.ts` Mock 数据为 API 调用
- 接入后台 Markdown 编辑器
- 阅读量统计
- 搜索接入后端全文检索

---

## 十一、与官网的差异对比

| 维度 | 春昌官网 | 个人博客 |
|------|---------|---------|
| 主色 | 墨绿 `#1B6B3A` | 蓝 `#3B82F6` |
| Hero 风格 | 深绿渐变，商务感 | 多色流光，文艺感 |
| 正文字体 | 无衬线（黑体系）| 衬线（宋体系）|
| 布局 | 全宽营销页 | 内容+侧边栏 |
| 核心体验 | 产品展示、品牌信任 | 阅读舒适、内容发现 |
| 动效 | 滚动reveal | reveal + 进度条 + TOC高亮 |

---

*文档版本：v1.0 (2026-05-14)*
