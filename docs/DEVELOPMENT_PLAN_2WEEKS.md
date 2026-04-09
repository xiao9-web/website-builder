# 2周开发计划 - 详细任务清单

## 📅 总览

**开始日期**：2026-04-08
**结束日期**：2026-04-22
**工作日**：10天
**目标**：完成主题化CMS的MVP版本

---

## Week 1：后端开发 + 数据库（Day 1-5）

### Day 1（2026-04-08）：数据库设计和主题模块

#### 上午（4h）
- [x] 阅读新需求文档 `REQUIREMENTS_V2.md`
- [ ] 创建数据库迁移文件
  - `themes` 表
  - `page_configs` 表
  - `products` 表
  - `media` 表
- [ ] 插入初始主题数据（blog, enterprise）

#### 下午（4h）
- [ ] 创建 Theme 模块
  - `server/src/theme/theme.entity.ts`
  - `server/src/theme/theme.service.ts`
  - `server/src/theme/theme.controller.ts`
  - `server/src/theme/dto/`
- [ ] 实现主题相关 API
  - `GET /themes` - 获取所有主题
  - `GET /themes/active` - 获取当前启用主题
  - `POST /themes/:id/activate` - 激活主题
- [ ] 测试主题 API

**交付物**：
- ✅ 数据库表创建完成
- ✅ 主题模块 API 可用

---

### Day 2（2026-04-09）：页面配置模块

#### 上午（4h）
- [ ] 创建 PageConfig 模块
  - `server/src/page-config/page-config.entity.ts`
  - `server/src/page-config/page-config.service.ts`
  - `server/src/page-config/page-config.controller.ts`
  - `server/src/page-config/dto/`
- [ ] 定义页面配置的 JSON Schema
  - 博客主题首页配置
  - 企业主题首页配置

#### 下午（4h）
- [ ] 实现页面配置 API
  - `GET /page-configs/:themeId/:pageType`
  - `PUT /page-configs/:themeId/:pageType`
  - `POST /page-configs/:themeId/:pageType`
- [ ] 插入默认页面配置数据
- [ ] 测试页面配置 API

**交付物**：
- ✅ 页面配置模块完成
- ✅ 可以保存和读取配置

---

### Day 3（2026-04-10）：产品模块

#### 上午（4h）
- [ ] 创建 Product 模块
  - `server/src/product/product.entity.ts`
  - `server/src/product/product.service.ts`
  - `server/src/product/product.controller.ts`
  - `server/src/product/dto/create-product.dto.ts`
  - `server/src/product/dto/update-product.dto.ts`

#### 下午（4h）
- [ ] 实现产品 CRUD API
  - `GET /products` - 获取产品列表（支持分页、筛选）
  - `GET /products/:id` - 获取产品详情
  - `POST /products` - 创建产品
  - `PUT /products/:id` - 更新产品
  - `DELETE /products/:id` - 删除产品
  - `PATCH /products/:id/sort` - 更新排序
- [ ] 测试产品 API
- [ ] 插入测试产品数据（3-5个）

**交付物**：
- ✅ 产品模块完成
- ✅ 产品 CRUD 可用

---

### Day 4（2026-04-11）：媒体库模块

#### 上午（4h）
- [ ] 创建 Media 模块
  - `server/src/media/media.entity.ts`
  - `server/src/media/media.service.ts`
  - `server/src/media/media.controller.ts`
  - `server/src/media/dto/`
- [ ] 配置文件上传
  - 使用 multer
  - 配置上传目录
  - 文件大小限制（图片10MB，视频100MB）

#### 下午（4h）
- [ ] 实现媒体库 API
  - `POST /media/upload` - 上传文件（支持多文件）
  - `GET /media` - 获取媒体列表（分页、类型筛选）
  - `GET /media/:id` - 获取媒体详情
  - `DELETE /media/:id` - 删除文件
- [ ] 实现图片处理
  - 生成缩略图
  - 获取图片尺寸
- [ ] 测试媒体库 API

**交付物**：
- ✅ 媒体库模块完成
- ✅ 可以上传和管理文件

---

### Day 5（2026-04-12）：后端优化和文档

#### 上午（4h）
- [ ] 完善错误处理
  - 统一错误响应格式
  - 添加错误日志
- [ ] 添加数据验证
  - DTO 验证规则
  - 文件类型验证
- [ ] 优化查询性能
  - 添加必要的索引
  - 优化关联查询

#### 下午（4h）
- [ ] 编写 API 文档
  - 使用 Swagger 自动生成
  - 添加接口说明和示例
- [ ] 端到端测试
  - 测试所有 API 流程
  - 修复发现的 Bug
- [ ] 代码审查和重构

**交付物**：
- ✅ 后端代码质量达标
- ✅ API 文档完整
- ✅ 所有 API 测试通过

---

## Week 2：前端开发（Day 6-10）

### Day 6（2026-04-15）：管理后台 - 主题和媒体库

#### 上午（4h）
- [ ] 创建主题管理页面
  - `admin/src/views/theme/index.vue`
  - 显示所有主题（卡片式）
  - 当前主题高亮显示
  - 切换主题按钮
- [ ] 实现主题切换功能
  - 调用 API 激活主题
  - 切换成功提示
  - 刷新页面状态

#### 下午（4h）
- [ ] 创建媒体库页面
  - `admin/src/views/media/index.vue`
  - 文件上传（拖拽上传）
  - 文件列表（网格/列表视图）
  - 文件预览
  - 文件删除
- [ ] 创建媒体选择器组件
  - `admin/src/components/MediaPicker.vue`
  - 弹窗式选择
  - 支持单选/多选

**交付物**：
- ✅ 可以切换主题
- ✅ 可以上传和管理媒体文件

---

