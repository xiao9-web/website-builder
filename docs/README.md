# 项目管理中心

> 企业官网可视化构建系统 - AI协作开发指挥中心

## 当前需求基准

当前开发应以 [REQUIREMENTS_PLATFORM_MVP.md](./REQUIREMENTS_PLATFORM_MVP.md) 为准。

当前任务拆分应以 [DEVELOPMENT_TASKS_MVP.md](./DEVELOPMENT_TASKS_MVP.md) 为准。

该文档明确了最新方向：

- 走完整多站点平台，不做一次性企业官网。
- 第一真实站点是山东春昌食品科技股份有限公司官网。
- 第二真实站点是个人博客，排在企业官网闭环之后。
- 第一阶段采用表单驱动模板配置，不做拖拽编辑器。
- 当前技术主线是 `apps/server` Spring Boot + `apps/web` Next.js + PostgreSQL/Redis。

本目录中部分旧文档仍保留历史方案，例如 Vue、NestJS、MySQL、拖拽编辑器等描述；在更新前不作为当前实现依据。

## 📊 项目状态

**当前版本**：v0.1.0（基础架构整理中）
**目标版本**：MVP（多站点平台 + 企业官网闭环）
**当前阶段**：M1 - Platform Skeleton and Corporate Preview
**当前首任务**：BE-001 - Align Database Migrations With MVP Schema

---

## 🎯 当前MVP目标

### 核心任务：跑通多站点平台的企业官网闭环

- [ ] **BE-001** 对齐数据库迁移与MVP表结构
- [ ] **BE-002** 初始化企业官网模板和春昌默认配置
- [ ] **BE-003/BE-004** 实现站点和站点配置API
- [ ] **FEA-001/FEA-004/FEA-006** 实现后台壳、新建站点、编辑配置
- [ ] **FEP-001/FEP-002/FEP-003** 实现企业官网数据契约、主题和首页预览
- [ ] **BE-007/FEA-012/FEP-008** 实现留言获客闭环

完整任务拆分见 [DEVELOPMENT_TASKS_MVP.md](./DEVELOPMENT_TASKS_MVP.md)。

---

## 🚀 快速开始

### 新手入门
1. 阅读 [快速启动指南](./QUICK_START.md)（5分钟）
2. 了解 [AI协作方式](./AI_COLLABORATION.md)（10分钟）
3. 查看 [开发规范](./DEV_STANDARDS.md)（15分钟）
4. 开始第一个任务！

### 老手直达
```bash
# 查看当前任务
cat docs/DEVELOPMENT_TASKS_MVP.md

# 验证主线构建
npm run build:all

# 查看启动命令
make -n start
```

---

## 📋 核心文档

| 文档 | 用途 | 适合人群 |
|------|------|----------|
| [REQUIREMENTS_PLATFORM_MVP.md](./REQUIREMENTS_PLATFORM_MVP.md) | 当前产品需求基准 | 产品、设计、开发 |
| [DEVELOPMENT_TASKS_MVP.md](./DEVELOPMENT_TASKS_MVP.md) | 当前MVP开发任务拆分 | 项目经理、开发者 |
| [QUICK_START.md](./QUICK_START.md) | 5分钟快速上手 | 所有人 |
| [PROJECT_PLAN.md](./PROJECT_PLAN.md) | 项目计划和任务清单 | 项目经理、开发者 |
| [AI_COLLABORATION.md](./AI_COLLABORATION.md) | AI协作指南 | 所有开发者 |
| [DEV_STANDARDS.md](./DEV_STANDARDS.md) | 开发规范 | 开发者 |
| [architecture.md](./architecture.md) | 系统架构设计 | 架构师、开发者 |
| [COMPONENT_SCHEMA.md](./COMPONENT_SCHEMA.md) | 组件数据结构规范 | 前端开发者（待创建） |

---

## 🤖 AI 技能命令

### 需求和设计
```bash
/analyze-demand [需求描述]    # 需求分析和任务拆解
/design-arch [设计内容]       # 架构设计和技术选型
```

### 开发和测试
```bash
/01-dev [开发任务]            # 功能开发（前端/后端）
/02-test [测试任务]           # 编写和执行测试
```

### 审查和部署
```bash
/code-review [文件路径]       # 代码审查
/05-security [模块名称]       # 安全审查
/06-audit [审计范围]          # 代码审计
/03-deploy [部署环境]         # 配置和部署
```

---

## 📈 项目里程碑

| 里程碑 | 目标 | 状态 | 预计完成 |
|--------|------|------|----------|
| M0 | 主线确认与入口整理 | ✅ 已完成 | 已完成 |
| M1 | 平台骨架与企业官网预览 | 🚧 进行中 | 待评估 |
| M2 | 留言获客闭环 | 📅 待开始 | 待评估 |
| M3 | 产品服务管理与展示 | 📅 待开始 | 待评估 |
| M4 | 最近动态管理与展示 | 📅 待开始 | 待评估 |
| M5 | 发布记录闭环 | 📅 待开始 | 待评估 |
| M6 | 个人博客模板规划与实现 | 📅 待开始 | 企业官网稳定后 |

---

## 🎭 团队角色

