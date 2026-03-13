# 快速启动指南

## 🚀 5分钟快速上手

### 第一步：了解项目结构

```bash
website-builder/
├── admin/          # 后台管理系统（Vue3 + Element Plus）
├── frontend/       # 官网前端（Vue3 + Tailwind CSS）
├── server/         # 后端服务（NestJS + TypeORM）
├── docs/           # 项目文档
│   ├── PROJECT_PLAN.md          # 📋 项目计划和任务清单
│   ├── AI_COLLABORATION.md      # 🤖 AI协作指南
│   ├── DEV_STANDARDS.md         # 📐 开发规范
│   ├── QUICK_START.md           # 🚀 本文档
│   └── architecture.md          # 🏗️ 架构设计
└── docker/         # Docker配置
```

### 第二步：查看当前任务

打开 [PROJECT_PLAN.md](./PROJECT_PLAN.md) 查看：
- ✅ 已完成的任务
- 🚧 正在进行的任务
- 📅 待开发的任务

### 第三步：选择一个任务开始

根据你的角色选择任务：

#### 如果你是前端开发者
```bash
# 查看前端相关任务
grep "前端" docs/PROJECT_PLAN.md

# 示例：开发可拖拽编辑器
/01-dev 实现可拖拽的组件编辑器，支持7种组件类型
```

#### 如果你是后端开发者
```bash
# 查看后端相关任务
grep "后端" docs/PROJECT_PLAN.md

# 示例：开发模板管理API
/01-dev 实现模板管理的CRUD接口，支持版本管理
```

#### 如果你是架构师
```bash
# 设计系统架构
/design-arch 设计可视化编辑器的数据结构和渲染引擎
```

---

## 📖 常见工作场景

### 场景1：开发新功能

```bash
# 1. 需求分析
/analyze-demand 我要添加一个用户评论功能，支持点赞和回复

# 2. 架构设计
/design-arch 设计评论系统的数据库表结构和API接口

# 3. 后端开发
/01-dev 实现评论系统的后端API

# 4. 前端开发
/01-dev 实现评论系统的前端界面

# 5. 测试
/02-test 为评论系统编写单元测试和集成测试

# 6. 代码审查
/code-review 审查 server/src/modules/comment/ 目录
```

### 场景2：修复Bug

```bash
# 1. 描述问题
我发现登录功能有问题，输入正确的用户名密码后返回401错误

# 2. AI会帮你：
# - 定位问题代码
# - 分析原因
# - 提供修复方案
# - 编写测试用例验证修复

# 3. 验证修复
/02-test 测试登录功能是否正常
```

### 场景3：代码审查

```bash
# 审查整个模块
/code-review 审查 server/src/modules/user/ 目录下的代码

# 审查单个文件
/code-review 审查 server/src/modules/user/user.service.ts

# AI会检查：
# - 代码规范
# - 性能问题
# - 安全漏洞
# - 最佳实践
```

### 场景4：性能优化

```bash
# 1. 分析性能问题
我发现首页加载很慢，需要优化

# 2. AI会帮你：
# - 分析性能瓶颈
# - 提供优化方案
# - 实施优化
# - 验证效果

# 3. 性能测试
/02-test 测试首页加载性能，确保 < 2秒
```

### 场景5：部署上线

```bash
# 1. 配置部署环境
/03-deploy 配置生产环境的Docker部署

# 2. 执行部署
# AI会生成部署脚本和文档

# 3. 验证部署
/02-test 验证生产环境功能是否正常
```

---

## 🎯 当前优先任务（Sprint 1）

### 本周目标：完成可视化编辑器核心功能

#### 任务1：组件库设计（架构师）
```bash
/design-arch 设计7种可拖拽组件的数据结构（标题、轮播图、视频、产品卡片、新闻列表、联系方式、客户案例）

# 输出文档：docs/COMPONENT_SCHEMA.md
```

#### 任务2：拖拽引擎实现（前端）
```bash
/01-dev 实现拖拽引擎，使用 vue-draggable-next，支持组件拖拽、排序、嵌套

# 输出文件：admin/src/components/Editor/DragEngine.vue
```

#### 任务3：属性面板开发（前端）
```bash
/01-dev 实现属性编辑面板，支持实时编辑组件样式和内容

# 输出文件：admin/src/components/Editor/PropertyPanel.vue
```

#### 任务4：模板渲染引擎（前端）
```bash
/01-dev 实现模板渲染引擎，根据JSON配置动态渲染页面

# 输出目录：frontend/src/components/Renderer/
```

