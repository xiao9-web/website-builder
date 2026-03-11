# Claude Code 项目配置

## 权限设置

本项目允许 Claude Code 自动执行以下操作，无需每次询问：

- 读取和编辑项目文件
- 执行 bash 命令（包括 npm、docker、git 等）
- 运行后台任务
- 访问数据库
- 调用 API 接口

## 项目说明

这是一个网站构建系统，包含：
- 后端服务（NestJS + TypeORM + MySQL）
- 管理后台（Vue 3 + Element Plus）
- 前端官网（Vue 3）

## 开发环境

- Node.js
- Docker（MySQL 8.0）
- 端口：
  - 后端：3000
  - 管理后台：5173
  - 前端官网：5174
  - MySQL：3306

## 注意事项

- 数据库密码：root123456
- JWT密钥已配置在 .env 文件中
- 开发模式下允许 TypeScript 编译错误
