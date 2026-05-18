# 前台设计规范 v2.0

**适用范围**：春昌官网 + 个人博客前台  
**文档版本**：v2.0  
**日期**：2026-05-12

---

## 一、两个项目对比定位

| 维度 | 春昌官网 | 个人博客 |
|------|---------|---------|
| **关键词** | 专业、可信赖、大气、商务 | 简洁、温润、阅读友好、个性 |
| **主色** | `#1B6B3A`（深绿） | `#3B82F6`（清蓝） |
| **字体风格** | 无衬线（黑体系）| 正文可用衬线（宋体系）|
| **版面密度** | 信息量较大，区块多 | 留白充足，聚焦阅读 |
| **CTA 强度** | 强（询价、联系按钮突出）| 弱（引导订阅/分享）|
| **动效** | 进入动画、滚动视差 | 轻微淡入即可，不分散注意力 |

---

## 二、通用技术规范

### 2.1 前台技术栈

```
Vue 3 + TypeScript
├── 路由：Vue Router 4
├── 状态：Pinia
├── 构建：Vite
├── CSS：原生 CSS（不引入 UI 框架，保持轻量）
├── 动画：CSS transition + @keyframes + IntersectionObserver
├── Markdown：marked.js + Prism.js（代码高亮）+ DOMPurify（XSS 清理）
└── 图片：懒加载（IntersectionObserver）
```

### 2.2 通用布局容器

```css
/* 内容居中容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 平板端 */
@media (max-width: 1024px) {
  .container { padding: 0 20px; }
}

/* 手机端 */
@media (max-width: 768px) {
  .container { padding: 0 16px; }
}
```

### 2.3 断点系统

```css
/* 手机端：< 768px */
/* 平板竖屏：768px - 1023px */
/* 平板横屏/小桌面：1024px - 1199px */
/* 桌面端：≥ 1200px */
```

---

## 三、春昌官网设计规范

### 3.1 颜色系统

```css
:root {
  /* 品牌色 */
  --cc-primary: #1B6B3A;
  --cc-primary-light: #25884A;
  --cc-primary-dark: #145530;
  --cc-primary-bg: #F0F9F4;

  /* 辅助色（CTA）*/
  --cc-accent: #F5A623;
  --cc-accent-dark: #D68B0F;
  --cc-accent-bg: #FEF9EE;

  /* 文字 */
  --cc-text: #1A2332;
  --cc-text-secondary: #5C6B7D;
  --cc-text-light: #8996A4;

  /* 背景 */
  --cc-bg: #FFFFFF;
  --cc-bg-section: #F7F8FA;
  --cc-bg-dark: #1A2332;  /* 深色区块/页脚 */

  /* 边框 */
  --cc-border: #E5E9EF;

  /* 状态 */
  --cc-success: #22C55E;
}
```

### 3.2 导航栏

**桌面端（≥ 768px）**

```
┌─────────────────────────────────────────────────────────┐
│ [Logo 春昌食品]  首页  关于我们  产品中心  新闻  联系  [☎ 电话] │
└─────────────────────────────────────────────────────────┘
```

- 高度：80px
- 初始：透明背景（适用于 Hero 上方叠加）
- 滚动超过 80px 后：白色背景 + 底部阴影（transition 0.3s）
- Logo：高度 44px，图片
- 菜单：16px，字重 500，颜色 `--cc-text`，hover 变主色
- 右侧电话：主色图标 + 电话号码，醒目展示
- 激活菜单项：主色 + 底部 2px 下划线

**移动端（< 768px）**

- 高度：60px
- 右侧汉堡菜单按钮
- 点击弹出全屏或侧滑菜单（深绿背景，白色文字）

### 3.3 Hero 区块

```
背景图（全屏，1920×600px 最小）
  + 深绿色遮罩（rgba(27, 107, 58, 0.65)）
  + 居中内容区：
      [小标签：春昌食品科技]
      大标题：专注食品科技 / 品质铸就未来
      副标题：16-18px，白色，行高 1.6
      [了解我们 →]（白色边框按钮）[联系我们]（橙色实心按钮）
```

