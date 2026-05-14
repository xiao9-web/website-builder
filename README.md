# Website Builder Platform

多站点建站平台，支持模板驱动的网站创建、可视化编辑和一键部署。

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Java 17 + Spring Boot 3 + PostgreSQL 16 |
| 前端 | Next.js 14 + TypeScript + Tailwind CSS |
| 缓存 | Redis 7 |
| 构建 | Maven (server) + npm (web) |
| 部署 | Docker + 阿里云 OSS/CDN |

## 项目结构

```
website-builder/
├── apps/
│   ├── server/          # Spring Boot 后端服务
│   │   └── src/main/resources/db/migration/  # Flyway 数据库迁移
│   └── web/             # Next.js 前端
├── docker/
│   ├── docker-compose.yml       # 基础服务 (PostgreSQL + Redis)
│   └── docker-compose.dev.yml   # 开发工具 (pgAdmin + Redis Commander)
├── docker-compose.yml   # 根入口，引用 docker/ 配置
├── Makefile             # 常用开发命令
└── docs/                # 文档
```

## 快速开始

### 环境要求

- Docker Desktop (含 Docker Compose v2)
- Java 17+
- Node.js 20+
- npm 10+

### 1. 启动基础服务

```bash
# 启动 PostgreSQL + Redis
make dev-up

# 启动全部（含 pgAdmin + Redis Commander）
make dev-up-full
```

服务端口：
- PostgreSQL: `localhost:5432` (用户: wb_user / 密码: wb_pass / 库: website_builder)
- Redis: `localhost:6379`
- pgAdmin: `localhost:5050` (邮箱: admin@local.dev / 密码: admin123)
- Redis Commander: `localhost:8081`

### 2. 运行数据库迁移

```bash
make db-migrate
```

### 3. 启动后端

```bash
make server-start
```

### 4. 启动前端

```bash
make web-start
```

### 一键启动

```bash
make start
```

该命令会先启动 PostgreSQL/Redis，然后并行启动后端和前端开发服务。

## 常用命令

```bash
make help          # 查看所有可用命令
make dev-up        # 启动 Docker 服务
make dev-down      # 停止 Docker 服务
make dev-reset     # 停止服务并清除数据卷（全新开始）
make db-migrate    # 执行数据库迁移
make db-status     # 查看迁移状态
make clean         # 清理所有构建产物
make logs-db       # 查看 PostgreSQL 日志
make logs-redis    # 查看 Redis 日志
```

## 数据库

使用 Flyway 管理数据库迁移，迁移文件位于：

```
apps/server/src/main/resources/db/migration/
├── V1__init_schema.sql    # 初始表结构
└── V2__seed_data.sql      # 种子数据（管理员账号 + 示例模板）
```

默认管理员账号：
- 邮箱: `admin@xiao9.com`
- 密码: `admin123`

## 许可证

MIT License
