# 阿里云 2核2G 练手生产部署

第一次部署时，优先看照着做版：

```text
docs/ALIYUN_COPY_PASTE_DEPLOY.md
```

完整上线、验收、备份、回滚和排障流程见：

```text
docs/ALIYUN_GO_LIVE_RUNBOOK.md
```

这套部署面向当前 ECS：

- 公网 IP：`47.116.137.192`
- 域名：`www.chunchang.tech`
- 规格：2 vCPU / 2 GiB
- 系统盘：40 GiB ESSD Entry
- 系统：Ubuntu 22.04
- 公网带宽：3 Mbps 固定带宽

目标是先把企业官网和后台跑到公网，不把 Jenkins、K8s、Prometheus、Grafana、Apollo、XXL-JOB 等面试扩展组件常驻在这台小机器上。

## 服务边界

常驻服务：

- Nginx
- Next.js 生产服务
- Spring Boot 后端
- PostgreSQL
- Redis

暂不常驻：

- Jenkins
- Kubernetes / K3s
- Prometheus / Grafana
- Apollo / XXL-JOB
- pgAdmin / Redis Commander

## 服务器安全组

阿里云安全组先只放开：

| 端口 | 用途 |
| --- | --- |
| 22 | SSH，建议只允许你的公网 IP |
| 80 | HTTP |

不要开放：

- `3000`
- `8080`
- `5432`
- `6379`

这些端口只在 Docker 内网里使用。

## 首次部署

在服务器上执行：

```bash
git clone <your-repo-url> website-builder
cd website-builder
cp .env.prod.example .env.prod
vim .env.prod
```

必须修改：

- `POSTGRES_PASSWORD`
- `JWT_SECRET`

当前域名是 `www.chunchang.tech`，`PUBLIC_BASE_URL` 使用：

```text
http://www.chunchang.tech
```

初始化服务器：

```bash
sudo ./scripts/aliyun-2c2g-init.sh
```

部署：

```bash
./scripts/aliyun-2c2g-deploy.sh
```

## 访问地址

| 页面 | 地址 |
| --- | --- |
| 企业官网 | `http://www.chunchang.tech/sites/chunchang` |
| 后台登录 | `http://www.chunchang.tech/login` |
| 控制台 | `http://www.chunchang.tech/dashboard` |
| 健康检查 | `http://www.chunchang.tech/actuator/health` |

默认后台账号：

```text
admin@xiao9.com
admin123
```

上线后建议尽快改密码或增加新的管理员账号。

## 常用命令

```bash
make prod-aliyun-up
make prod-aliyun-ps
make prod-aliyun-logs
make prod-aliyun-health
make prod-aliyun-backup
make prod-aliyun-down
```

## 备份

手动备份：

```bash
./scripts/aliyun-2c2g-backup.sh
```

备份输出到：

```text
backups/
```

40G 系统盘很小，建议后续把备份同步到 OSS 或本地电脑。

## 后续换域名

备案和域名解析完成后，把 `.env.prod` 改成：

```text
PUBLIC_BASE_URL=http://www.chunchang.tech
```

然后重新构建：

```bash
./scripts/aliyun-2c2g-deploy.sh --build
```

当前版本浏览器 API 使用同域 `/api`，换 www / 非 www 不需要改前端 API；但修改公司名、首页跳转、页面样式后仍要重新构建前端镜像。