- 最小高度：600px（桌面），400px（手机）
- 动画：标题 fadeInUp 0.6s，副标题 fadeInUp 0.8s delay，按钮 fadeInUp 1s delay

### 3.4 通用区块标题样式

```
小标签（可选）：主色，12px，字间距 2px，大写英文或中文
大标题：32-40px，深色，字重 700，居中
下划装饰线：宽 40px，高 3px，主色，居中
副标题（可选）：16px，次要色，居中，最大宽 600px
```

### 3.5 产品卡片

```
┌─────────────────┐
│                 │  ← 图片区（16:9 或 1:1）
│    产品图片      │     hover 时图片缩放 1.05
│                 │
├─────────────────┤
│ 产品名称         │  16px，粗体
│ 简短描述...      │  14px，灰色，2行截断
│ [查看详情 →]    │  文字链接，主色
└─────────────────┘
```

- 白色背景，圆角 8px，边框 `--cc-border`
- hover：阴影 `0 8px 24px rgba(0,0,0,0.1)` + 上移 -4px

### 3.6 数字成就区

```
┌──────────┬──────────┬──────────┬──────────┐
│   15+    │  500+    │  100+    │   20+    │
│ 年行业经验 │ 合作客户 │  产品种类 │  荣誉奖项 │
└──────────┴──────────┴──────────┴──────────┘
```

- 区块背景：主色 `--cc-primary` 或深色 `--cc-bg-dark`（白色文字）
- 数字：48px，字重 700，白色
- 标签：14px，白色 80% 透明度
- 进入视口时 countUp 动画

### 3.7 按钮规范

| 类型 | 样式 | 使用场景 |
|------|------|---------|
| 主按钮 | 橙色背景 `--cc-accent`，白色文字，圆角 4px | 主 CTA（立即咨询、联系我们）|
| 次按钮 | 主色边框，主色文字，透明背景 | 次要操作（了解更多、查看详情）|
| 白色按钮 | 白色边框，白色文字，透明背景 | Hero 深色背景上 |

- 高度：44-48px（PC），40px（移动）
- 内边距：0 24px
- hover：亮度降低 + 上移 -2px

### 3.8 页脚

```
┌──────────────────────────────────────────────────────┐
│  深色背景 #1A2332，白色文字                            │
│                                                      │
│  [Logo]          关于我们      产品中心    联系我们    │
│  公司简介一行     公司简介      产品系列1   地址：...   │
│  地址：...        发展历程      产品系列2   电话：...   │
│                  企业荣誉      产品系列3   邮箱：...   │
│                                                      │
├──────────────────────────────────────────────────────┤
│  © 2026 山东春昌食品科技有限公司  |  鲁ICP备XXXXXXXX号  │
└──────────────────────────────────────────────────────┘
```

---

## 四、个人博客设计规范

### 4.1 颜色系统

```css
:root {
  /* 主色 */
  --blog-primary: #3B82F6;
  --blog-primary-dark: #2563EB;
  --blog-primary-bg: #EFF6FF;

  /* 文字 */
  --blog-text: #374151;
  --blog-text-secondary: #6B7280;
  --blog-text-light: #9CA3AF;

  /* 背景 */
  --blog-bg: #FFFFFF;
  --blog-bg-card: #F9FAFB;
  --blog-bg-code: #1E293B;

  /* 边框 */
  --blog-border: #E5E7EB;

  /* 标签 */
  --blog-tag-bg: #EFF6FF;
  --blog-tag-text: #2563EB;
}
```

### 4.2 导航栏

**桌面端**

```
┌──────────────────────────────────────────────────┐
│ 📝 博客名       首页  文章  分类  归档  关于   🔍 │
└──────────────────────────────────────────────────┘
```

