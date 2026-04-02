
# AI代码团队 - Claude Code配置

## 1. 项目概览
- **项目描述**：个人AI代码团队，处理日常工作、文章写作、代码开发、需求讨论等任务
- **技术栈**：Node.js 22 + Python 3.12 + TypeScript + Claude Code v2.1+
- **当前阶段**：开发

## 2. 代码规范
### 通用规则
- 所有代码必须有类型注解
- 函数不超过50行，类不超过300行
- 禁止使用any类型（特殊情况需注释说明）

### 命名约定
- 文件名：kebab-case（如 user-service.ts）
- 类名：PascalCase（如 UserService）
- 函数/变量：camelCase（如 getUserById）
- 常量：UPPER_SNAKE_CASE（如 MAX_RETRY_COUNT）

### 文档要求
- 所有公共API必须有JSDoc/TSDoc注释
- 复杂业务逻辑必须有流程说明
- 使用中文注释，代码用英文

## 3. 安全规则
### 禁止行为
- 禁止在代码中硬编码敏感信息
- 禁止提交.env文件到仓库
- 禁止在日志中输出用户隐私数据

### 必须行为
- 所有输入必须验证和消毒
- 数据库查询必须使用参数化
- API必须有速率限制

## 4. 测试要求
- 新功能必须有单元测试
- 核心逻辑测试覆盖率>80%
- 集成测试必须覆盖主要用户流程

## 5. Git规范
### 分支命名
- feature/xxx：新功能
- fix/xxx：bug修复
- refactor/xxx：重构
- docs/xxx：文档更新

### 提交信息
格式：`<type>(<scope>): <description>`
类型：feat、fix、docs、style、refactor、test、chore

## 6. 团队角色配置
### 需求分析师 (Demand Analyst)
- 职责：分析用户需求，拆解为可执行任务
- 输出：需求文档、任务拆分清单、优先级排序

### 架构师 (Architect)
- 职责：技术选型、架构设计、代码规范制定
- 输出：架构图、技术方案、接口设计

### 前端开发 (Frontend Developer)
- 职责：React/Vue开发、UI实现、交互优化
- 输出：前端代码、组件库、样式文件

### 后端开发 (Backend Developer)
- 职责：API开发、数据库设计、性能优化
- 输出：后端代码、接口文档、数据库脚本

### 测试工程师 (Test Engineer)
- 职责：单元测试、集成测试、自动化测试
- 输出：测试用例、测试报告、bug清单

### 运维工程师 (DevOps)
- 职责：CI/CD配置、部署、监控、安全
- 输出：Dockerfile、K8s配置、监控脚本

## 7. 工作流规范
### 需求讨论流程
1. 用户提出需求 → 需求分析师拆解
2. 架构师设计技术方案
3. 前后端开发实现
4. 测试工程师验证
5. 运维工程师部署

### 代码审查流程
1. 开发提交PR → AI自动审查
2. 架构师复核
3. 合并到主分支

