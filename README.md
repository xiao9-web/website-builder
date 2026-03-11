# Java版本企业官网项目

> 基于Spring Boot + Vue的前后端分离企业官网，包含内容管理、栏目管理、文章发布、敏感词过滤、权限控制等功能。

## 🚀 技术栈

### 后端
- **框架**：Spring Boot 2.7.12 + MyBatis-Plus 3.5.3.1
- **数据库**：MySQL 8.0
- **缓存**：Redis 6.2
- **安全**：Spring Security + JWT
- **工具**：Hutool、Lombok、Knife4j（API文档）

### 前端
- **框架**：Vue 2.x + Element UI
- **构建工具**：Vue CLI
- **富文本编辑器**：UEditor/TinyMCE
- **其他**：Axios、Vue Router、Vuex

## 📋 功能清单

### 门户端功能
- ✅ 首页展示（轮播图、新闻动态、产品介绍、关于我们、联系我们）
- ✅ 栏目管理（支持多级栏目）
- ✅ 文章管理（富文本编辑、发布、上下架）
- ✅ 产品展示（产品分类、详情）
- ✅ 新闻动态（分类、列表、详情）
- ✅ 留言板（用户留言、后台审核）
- ✅ 搜索功能（全文检索文章和产品）
- ✅ 站点地图、SEO优化

### 管理后台功能
- ✅ 管理员登录、权限控制
- ✅ 栏目管理（增删改查、排序）
- ✅ 文章管理（发布、编辑、删除、审核）
- ✅ 产品管理（分类、产品信息维护）
- ✅ 轮播图管理（首页轮播配置）
- ✅ 留言管理（查看、回复、删除）
- ✅ 敏感词过滤（自动拦截违规内容）
- ✅ 系统配置（网站基本信息、SEO配置）
- ✅ 操作日志记录

## 📁 项目结构

```
java-official-website/
├── website-admin/           # 后端管理系统
│   ├── src/main/java/com/website
│   │   ├── controller/      # 控制器层
│   │   ├── entity/          # 实体类
│   │   ├── mapper/          # Mapper层
│   │   ├── service/         # 业务逻辑层
│   │   ├── config/          # 配置类
│   │   ├── security/        # 安全认证
│   │   ├── utils/           # 工具类
│   │   └── WebsiteAdminApplication.java
│   └── src/main/resources
│       ├── mapper/          # Mapper XML文件
│       ├── application.yml  # 配置文件
│       └── db/              # 数据库脚本
├── website-frontend/        # 前端门户
│   ├── public/              # 静态资源
│   ├── src/
│   │   ├── components/      # 公共组件
│   │   ├── views/           # 页面
│   │   ├── router/          # 路由
│   │   ├── store/           # Vuex
│   │   ├── api/             # API接口
│   │   └── main.js
│   └── package.json
├── website-manage/          # 管理后台前端
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── router/
│   │   ├── store/
│   │   ├── api/
│   │   └── main.js
│   └── package.json
└── deploy/                  # 部署配置
    ├── docker-compose.yml
    └── nginx.conf
```

## 🚀 快速启动

### 环境要求
- JDK 1.8+
- MySQL 8.0+
- Redis 6.0+
- Node.js 14+

### 后端启动
```bash
# 1. 创建数据库
mysql -uroot -p < website-admin/src/main/resources/db/init.sql

# 2. 修改配置文件
cd website-admin
# 编辑application.yml，配置数据库和Redis连接信息

# 3. 启动后端服务
mvn spring-boot:run
```
后端服务启动后访问：http://localhost:8080/doc.html 查看API文档

### 前端门户启动
```bash
cd website-frontend
npm install
npm run serve
```
访问：http://localhost:8081

### 管理后台启动
```bash
cd website-manage
npm install
npm run serve
```
访问：http://localhost:8082
默认管理员账号：admin / 123456

## 📊 数据库设计

### 核心表结构
- `sys_user`：管理员用户表
- `sys_menu`：菜单权限表
- `sys_role`：角色表
- `sys_role_menu`：角色菜单关联表
- `cms_category`：栏目分类表
- `cms_article`：文章表
- `cms_product`：产品表
- `cms_banner`：轮播图表
- `cms_message`：留言表
- `cms_sensitive_word`：敏感词表
- `sys_config`：系统配置表
- `sys_log`：操作日志表

## ✨ 核心功能实现

### 1. 敏感词过滤
```java
// 基于DFA算法实现敏感词过滤
public class SensitiveWordFilter {
    // 初始化敏感词库
    public void initWordMap(List<String> sensitiveWords);
    
    // 检查是否包含敏感词
    public boolean containsSensitiveWord(String text);
    
    // 替换敏感词为***
    public String replaceSensitiveWord(String text);
}
```

### 2. 文章发布流程
```
编辑文章 → 敏感词检查 → 保存草稿 → 审核通过 → 发布上线 → 缓存到Redis
```

### 3. 权限控制
- 基于Spring Security + JWT实现无状态认证
- 支持角色权限控制，不同管理员有不同操作权限
- 接口级权限校验

### 4. 缓存优化
- 热点文章、产品详情缓存到Redis，降低数据库压力
- 首页数据缓存，提高访问速度
- 缓存自动更新机制，数据修改后自动刷新缓存

## 🔧 部署方案

### Docker Compose一键部署
```bash
cd deploy
docker-compose up -d
```
会自动启动MySQL、Redis、后端服务、前端门户、管理后台

### Nginx配置
```nginx
# 门户端
server {
    listen 80;
    server_name www.yourdomain.com;
    root /usr/share/nginx/html/frontend;
    index index.html;
    
    # 接口代理
    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# 管理后台
server {
    listen 8082;
    server_name manage.yourdomain.com;
    root /usr/share/nginx/html/manage;
    index index.html;
    
    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_set_header Host $host;
    }
}
```

## 📝 二次开发指南

### 新增栏目
1. 在`cms_category`表添加栏目记录
2. 前端开发对应的列表和详情页面
3. 配置路由和菜单

### 新增功能模块
1. 新建实体类、Mapper、Service、Controller
2. 前端新增对应的页面组件
3. 配置权限菜单

## 🤝 技术支持
如有问题欢迎提Issue，持续更新功能！
