# Website Builder 阿里云上线操作文档

本文档面向当前练手生产服务器，用于把 Website Builder 部署到阿里云 ECS 并完成公网验收。

当前服务器：

| 项目 | 值 |
| --- | --- |
| 公网 IP | `47.116.137.192` |
| 域名 | `chunchang.tech` |
| 实例规格 | `ecs.e-c1m1.large` |
| CPU / 内存 | 2 vCPU / 2 GiB |
| 系统 | Ubuntu 22.04 64 位 |
| 系统盘 | 40 GiB ESSD Entry |
| 公网带宽 | 3 Mbps 固定带宽 |
| 到期时间 | 2027-05-19 23:59:59 |

这台机器用于第一阶段练手上线：先让企业官网和后台在公网可访问。Jenkins、K8s、Prometheus、Grafana、Apollo、XXL-JOB 等工程化扩展不要常驻在这台 2G 机器上。

## 1. 上线目标

上线后需要可访问：

| 功能 | 地址 |
| --- | --- |
| 春昌官网 | `http://chunchang.tech/sites/chunchang` |
| 后台登录 | `http://chunchang.tech/login` |
| 后台首页 | `http://chunchang.tech/dashboard` |
| 后端健康检查 | `http://chunchang.tech/actuator/health` |

后台默认账号：

```text
admin@xiao9.com
admin123
```

上线后应尽快修改默认密码，或新增正式管理员账号后禁用默认账号。

## 2. 部署架构

当前生产练手部署使用 Docker Compose：

```text
公网用户
  ↓
Nginx :80
  ↓
Next.js web :3000
  ↓
Spring Boot server :8080
  ↓
PostgreSQL + Redis
```

常驻容器：

| 容器 | 作用 | 是否暴露公网 |
| --- | --- | --- |
| `wb-prod-nginx` | 统一入口、反向代理 | 是，80 |
| `wb-prod-web` | Next.js 前端 | 否 |
| `wb-prod-server` | Spring Boot 后端 API | 否 |
| `wb-prod-postgres` | PostgreSQL 数据库 | 否 |
| `wb-prod-redis` | Redis 缓存 | 否 |

2G 内存优化：

- Spring Boot JVM 限制为 `-Xmx512m`。
- PostgreSQL `shared_buffers=128MB`，`max_connections=40`。
- Redis `maxmemory=128mb`。
- Docker 日志限制为 `20m * 3`。
- 服务器初始化脚本会创建 2G swap。

## 3. 上线前准备

### 3.1 本地代码确认

本地提交前建议运行：

```bash
npm run build:server
npm run build:web
```

如果只验证阿里云 compose 配置：

```bash
cp .env.prod.example .env.prod
vim .env.prod
make prod-aliyun-config
rm -f .env.prod
```

注意：不要提交 `.env.prod`，它包含生产密码。

### 3.2 阿里云安全组

阿里云 ECS 安全组只开放：

| 端口 | 协议 | 来源 | 说明 |
| --- | --- | --- | --- |
| 22 | TCP | 建议限制为你的公网 IP | SSH |
| 80 | TCP | `0.0.0.0/0` | HTTP 网站访问 |

不要开放：

| 端口 | 原因 |
| --- | --- |
| 3000 | 前端容器只应由 Nginx 内网访问 |
| 8080 | 后端容器只应由 Nginx/前端内网访问 |
| 5432 | PostgreSQL 不应暴露公网 |
| 6379 | Redis 不应暴露公网 |
| 9090 / 3001 | 当前服务器不常驻 Prometheus/Grafana |

### 3.3 服务器登录

```bash
ssh root@47.116.137.192
```

如果阿里云创建的是普通用户，替换成对应用户名。

### 3.4 推荐目录

```bash
mkdir -p /opt
cd /opt
```

建议把项目放在：

```text
/opt/website-builder
```

## 4. 首次上线步骤

### 4.1 拉取代码

