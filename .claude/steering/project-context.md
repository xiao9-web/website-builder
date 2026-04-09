# Website Builder 项目上下文

## 项目概述
企业官网可视化构建系统，支持拖拽配置、模板管理、一键部署。

## 技术栈
- **前端官网**：Vue 3 + Vite + Tailwind CSS
- **后台管理**：Vue 3 + Element Plus + TypeScript
- **后端服务**：NestJS + TypeORM + MySQL 8.0
- **部署**：阿里云 OSS + CDN

## 核心概念

### 模板 (Template)
- 预设的页面布局配置
- 包含组件结构、样式、默认内容
- 存储为 TypeScript 对象（当前）或数据库记录（未来）

### 页面 (Page)
- 基于模板创建的具体页面实例
- 有独立的 slug（访问路径）
- 可以自定义内容和样式
- 状态：草稿/已发布/已归档

### 菜单 (Menu)
- 网站导航菜单项
- 关联到页面、文章或分类
- 支持多级嵌套
- 可拖拽排序

### 组件 (Component)
- 页面的构成单元
- 类型：文本、图片、卡片、列表等
- 可配置样式和内容

## 当前问题
1. **模板系统混乱**：模板和页面的关系不清晰
2. **菜单关联复杂**：可以关联多种类型，逻辑混乱
3. **用户体验差**：创建流程不清晰，容易出错

## 禁止事项
- ❌ 不要随意修改数据库结构，需要先讨论
- ❌ 不要一次性重构多个模块
- ❌ 不要删除现有功能，除非确认不再使用
- ❌ 不要更换技术栈（Vue/NestJS/TypeORM）

## 开发规范
- ✅ 使用 TypeScript，严格类型检查
- ✅ 遵循 RESTful API 设计
- ✅ 组件化开发，单一职责
- ✅ 每个功能都要有测试
- ✅ 提交前运行 lint 和格式化

## 关键文件
- `server/src/page/page.entity.ts` - 页面实体
- `server/src/menu/menu.entity.ts` - 菜单实体
- `admin/src/templates/` - 模板定义
- `admin/src/views/page/` - 页面管理界面
- `admin/src/views/menu/` - 菜单管理界面

## 数据库表
- `pages` - 页面表
- `menus` - 菜单表
- `articles` - 文章表
- `categories` - 分类表
- `users` - 用户表