### Day 7（2026-04-16）：管理后台 - 产品管理

#### 上午（4h）
- [ ] 创建产品列表页面
  - `admin/src/views/product/index.vue`
  - 产品列表（表格）
  - 搜索和筛选
  - 排序拖拽
  - 删除确认

#### 下午（4h）
- [ ] 创建产品编辑页面
  - `admin/src/views/product/edit.vue`
  - 产品表单（名称、描述、价格等）
  - 图片上传（使用 MediaPicker）
  - 富文本编辑器（产品详情）
  - 保存和发布
- [ ] 测试产品管理流程

**交付物**：
- ✅ 产品管理功能完整

---

### Day 8（2026-04-17）：管理后台 - 页面配置器

#### 上午（4h）
- [ ] 创建博客主题首页配置
  - `admin/src/views/page-config/blog-home.vue`
  - 网站标题、描述
  - 头像上传
  - 社交媒体链接
  - 推荐文章选择
  - 实时预览

#### 下午（4h）
- [ ] 创建企业主题首页配置
  - `admin/src/views/page-config/enterprise-home.vue`
  - 轮播图配置（图片、链接）
  - 视频介绍配置
  - 产品展示配置（选择产品）
  - 联系方式配置
  - 实时预览

**交付物**：
- ✅ 首页配置器完成
- ✅ 可以配置两个主题的首页

---

### Day 9（2026-04-18）：前端展示 - 主题实现

#### 上午（4h）
- [ ] 实现博客主题
  - `frontend/src/themes/blog/Home.vue` - 首页
  - `frontend/src/themes/blog/ArticleList.vue` - 文章列表
  - `frontend/src/themes/blog/ArticleDetail.vue` - 文章详情
  - 样式设计（简洁、现代）

#### 下午（4h）
- [ ] 实现企业主题
  - `frontend/src/themes/enterprise/Home.vue` - 首页
    - 轮播图组件
    - 视频介绍组件
    - 产品展示组件
    - 联系方式组件
  - `frontend/src/themes/enterprise/ProductList.vue` - 产品列表
  - `frontend/src/themes/enterprise/About.vue` - 关于我们
  - `frontend/src/themes/enterprise/Contact.vue` - 联系我们
  - 样式设计（专业、大气）

**交付物**：
- ✅ 两个主题的前端页面完成

---

### Day 10（2026-04-19）：主题切换逻辑 + 测试优化

#### 上午（4h）
- [ ] 实现主题切换逻辑
  - `frontend/src/composables/useTheme.ts`
  - 获取当前主题
  - 动态加载主题组件
  - 路由配置
- [ ] 实现数据渲染
  - 从 API 获取页面配置
  - 渲染配置数据
  - 处理空数据状态

#### 下午（4h）
- [ ] 端到端测试
  - 测试主题切换流程
  - 测试内容管理流程
  - 测试前端展示
- [ ] 样式优化
  - 响应式适配（移动端）
  - 细节调整
- [ ] Bug 修复
- [ ] 代码整理和注释

**交付物**：
- ✅ 完整的主题切换功能
- ✅ 所有功能测试通过
- ✅ MVP 版本完成

---

## 📋 每日检查清单

### 开发前
- [ ] 拉取最新代码
- [ ] 查看今日任务
- [ ] 启动开发环境（数据库、后端、前端）

### 开发中
- [ ] 按照任务清单逐项完成
- [ ] 及时提交代码（小步提交）
- [ ] 遇到问题记录下来

### 开发后
- [ ] 测试今日完成的功能
- [ ] 提交代码并写清楚 commit message
- [ ] 更新任务状态
- [ ] 记录明日待办

---

## 🎯 里程碑

### M1：后端完成（Day 5）
- ✅ 所有 API 开发完成
- ✅ API 文档完整
- ✅ 测试通过

### M2：管理后台完成（Day 8）
- ✅ 主题管理
- ✅ 产品管理
- ✅ 媒体库
- ✅ 页面配置器

### M3：前端展示完成（Day 10）
- ✅ 博客主题
- ✅ 企业主题
- ✅ 主题切换
- ✅ MVP 上线

---

## 🚨 风险和应对

### 风险1：时间不够
**应对**：
- 优先完成核心功能
- 样式可以简化
- 部分功能可以延后

### 风险2：技术难点
**应对**：
- 提前调研技术方案
- 遇到问题及时求助
- 降低复杂度

### 风险3：需求变更
**应对**：
- 严格按照需求文档开发
- 新需求记录到 backlog
- 不在开发中途改需求

---

## 📝 开发规范

### Git 提交规范
```
feat: 添加产品管理模块
fix: 修复主题切换bug
docs: 更新API文档
style: 优化首页样式
refactor: 重构媒体库代码
test: 添加产品模块测试
```

### 代码规范
- TypeScript 严格模式
- ESLint 检查通过
- 函数不超过50行
- 必要的注释

### 测试规范
- 每个 API 手动测试
- 关键功能写单元测试
- 前端功能浏览器测试

---

## 📞 需要帮助时

如果遇到问题，按以下顺序处理：
1. 查看文档和代码注释
2. Google 搜索错误信息
3. 查看项目的 issues
4. 向 AI 助手求助（描述清楚问题）

---

## ✅ 完成标准

### 功能完成
- [ ] 可以切换主题，前端立即生效
- [ ] 可以配置博客主题首页
- [ ] 可以配置企业主题首页
- [ ] 可以管理产品
- [ ] 可以上传媒体文件
- [ ] 前端正常展示内容

### 质量完成
- [ ] 代码有注释
- [ ] 没有明显 Bug
- [ ] 移动端基本可用
- [ ] 加载速度可接受

### 文档完成
- [ ] API 文档完整
- [ ] README 更新
- [ ] 使用说明更新
