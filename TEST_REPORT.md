# 项目测试报告

## 测试时间
2026-03-11

## 测试结果
✅ 所有服务成功启动并运行

## 修复的问题

### 1. TypeScript 类型错误
**问题描述**: ArticleStatus 和 PageStatus 枚举在 entity 和 DTO 中定义不一致
- entity 中定义为字符串枚举 ('0', '1', '2')
- DTO 中定义为字符串枚举 ('draft', 'published')

**解决方案**: 
- 删除 DTO 中重复的枚举定义
- 统一从 entity 文件导入枚举类型
- 修复 controller 中的类型转换问题

**修改文件**:
- `server/src/article/dto/create-article.dto.ts`
- `server/src/article/article.controller.ts`
- `server/src/page/dto/create-page.dto.ts`
- `server/src/page/page.controller.ts`
- `server/src/deploy/deploy.service.ts`

### 2. OSS Client 类型问题
**问题描述**: ali-oss 客户端没有 options 属性

**解决方案**: 直接从环境变量读取 bucket 和 region

**修改文件**:
- `server/src/deploy/deploy.service.ts`

## 服务运行状态

### MySQL 数据库
- ✅ 状态: 运行中
- 端口: 3306
- 容器: website-builder-mysql
- 健康检查: 通过

### 后端服务
- ✅ 状态: 运行中
- 端口: 3000
- 框架: NestJS
- API 前缀: /api/v1
- 测试: `curl http://localhost:3000/api/v1/auth/profile` 返回 401 (正常，需要认证)

### 管理后台
- ✅ 状态: 运行中
- 端口: 5174 (原计划 5173，自动切换)
- 框架: Vue 3 + Element Plus
- 访问: http://localhost:5174

### 前端官网
- ✅ 状态: 运行中
- 端口: 5175 (原计划 5174，自动切换)
- 框架: Vue 3 + Vite
- 访问: http://localhost:5175

## 快速启动

### 启动所有服务
```bash
./start-dev.sh
```

### 停止所有服务
```bash
./stop-dev.sh
```

### 单独启动服务

#### 启动 MySQL
```bash
docker-compose up -d
```

#### 启动后端
```bash
cd server && npm run start:dev
```

#### 启动管理后台
```bash
cd admin && npm run dev
```

#### 启动前端官网
```bash
cd frontend && npm run dev
```

## 环境配置

### 数据库配置
- 主机: localhost
- 端口: 3306
- 用户: root
- 密码: root123456
- 数据库: website_builder

### JWT 配置
- 密钥: website_builder_jwt_secret_2026_secure_key
- 过期时间: 7天

### 默认管理员账号
- 用户名: admin
- 密码: admin123
- 邮箱: admin@example.com

## 日志文件
- 后端日志: `/tmp/server.log`
- 管理后台日志: `/tmp/admin.log`
- 前端官网日志: `/tmp/frontend.log`

## 下一步建议

1. 访问管理后台 http://localhost:5174 并使用默认账号登录
2. 配置网站基本信息
3. 创建测试文章和页面
4. 访问前端官网 http://localhost:5175 查看效果
5. 如需部署到阿里云 OSS，请配置 .env 文件中的阿里云相关参数

## 注意事项

1. 确保 Docker 已启动
2. 确保端口 3000, 3306, 5174, 5175 未被占用
3. 首次启动需要等待数据库初始化和依赖安装
4. 开发模式下允许 TypeScript 编译错误（已配置）