- 高度：64px
- 白色背景 + 底部 1px 边框
- 滚动后：加阴影
- 搜索：点击图标展开搜索框（行内展开，宽度动画）

### 4.3 文章卡片

```
┌──────────────────────────────────────────────────┐
│ [分类标签]                              [封面图]  │
│ 文章标题（最多2行，18px，700）                    │
│ 摘要文字（最多3行，14px，次要色）                 │
│                                                  │
│ [标签1] [标签2]    日期  ·  预计 5 分钟阅读       │
└──────────────────────────────────────────────────┘
```

- hover：标题变主色，卡片出现浅阴影
- 无封面图时：左侧显示分类色块（纯色条）

### 4.4 文章正文排版

```css
/* 正文容器 */
.article-body {
  max-width: 780px;
  margin: 0 auto;
  font-size: 17px;
  line-height: 1.9;
  color: #374151;
}

/* 标题 */
.article-body h2 { font-size: 26px; margin: 2em 0 0.8em; }
.article-body h3 { font-size: 21px; margin: 1.8em 0 0.7em; }

/* 引用 */
.article-body blockquote {
  border-left: 4px solid #3B82F6;
  background: #F0F7FF;
  padding: 12px 20px;
  margin: 1.5em 0;
  border-radius: 0 6px 6px 0;
}

/* 代码块 */
.article-body pre {
  background: #1E293B;
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
  position: relative; /* 用于复制按钮定位 */
}

/* 行内代码 */
.article-body code:not(pre code) {
  background: #F1F5F9;
  color: #EF4444;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 14px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

/* 图片 */
.article-body img {
  max-width: 100%;
  border-radius: 8px;
  display: block;
  margin: 1.5em auto;
}

/* 表格 */
.article-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
}
.article-body th {
  background: #F3F4F6;
  padding: 10px 14px;
  border: 1px solid #E5E7EB;
}
.article-body td {
  padding: 10px 14px;
  border: 1px solid #E5E7EB;
}
.article-body tr:nth-child(even) td {
  background: #F9FAFB;
}
```

### 4.5 目录（TOC）组件

```
位置：文章正文右侧，sticky top 80px
宽度：220px
最大高度：calc(100vh - 120px)，超出可滚动

样式：
  标题："目录"，12px，灰色，大写
  H2：14px，缩进 0
  H3：13px，缩进 16px
  H4：13px，缩进 32px

激活状态：主色，左侧 2px 竖线
非激活：灰色
hover：主色（轻一些）
```

移动端（< 1024px）：TOC 折叠为可点击的固定按钮，点击展开覆盖面板。

### 4.6 标签样式

```css
.tag {
  display: inline-block;
  padding: 2px 10px;
  background: var(--blog-tag-bg);
  color: var(--blog-tag-text);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}
```

### 4.7 阅读进度条

```css
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #3B82F6, #8B5CF6);
  z-index: 9999;
  transition: width 0.1s ease;
}
```

---

## 五、组件清单

### 5.1 春昌官网组件

| 组件 | 位置 | 说明 |
|------|------|------|
| `AppNav` | 全局 | 导航栏 |
| `HeroBanner` | 首页 | 大图横幅区块 |
| `SectionHeader` | 通用 | 区块标题（小标签+大标题+副标题）|
| `ProductCard` | 产品 | 产品卡片 |
| `NewsCard` | 新闻 | 新闻卡片 |
| `StatsCounter` | 首页 | 数字成就，含 countUp |
| `ContactForm` | 联系 | 在线留言表单 |
| `Timeline` | 关于 | 发展历程时间轴 |
| `ImageLightbox` | 通用 | 图片放大查看 |
| `AppFooter` | 全局 | 页脚 |
| `ScrollReveal` | 通用 | 区块进入视口动画包装器 |

### 5.2 个人博客组件

