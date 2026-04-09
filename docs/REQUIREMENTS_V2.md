# 主题化内容管理系统 - 需求文档 v2.0

## 📋 产品定位

**产品名称**：主题化内容管理系统（Theme-based CMS）

**核心价值**：通过主题切换，让一套系统同时支持个人博客和企业官网

**目标用户**：不懂代码的内容维护人员

**核心理念**：内容与展示分离，维护内容，切换主题

---

## 🎯 核心功能（MVP - 2周）

### 1. 主题系统

#### 1.1 预设主题
- **博客主题**：适合个人博客、技术文档
  - 首页：最新文章列表 + 推荐文章
  - 文章列表页：分类、标签筛选
  - 文章详情页：Markdown渲染、代码高亮、目录导航

- **企业主题**：适合公司官网、产品展示
  - 首页：轮播图 + 视频介绍 + 产品展示 + 联系方式
  - 产品列表页：产品卡片展示
  - 关于我们页：公司介绍、团队展示
  - 联系我们页：联系表单、地图

#### 1.2 主题切换
- 后台一键切换主题
- 切换后前端立即生效
- 内容数据不变，只改变展示样式

### 2. 内容管理（已有，需优化）

#### 2.1 文章管理
- ✅ 已实现：CRUD、分类、标签
- 🔧 需优化：Markdown编辑器、代码高亮预览

#### 2.2 菜单管理
- ✅ 已实现：CRUD、拖拽排序
- ✅ 保持现状

#### 2.3 媒体库（新增）
- 图片上传（支持拖拽）
- 视频上传
- 文件管理（删除、重命名）
- 图片预览和选择器

### 3. 页面配置器（核心新功能）

#### 3.1 首页配置（表单式，不是拖拽）

**博客主题首页配置**：
```
- 网站标题
- 网站描述
- 头像/Logo
- 社交媒体链接（GitHub、Twitter等）
- 推荐文章（手动选择3-5篇）
```

**企业主题首页配置**：
```
- 轮播图区域
  - 图片1-5（上传图片、设置链接）
  - 自动播放开关
  - 播放间隔

- 视频介绍区
  - 区域标题
  - 视频文件（上传或URL）
  - 描述文字

- 产品展示区
  - 区域标题
  - 选择展示的产品（从产品列表选择）
  - 展示数量（3/6/9）

- 联系方式区
  - 公司地址
  - 联系电话
  - 邮箱
  - 地图坐标（可选）
```

#### 3.2 配置界面设计
- 左侧：配置表单
- 右侧：实时预览
- 底部：保存、预览、发布按钮

### 4. 产品管理（新增）

**字段**：
- 产品名称
- 产品图片
- 产品描述
- 产品详情（富文本）
- 产品分类
- 价格（可选）
- 状态（上架/下架）

**功能**：
- CRUD
- 图片上传
- 排序

---

## 🗄️ 数据库设计

### 新增表