```bash
cd /opt
git clone <你的仓库地址> website-builder
cd website-builder
```

如果服务器不能访问 GitHub，可以先把代码推到 Gitee 或阿里云 Codeup，再从服务器拉取。

### 4.2 配置生产环境变量

```bash
cp .env.prod.example .env.prod
vim .env.prod
```

当前域名：

```text
PUBLIC_BASE_URL=http://chunchang.tech
```

必须修改：

```text
POSTGRES_PASSWORD=换成强密码
JWT_SECRET=换成至少32位的随机字符串
```

示例：

```text
PUBLIC_BASE_URL=http://chunchang.tech
POSTGRES_DB=website_builder
POSTGRES_USER=wb_user
POSTGRES_PASSWORD=请替换成强密码
JWT_SECRET=请替换成至少32位随机字符串
```

生成随机 JWT secret：

```bash
openssl rand -base64 48
```

### 4.3 初始化服务器

```bash
sudo ./scripts/aliyun-2c2g-init.sh
```

脚本会执行：

- 安装基础软件。
- 安装 Docker Engine 和 Docker Compose 插件。
- 启动 Docker。
- 配置 Docker 日志轮转。
- 创建 2G swap。
- 配置 UFW 防火墙，开放 SSH 和 80。
- 将当前 sudo 用户加入 docker 用户组。

如果脚本结束后普通用户执行 Docker 仍提示无权限，退出 SSH 后重新登录。

### 4.4 启动生产练手栈

```bash
./scripts/aliyun-2c2g-deploy.sh
```

等脚本输出 `Deployment healthy.`。

也可以使用 Makefile：

```bash
make prod-aliyun-up
```

### 4.5 查看容器状态

```bash
make prod-aliyun-ps
```

期望看到：

```text
wb-prod-postgres
wb-prod-redis
wb-prod-server
wb-prod-web
wb-prod-nginx
```

状态应为 `running` 或 `healthy`。

### 4.6 健康检查

在服务器本机执行：

```bash
make prod-aliyun-health
```

在本地浏览器访问：

```text
http://chunchang.tech/actuator/health
```

期望返回包含：

```json
{"status":"UP"}
```

## 5. 上线验收清单

### 5.1 公网访问验收

在本地电脑浏览器打开：

```text
http://chunchang.tech/sites/chunchang
```

确认：

- 页面可以打开。
- 页面是中文。
- 不显示 Next.js 错误页。
- 样式正常。
- 产品服务区域正常。
- 最近动态区域正常。
- 联系/咨询入口正常。

### 5.2 后台登录验收

打开：

```text
http://chunchang.tech/login
```

使用：

```text
admin@xiao9.com
admin123
```

确认：

- 可以登录。
- 可以进入 `/dashboard`。
- 可以进入站点内容管理。
- 菜单、文章、产品服务可以加载。

### 5.3 内容维护验收

进入：

```text
http://chunchang.tech/dashboard/sites/1/content
```

至少验证：

- 新增或修改菜单。
- 最多三级菜单。
- 文章只能挂到最后一级菜单。
- 富文本可以输入内容。
- 图片 URL、视频 URL 可以保存。
- 上传图片后能得到 `/uploads/...` 地址。
- 文章发布后前台可见。

### 5.4 留言线索验收

在官网提交一次咨询留言，确认：

- 前台提交成功。
- 后台留言线索可见。
- 必填项校验正常。

### 5.5 上传文件验收

在后台上传一张小图，确认：

- 返回 URL。
- URL 以当前公网地址或 `/uploads/` 形式可访问。
- 前台页面能展示图片。

当前上传文件存在 Docker volume 中：

```text
website-builder-prod_wb_prod_uploads
```

## 6. 日常运维命令

进入项目目录：

```bash
cd /opt/website-builder
```

查看状态：

```bash
make prod-aliyun-ps
```

查看日志：

```bash
make prod-aliyun-logs
```