#### 任务5：模板存储API（后端）
```bash
/01-dev 实现模板管理的CRUD接口，支持版本管理

# 输出目录：server/src/modules/template/
```

#### 任务6：预览功能（前端）
```bash
/01-dev 实现实时预览功能，支持PC/平板/移动端响应式预览

# 输出文件：admin/src/components/Editor/Preview.vue
```

---

## 💡 AI协作技巧

### 1. 明确需求
```bash
# ❌ 不好的提问
帮我做一个编辑器

# ✅ 好的提问
实现一个可拖拽的组件编辑器，支持以下功能：
1. 从左侧组件面板拖拽组件到画布
2. 在画布中调整组件顺序
3. 点击组件显示属性编辑面板
4. 实时预览效果
```

### 2. 提供上下文
```bash
# ❌ 不好的提问
这个函数有问题

# ✅ 好的提问
server/src/modules/user/user.service.ts 文件中的 createUser 函数，
在创建用户时没有检查邮箱是否已存在，请帮我添加验证逻辑
```

### 3. 分步执行
```bash
# 对于复杂任务，分多次对话完成

# 第1次对话：设计方案
/design-arch 设计评论系统的架构

# 第2次对话：实现后端
/01-dev 实现评论系统的后端API

# 第3次对话：实现前端
/01-dev 实现评论系统的前端界面

# 第4次对话：编写测试
/02-test 为评论系统编写测试
```

### 4. 及时反馈
```bash
# AI 输出代码后，及时反馈

# ✅ 确认
这个方案很好，请继续实现

# ✅ 修改
这个方案不错，但是我希望使用 Redis 缓存而不是内存缓存

# ✅ 提问
为什么选择这个技术方案？有没有其他选择？
```

---

## 📚 学习资源

### 项目文档
- [项目计划](./PROJECT_PLAN.md) - 了解项目进度和任务
- [AI协作指南](./AI_COLLABORATION.md) - 学习如何与AI协作
- [开发规范](./DEV_STANDARDS.md) - 掌握代码规范
- [架构设计](./architecture.md) - 理解系统架构

### 技术文档
- [NestJS 官方文档](https://docs.nestjs.com/)
- [Vue 3 官方文档](https://vuejs.org/)
- [TypeORM 官方文档](https://typeorm.io/)
- [Element Plus 官方文档](https://element-plus.org/)

---

## 🆘 遇到问题？

### 常见问题

#### Q1: 如何启动开发环境？
```bash
# 启动数据库
docker-compose up -d

# 启动后端（端口3000）
cd server && npm run start:dev

# 启动后台管理（端口5173）
cd admin && npm run dev

# 启动前端官网（端口5174）
cd frontend && npm run dev
```

#### Q2: 如何查看当前任务？
```bash
# 查看项目计划
cat docs/PROJECT_PLAN.md

# 或者在浏览器中打开
open docs/PROJECT_PLAN.md
```

#### Q3: 如何使用AI协作？
```bash
# 查看AI协作指南
cat docs/AI_COLLABORATION.md

# 使用技能命令
/analyze-demand [需求描述]
/design-arch [设计内容]
/01-dev [开发任务]
/02-test [测试任务]
/code-review [审查路径]
```

#### Q4: 代码规范是什么？
```bash
# 查看开发规范
cat docs/DEV_STANDARDS.md
```

#### Q5: 如何提交代码？
```bash
# 1. 查看修改
git status

# 2. 添加文件
git add .

# 3. 提交（遵循规范）
git commit -m "feat(module): 添加xxx功能"

# 4. 推送
git push origin feature/xxx
```

---

## 🎉 开始你的第一个任务

现在你已经了解了基本流程，选择一个任务开始吧！

```bash
# 1. 查看当前Sprint的任务
cat docs/PROJECT_PLAN.md | grep "Sprint 1"

# 2. 选择一个任务
# 例如：实现拖拽引擎

# 3. 使用AI协作
/01-dev 实现拖拽引擎，使用 vue-draggable-next，支持组件拖拽、排序、嵌套

# 4. AI会帮你：
# - 分析需求
# - 设计方案
# - 编写代码
# - 编写测试
# - 生成文档

# 5. 完成后更新任务状态
# 在 PROJECT_PLAN.md 中将任务标记为完成
```

---

## 📞 联系方式

如果有任何问题，可以：
1. 查看项目文档
2. 使用AI协作命令
3. 提交Issue到GitHub

祝你开发愉快！🚀