| 组件 | 位置 | 说明 |
|------|------|------|
| `BlogNav` | 全局 | 博客导航栏（带搜索）|
| `ArticleCard` | 列表 | 文章卡片 |
| `ArticleBody` | 详情 | Markdown 渲染容器 |
| `TableOfContents` | 详情 | 文章目录 |
| `ReadingProgress` | 详情 | 顶部阅读进度条 |
| `CodeBlock` | 详情 | 代码块（含复制按钮）|
| `TagCloud` | 标签页 | 标签词云 |
| `ArchiveTimeline` | 归档 | 时间轴归档 |
| `BlogFooter` | 全局 | 博客页脚 |
| `BackToTop` | 全局 | 返回顶部按钮 |
| `SearchModal` | 全局 | 搜索弹窗 |

---

## 六、开发优先级与迭代计划

### Phase 1（当前）— 春昌官网 · 完整 5 页

**交付目标**：一个完整可上线的企业官网

| 任务 | 优先级 | 估时 |
|------|--------|------|
| 前台路由和布局框架 | P0 | 0.5d |
| 导航栏（含响应式）| P0 | 0.5d |
| 首页所有区块 | P0 | 2d |
| 产品列表 + 详情 | P0 | 1.5d |
| 关于我们 | P0 | 0.5d |
| 新闻列表 + 详情 | P0 | 1d |
| 联系我们（含表单）| P0 | 0.5d |
| 页脚 | P0 | 0.5d |
| 响应式适配 | P0 | 1d |
| SEO meta 对接 | P1 | 0.5d |
| 动效（进入动画）| P1 | 1d |
| **合计** | — | **~9d** |

### Phase 2 — 个人博客 · 完整发布

**交付目标**：可以每天写文章并发布的博客

| 任务 | 优先级 | 估时 |
|------|--------|------|
| 博客首页 | P0 | 1d |
| 文章列表（含筛选）| P0 | 1d |
| 文章详情（Markdown 渲染）| P0 | 2d |
| 目录 TOC + 阅读进度条 | P0 | 1d |
| 归档页 | P1 | 0.5d |
| 分类/标签页 | P1 | 0.5d |
| 关于我 | P1 | 0.5d |
| 搜索功能 | P1 | 1d |
| 后台 Markdown 编辑器优化 | P0 | 1.5d |
| RSS + sitemap | P2 | 0.5d |
| **合计** | — | **~9.5d** |

### Phase 3（后续迭代）

- 春昌官网：招聘页面、在线留言管理
- 博客：评论系统（基于 GitHub Issues 或自建）
- 两个站点共用后台管理，按"站点"维度隔离数据
- 后台写文章体验优化（全屏模式、AI 辅助写作）

---

## 七、数据对接规范

### 7.1 春昌官网 API

| 接口 | 路径 | 说明 |
|------|------|------|
| 网站基础配置 | `GET /api/site-config` | 公司名、Logo、联系信息 |
| 首页配置 | `GET /api/pages/home` | 各区块内容 |
| 产品列表 | `GET /api/products?category=&page=` | 分页列表 |
| 产品详情 | `GET /api/products/:id` | |
| 文章列表（新闻）| `GET /api/articles?type=news&page=` | |
| 文章详情 | `GET /api/articles/:slug` | |
| 提交留言 | `POST /api/messages` | 联系表单 |
| 菜单 | `GET /api/menus` | 导航菜单 |

### 7.2 博客 API

| 接口 | 路径 | 说明 |
|------|------|------|
| 博客配置 | `GET /api/site-config` | 博主信息、社交链接 |
| 文章列表 | `GET /api/articles?category=&tag=&page=` | |
| 文章详情 | `GET /api/articles/:slug` | |
| 分类列表 | `GET /api/categories` | |
| 标签列表 | `GET /api/tags` | |
| 搜索 | `GET /api/articles/search?q=` | |
| 归档 | `GET /api/articles/archive` | 按年月分组 |

---

*文档更新记录：v2.0 (2026-05-12) 重写全文，替代旧版 THEME_DESIGN.md*