只看后端日志：

```bash
docker logs -f --tail=200 wb-prod-server
```

只看前端日志：

```bash
docker logs -f --tail=200 wb-prod-web
```

只看 Nginx 日志：

```bash
docker logs -f --tail=200 wb-prod-nginx
```

重启全部服务：

```bash
docker compose -f docker-compose.prod.aliyun-2c2g.yml --env-file .env.prod restart
```

停止服务：

```bash
make prod-aliyun-down
```

重新部署：

```bash
git pull
./scripts/aliyun-2c2g-deploy.sh
```

不重新构建，仅按已有镜像启动：

```bash
./scripts/aliyun-2c2g-deploy.sh --no-build
```

## 7. 备份与恢复

### 7.1 手动备份

```bash
cd /opt/website-builder
make prod-aliyun-backup
```

备份文件输出到：

```text
backups/
```

包含：

- PostgreSQL SQL 压缩包。
- 上传文件压缩包。

40G 系统盘空间有限，建议定期把 `backups/` 下载到本地或同步到 OSS。

查看备份大小：

```bash
du -sh backups
ls -lh backups
```

### 7.2 下载备份到本地

在本地电脑执行：

```bash
scp root@47.116.137.192:/opt/website-builder/backups/*.gz ./backups/
```

### 7.3 数据库恢复

恢复前先备份当前数据。

停止应用容器，保留数据库：

```bash
docker stop wb-prod-web wb-prod-server wb-prod-nginx
```

恢复数据库：

```bash
gzip -dc backups/website-builder-db-YYYYMMDD-HHMMSS.sql.gz | \
  docker exec -i wb-prod-postgres psql -U wb_user -d website_builder
```

恢复后启动服务：

```bash
docker start wb-prod-server wb-prod-web wb-prod-nginx
```

### 7.4 上传文件恢复

```bash
docker run --rm \
  -v website-builder-prod_wb_prod_uploads:/data \
  -v /opt/website-builder/backups:/backup \
  alpine:3.20 \
  sh -c 'cd /data && tar -xzf /backup/website-builder-uploads-YYYYMMDD-HHMMSS.tar.gz'
```

## 8. 更新发布流程

每次发布前：

```bash
cd /opt/website-builder
make prod-aliyun-backup
git pull
./scripts/aliyun-2c2g-deploy.sh
make prod-aliyun-health
```

发布后验收：

```text
http://chunchang.tech/sites/chunchang
http://chunchang.tech/login
http://chunchang.tech/actuator/health
```

如果只改文档，不需要重新部署容器。

如果修改了 `.env.prod` 里的 `PUBLIC_BASE_URL`，必须重新构建前端：

```bash
./scripts/aliyun-2c2g-deploy.sh --build
```

原因：Next.js 浏览器端 API 地址会在构建时写入前端包。

## 9. 回滚流程

### 9.1 代码回滚

查看最近提交：

```bash
git log --oneline -5
```

回到指定提交：

```bash
git checkout <commit>
./scripts/aliyun-2c2g-deploy.sh
```

回到主分支最新版本：

```bash
git checkout main
git pull
./scripts/aliyun-2c2g-deploy.sh
```

### 9.2 数据回滚

如果数据库迁移或内容维护导致数据问题，使用第 7 节的备份恢复流程。

注意：代码回滚不等于数据库回滚。涉及 Flyway migration 的发布要先确认是否可逆。

## 10. 常见故障排查

### 10.1 公网 IP 打不开

检查安全组：

- 是否开放 80。
- 是否绑定公网 IP。

检查服务器防火墙：

```bash
sudo ufw status
```

检查 Nginx 容器：

```bash
docker ps | grep wb-prod-nginx
docker logs --tail=100 wb-prod-nginx
```

### 10.2 健康检查不是 UP

查看后端日志：

```bash
docker logs --tail=200 wb-prod-server
```

常见原因：