### 需求分析师
- **命令**：`/analyze-demand`
- **职责**：需求分析、任务拆解、风险评估
- **输出**：需求文档、任务清单

### 架构师
- **命令**：`/design-arch`
- **职责**：架构设计、技术选型、规范制定
- **输出**：架构文档、API设计、数据库设计

### 前端开发
- **命令**：`/01-dev`（前端任务）
- **职责**：Next.js开发、UI实现、性能优化
- **输出**：组件代码、样式文件、单元测试

### 后端开发
- **命令**：`/01-dev`（后端任务）
- **职责**：Spring Boot开发、API实现、数据库操作
- **输出**：API代码、数据模型、单元测试

### 测试工程师
- **命令**：`/02-test`
- **职责**：测试用例编写、测试执行、Bug验证
- **输出**：测试代码、测试报告、Bug清单

### 运维工程师
- **命令**：`/03-deploy`
- **职责**：部署配置、CI/CD、监控告警
- **输出**：部署脚本、配置文件、监控方案

### 安全工程师
- **命令**：`/05-security`
- **职责**：安全审查、漏洞扫描、安全加固
- **输出**：安全报告、修复方案、安全建议

### 代码审查员
- **命令**：`/code-review`
- **职责**：代码质量审查、性能优化、最佳实践
- **输出**：审查报告、优化建议

---

## 🔄 标准工作流程

### 开发新功能
```
1. 需求分析 (/analyze-demand)
   ↓
2. 架构设计 (/design-arch)
   ↓
3. 后端开发 (/01-dev)
   ↓
4. 前端开发 (/01-dev)
   ↓
5. 编写测试 (/02-test)
   ↓
6. 代码审查 (/code-review)
   ↓
7. 安全审查 (/05-security)
   ↓
8. 部署上线 (/03-deploy)
```

### 修复Bug
```
1. 问题定位（描述Bug）
   ↓
2. 分析原因（AI分析）
   ↓
3. 修复代码 (/01-dev)
   ↓
4. 编写测试 (/02-test)
   ↓
5. 验证修复
```

### 代码审查
```
1. 提交审查请求 (/code-review)
   ↓
2. AI审查代码
   ↓
3. 修复问题
   ↓
4. 再次审查
   ↓
5. 合并代码
```

---

## 📊 技术栈

### 后端
- **框架**：Spring Boot 3
- **数据库**：PostgreSQL 16
- **缓存**：Redis 7.0
- **认证**：JWT + Spring Security
- **文档**：Swagger/OpenAPI

### 前端
- **框架**：Next.js 14 + TypeScript
- **UI**：Tailwind CSS + 项目内组件
- **状态管理**：Zustand
- **路由**：Next.js App Router
- **构建工具**：Next.js / npm

### 运维
- **容器化**：Docker + Docker Compose
- **反向代理**：Nginx
- **CI/CD**：GitHub Actions
- **云服务**：阿里云 OSS + CDN

---

## 🎯 当前优先级

### P0 - 必须完成
- 数据库迁移与MVP表结构
- 企业官网模板默认配置
- 站点创建与SiteConfig编辑
- 企业官网预览页
- 留言提交与后台处理

### P1 - 应该完成
- 产品服务管理与展示
- 最近动态管理与展示
- 发布记录闭环

### P2 - 可以延后
- 性能优化
- SEO优化
- 个人博客模板
- 真实OSS/CDN发布
- 拖拽编辑器

---

## 📝 每日工作流程

### 早上（9:00 - 12:00）
1. 查看 [DEVELOPMENT_TASKS_MVP.md](./DEVELOPMENT_TASKS_MVP.md) 确认今日任务
2. 使用AI协作命令开始开发
3. 完成核心功能开发

### 下午（14:00 - 18:00）
1. 继续开发或编写测试
2. 代码审查和优化
3. 更新文档和任务状态

### 晚上（可选）
1. 学习新技术
2. 阅读项目文档
3. 规划明天任务

---

## 🆘 常见问题

### Q: 如何开始第一个任务？
A: 阅读 [QUICK_START.md](./QUICK_START.md)，然后选择一个任务使用AI命令开始。

### Q: 如何与AI协作？
A: 查看 [AI_COLLABORATION.md](./AI_COLLABORATION.md) 了解详细的协作方式。

### Q: 代码规范是什么？
A: 查看 [DEV_STANDARDS.md](./DEV_STANDARDS.md) 了解完整的代码规范。

### Q: 如何查看项目进度？
A: 查看 [DEVELOPMENT_TASKS_MVP.md](./DEVELOPMENT_TASKS_MVP.md) 了解当前MVP任务清单和推荐实施顺序。

### Q: 遇到技术问题怎么办？
A: 直接向AI描述问题，AI会帮你分析和解决。

---

## 🎉 开始工作

选择你的角色，开始第一个任务：

```bash
# 需求分析师
/analyze-demand [需求描述]

# 架构师
/design-arch [设计内容]

# 开发者
/01-dev [开发任务]

# 测试工程师
/02-test [测试任务]

# 运维工程师
/03-deploy [部署任务]

# 代码审查员
/code-review [文件路径]
```

---

**祝你开发愉快！🚀**

*最后更新：2026-03-13*