#### 1. themes（主题表）
```sql
CREATE TABLE themes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,        -- 主题标识：blog, enterprise
  display_name VARCHAR(100) NOT NULL,      -- 显示名称：博客主题、企业主题
  description TEXT,                        -- 主题描述
  preview_image VARCHAR(255),              -- 预览图
  is_active BOOLEAN DEFAULT FALSE,         -- 是否启用
  config JSON,                             -- 主题配置（颜色、字体等）
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. page_configs（页面配置表）
```sql
CREATE TABLE page_configs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  theme_id INT NOT NULL,                   -- 关联主题
  page_type VARCHAR(50) NOT NULL,          -- 页面类型：home, about, contact
  config JSON NOT NULL,                    -- 页面配置数据
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (theme_id) REFERENCES themes(id),
  UNIQUE KEY (theme_id, page_type)
);
```

#### 3. products（产品表）
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  description TEXT,
  content TEXT,                            -- 详细介绍
  category VARCHAR(100),
  price DECIMAL(10, 2),
  status ENUM('active', 'inactive') DEFAULT 'active',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 4. media（媒体库表）
```sql
CREATE TABLE media (
  id INT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL,          -- image, video
  mime_type VARCHAR(100),
  file_size INT,
  width INT,                               -- 图片宽度
  height INT,                              -- 图片高度
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 修改现有表

#### pages 表（保持不变）
- 用于自定义页面（关于我们、联系我们等）
- `layout_config` 字段暂时保留，后续可能废弃

---

## 📐 技术架构

### 后端（NestJS）

#### 新增模块
```
server/src/
├── theme/                    # 主题模块
│   ├── theme.entity.ts
│   ├── theme.service.ts
│   ├── theme.controller.ts
│   └── dto/
├── page-config/              # 页面配置模块
│   ├── page-config.entity.ts
│   ├── page-config.service.ts
│   ├── page-config.controller.ts
│   └── dto/
├── product/                  # 产品模块
│   ├── product.entity.ts
│   ├── product.service.ts
│   ├── product.controller.ts
│   └── dto/
└── media/                    # 媒体库模块
    ├── media.entity.ts
    ├── media.service.ts
    ├── media.controller.ts
    └── dto/
```

#### API 设计

**主题相关**：
- `GET /themes` - 获取所有主题
- `GET /themes/active` - 获取当前启用的主题
- `POST /themes/:id/activate` - 激活主题

**页面配置相关**：
- `GET /page-configs/:themeId/:pageType` - 获取页面配置
- `PUT /page-configs/:themeId/:pageType` - 更新页面配置

**产品相关**：
- `GET /products` - 获取产品列表
- `POST /products` - 创建产品
- `PUT /products/:id` - 更新产品
- `DELETE /products/:id` - 删除产品

**媒体库相关**：
- `POST /media/upload` - 上传文件
- `GET /media` - 获取媒体列表
- `DELETE /media/:id` - 删除文件

### 前端（Vue3）

#### 管理后台新增页面
```
admin/src/views/
├── theme/
│   └── index.vue             # 主题管理（切换主题）
├── page-config/
│   ├── home.vue              # 首页配置
│   ├── about.vue             # 关于页配置
│   └── contact.vue           # 联系页配置
├── product/
│   ├── index.vue             # 产品列表
│   └── edit.vue              # 产品编辑
└── media/
    └── index.vue             # 媒体库
```

#### 前端展示新增
```
frontend/src/
├── themes/                   # 主题目录
│   ├── blog/                 # 博客主题
│   │   ├── Home.vue
│   │   ├── ArticleList.vue
│   │   └── ArticleDetail.vue
│   └── enterprise/           # 企业主题
│       ├── Home.vue
│       ├── ProductList.vue
│       ├── About.vue
│       └── Contact.vue
└── composables/
    └── useTheme.ts           # 主题切换逻辑
```

---

## 📅 开发计划（2周）

### Week 1：后端 + 数据库

#### Day 1-2：数据库和基础模块
- [ ] 创建新表（themes, page_configs, products, media）
- [ ] 实现 Theme 模块（Entity, Service, Controller）
- [ ] 实现 PageConfig 模块
- [ ] 插入初始主题数据

#### Day 3-4：产品和媒体模块
- [ ] 实现 Product 模块
- [ ] 实现 Media 模块（文件上传）
- [ ] 测试所有 API

#### Day 5：API 联调和优化
- [ ] 完善错误处理
- [ ] 添加数据验证
- [ ] 编写 API 文档

### Week 2：前端实现

#### Day 6-7：管理后台
- [ ] 主题管理页面（切换主题）
- [ ] 首页配置器（博客主题）
- [ ] 首页配置器（企业主题）
- [ ] 产品管理页面

#### Day 8-9：前端展示
- [ ] 博客主题实现（3个页面）
- [ ] 企业主题实现（4个页面）
- [ ] 主题切换逻辑
- [ ] 数据渲染

#### Day 10：测试和优化
- [ ] 端到端测试
- [ ] 样式优化
- [ ] 响应式适配
- [ ] Bug 修复

---

## ✅ 验收标准

### 功能验收
1. ✅ 可以在后台切换主题，前端立即生效
2. ✅ 博客主题：可以发布文章，前端正常展示
3. ✅ 企业主题：可以配置首页（轮播图、视频、产品），前端正常展示
4. ✅ 可以管理产品（增删改查）
5. ✅ 可以上传图片和视频

### 质量验收
1. ✅ 所有 API 有错误处理
2. ✅ 前端有 loading 状态
3. ✅ 移动端适配良好
4. ✅ 代码有基本注释

---

## 🚫 不做的功能（避免范围蔓延）

1. ❌ 拖拽编辑器
2. ❌ 自定义 CSS
3. ❌ 版本回退
4. ❌ 草稿自动保存
5. ❌ 多人协作
6. ❌ 部署到 OSS（第二阶段）
7. ❌ SEO 优化（第二阶段）
8. ❌ 评论系统（第二阶段）
9. ❌ 搜索功能（第二阶段）

---

## 📝 后续规划（第二阶段）

1. 增加 3-5 个行业主题
2. 主题市场（预览、下载）
3. 部署到阿里云 OSS
4. SEO 优化
5. 性能优化
