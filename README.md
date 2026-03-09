# 官网可视化构建系统

一个功能强大的官网可视化管理系统，支持拖拽配置、一键部署到阿里云OSS。

## ✨ 功能特性

### 🎨 内容管理
- 📝 **菜单配置**：可视化拖拽调整导航菜单，支持多级菜单
- 📰 **文章管理**：富文本编辑器，支持分类、标签、SEO优化
- 🏠 **首页配置**：可视化编辑Banner、视频、产品模块、联系方式
- 📄 **页面管理**：自定义创建页面，拖拽组件搭建

### 🎨 模板系统
- 🎭 **预设模板**：多套行业模板一键套用
- ✨ **自定义背景**：支持动态粒子、渐变、视频、视差等多种背景效果
- 🎨 **样式配置**：全局主题色、字体、组件样式自定义
- 🔧 **组件市场**：丰富的组件库，拖拽即可使用

### 🚀 部署能力
- ☁️ **一键部署**：自动构建并部署到阿里云OSS
- 🔄 **版本回滚**：支持历史版本一键回滚
- 📱 **多端适配**：自动生成响应式页面
- ⚡ **CDN加速**：自动刷新阿里云CDN缓存

## 🛠 技术栈

| 模块 | 技术选型 |
|------|----------|
| 前端官网 | Vue3 + Vite + Tailwind CSS |
| 后台管理 | Vue3 + Element Plus + TypeScript |
| 后端服务 | Node.js + NestJS + TypeScript |
| 数据库 | MySQL + TypeORM |
| 存储 | 阿里云OSS |
| 部署 | 阿里云ECS/函数计算 + CDN |

## 📦 项目结构

```
website-builder/
├── admin/                 # 后台管理系统
├── frontend/              # 官网前端模板
├── server/                # 后端API服务
├── shared/                # 共享类型和工具
└── docs/                  # 文档
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18.x
- MySQL >= 8.0
- 阿里云账号（OSS + CDN服务）

### 安装依赖
```bash
# 安装所有依赖
npm run install:all

# 或者分别安装
cd admin && npm install
cd ../server && npm install
cd ../frontend && npm install
```

### 配置环境变量
```bash
# 复制后端配置文件
cp server/.env.example server/.env
# 编辑配置，填写数据库、阿里云AK/SK等信息

# 复制前端配置文件
cp admin/.env.example admin/.env
```

### 启动开发环境
```bash
# 启动后端服务 (端口: 3000)
npm run dev:server

# 启动后台管理 (端口: 5173)
npm run dev:admin

# 启动官网模板预览 (端口: 5174)
npm run dev:frontend
```

## 📖 使用文档

1. [部署指南](./docs/deploy.md)
2. [API文档](./docs/api.md)
3. [模板开发指南](./docs/template.md)
4. [组件开发指南](./docs/component.md)

## 🤝 贡献

欢迎提交Issue和PR！

## 📄 许可证

MIT License