- `.env.prod` 数据库密码写错。
- PostgreSQL 容器未 healthy。
- 内存不足导致容器重启。
- Flyway migration 失败。

查看容器状态：

```bash
docker compose -f docker-compose.prod.aliyun-2c2g.yml --env-file .env.prod ps
```

### 10.3 登录失败

确认数据库 seed 是否执行成功：

```bash
docker exec -it wb-prod-postgres psql -U wb_user -d website_builder
```

进入 psql 后：

```sql
select id, email, role, enabled from users;
```

默认应存在：

```text
admin@xiao9.com
```

### 10.4 页面能打开但接口失败

检查浏览器 Network 中 API 地址是否为：

```text
http://47.116.137.192/api/...
```

如果仍指向 `localhost:8080`，说明前端构建时 `PUBLIC_BASE_URL` 不对。修复：

```bash
vim .env.prod
./scripts/aliyun-2c2g-deploy.sh --build
```

### 10.5 上传图片打不开

检查：

```bash
docker logs --tail=100 wb-prod-server
docker volume ls | grep wb_prod_uploads
```

确认 `.env.prod`：

```text
PUBLIC_BASE_URL=http://chunchang.tech
```

当前媒体访问路径由：

```text
MEDIA_BASE_URL=${PUBLIC_BASE_URL}/uploads
```

生成。

### 10.6 服务器内存不足

查看内存：

```bash
free -h
docker stats
```

如果构建时 OOM：

1. 停止不必要容器。
2. 确认 swap 已启用。
3. 重试部署。

```bash
swapon --show
./scripts/aliyun-2c2g-deploy.sh
```

如果仍然 OOM，改成“本地构建镜像，服务器只拉镜像运行”的方案。

### 10.7 磁盘不足

查看磁盘：

```bash
df -h
docker system df
```

清理未使用镜像：

```bash
docker image prune -f
docker builder prune -f
```

不要随意执行 `docker volume prune`，否则可能删除数据库和上传文件。

## 11. 域名、备案与 HTTPS

### 11.1 当前阶段

当前公网访问入口：

```text
http://chunchang.tech
```

### 11.2 域名备案后

完成备案和 DNS 解析后：

1. 将域名 A 记录指向 `47.116.137.192`。
2. 修改 `.env.prod`：

```text
PUBLIC_BASE_URL=http://chunchang.tech
```

3. 修改 Nginx `server_name`。
4. 配置 HTTPS 证书。
5. 重新构建前端：

```bash
./scripts/aliyun-2c2g-deploy.sh --build
```

HTTPS 可以后续单独接入。当前阶段先用 `http://chunchang.tech` 跑通：

- 阿里云免费证书。
- Nginx 证书挂载。
- 或 Certbot 自动签发。

## 12. 上线完成标准

满足以下条件才算上线完成：

- `http://chunchang.tech/actuator/health` 返回 UP。
- `http://chunchang.tech/sites/chunchang` 可打开。
- `http://chunchang.tech/login` 可登录。
- 后台内容管理可打开。
- 菜单、文章、产品服务至少完成一次保存验证。
- 官网咨询留言能提交。
- 图片上传和 `/uploads/...` 访问正常。
- 已执行一次 `make prod-aliyun-backup`。
- 阿里云安全组没有暴露 3000、8080、5432、6379。

## 13. 后续升级路线

当前 2核2G 适合练手上线。后续有真实客户或面试演示需求时再升级：

| 阶段 | 建议 |
| --- | --- |
| 当前 | 2核2G，核心服务上线 |
| 业务稳定 | 升级 4核8G，保留 Docker Compose |
| 数据重要 | PostgreSQL 迁移到阿里云 RDS |
| 图片变多 | 上传文件迁移到 OSS |
| 面试展示 | 单独准备 Jenkins、K8s、监控、Apollo、XXL-JOB 演示环境 |
| 正式商用 | 域名备案、HTTPS、备份上 OSS、监控告警 |
