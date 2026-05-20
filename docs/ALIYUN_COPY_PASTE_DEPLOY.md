# Website Builder 阿里云部署手册（照着做版）

这份文档只写部署必需步骤。你按顺序复制命令执行，就可以把项目部署到当前阿里云 ECS。

当前服务器：

```text
公网 IP：47.116.137.192
域名：chunchang.tech
系统：Ubuntu 22.04 64 位
配置：2 核 / 2G / 40G
带宽：3 Mbps
```

上线后访问地址：

```text
企业官网：http://chunchang.tech/sites/chunchang
后台登录：http://chunchang.tech/login
后台首页：http://chunchang.tech/dashboard
健康检查：http://chunchang.tech/actuator/health
```

后台默认账号：

```text
账号：admin@xiao9.com
密码：admin123
```

上线后建议尽快改密码，或者新增正式管理员后停用默认账号。

## 1. 阿里云控制台先做这一步

进入 ECS 安全组，只开放下面端口：

| 端口 | 用途 | 来源 |
| --- | --- | --- |
| `22` | SSH 登录 | 最好只填你自己的公网 IP，临时不会配就先 `0.0.0.0/0` |
| `80` | 网站访问 | `0.0.0.0/0` |

不要开放这些端口：

```text
3000
8080
5432
6379
5050
8081
9090
3001
```

原因：前端、后端、数据库、Redis 都只应该在 Docker 内网里访问，公网只通过 Nginx 的 `80` 端口进入。

## 2. 本地先确认代码已经推到 Git

在你本地电脑执行：

```bash
cd /Users/xiao9/workSpace/website-builder
git status
git log -1 --oneline
```

如果还有没提交的代码，先提交。服务器部署时会从 Git 仓库拉代码。

如果你还没有 push，就在本地执行：

```bash
git push
```

## 3. SSH 登录服务器

在你本地电脑执行：

```bash
ssh root@47.116.137.192
```

如果你不是用 `root` 用户登录，把 `root` 换成你的服务器用户名。

## 4. 第一次部署：拉代码

下面命令在阿里云服务器上执行。

进入部署目录：

```bash
mkdir -p /opt
cd /opt
```

克隆项目：

```bash
git clone <你的仓库地址> website-builder
cd website-builder
```

这里的 `<你的仓库地址>` 换成你的 Git 仓库地址，例如：

```bash
git clone git@github.com:你的用户名/website-builder.git website-builder
```

如果服务器还没配置 GitHub SSH key，也可以先用 HTTPS 地址：

```bash
git clone https://github.com/你的用户名/website-builder.git website-builder
```

如果你已经克隆过项目，不要重复 clone，改用：

```bash
cd /opt/website-builder
git pull
```

## 5. 创建生产环境变量

在服务器 `/opt/website-builder` 目录执行：

```bash
cp .env.prod.example .env.prod
openssl rand -base64 48
```

复制 `openssl` 输出的随机字符串，下一步要填到 `JWT_SECRET`。

编辑生产环境变量：

```bash
vim .env.prod
```

把文件改成类似下面这样：

```text
PUBLIC_BASE_URL=http://chunchang.tech

POSTGRES_DB=website_builder
POSTGRES_USER=wb_user
POSTGRES_PASSWORD=这里换成你的数据库强密码

JWT_SECRET=这里粘贴刚才 openssl rand -base64 48 生成的随机字符串
```

必须确认：

- `POSTGRES_PASSWORD` 不能还是 `change-this-postgres-password`
- `JWT_SECRET` 不能还是 `change-this-jwt-secret-at-least-32-chars`
- `JWT_SECRET` 至少 32 位
- 当前域名是 `chunchang.tech`，`PUBLIC_BASE_URL` 就用 `http://chunchang.tech`

保存 `vim`：

```text
按 Esc
输入 :wq
回车
```

## 6. 初始化服务器

在服务器 `/opt/website-builder` 目录执行：

```bash
sudo ./scripts/aliyun-2c2g-init.sh
```

这个脚本会自动做这些事：

- 安装 Git、curl、UFW 等基础工具
- 安装 Docker Engine 和 Docker Compose 插件
- 启动 Docker
- 配置 Docker 日志轮转
- 创建 2G swap，避免 2G 内存构建时太容易爆
- 配置服务器防火墙，只开放 SSH 和 80

如果脚本执行完后提示 Docker 权限还没生效，退出服务器再重新登录：

```bash
exit
ssh root@47.116.137.192
cd /opt/website-builder
```

## 7. 启动生产服务

在服务器 `/opt/website-builder` 目录执行：

```bash
./scripts/aliyun-2c2g-deploy.sh
```

第一次会构建前端和后端镜像，2 核 2G 机器会比较慢，耐心等。

看到下面这句就代表启动成功：

```text
Deployment healthy.
```

## 8. 检查服务状态

在服务器执行：

```bash
make prod-aliyun-ps
```

应该能看到这些容器：

```text
wb-prod-postgres
wb-prod-redis
wb-prod-server
wb-prod-web
wb-prod-nginx
```

再执行健康检查：

```bash
make prod-aliyun-health
```

正常会输出：

```text
ok
{"status":"UP"}
```

如果健康检查失败，先看日志：

```bash
docker compose -f docker-compose.prod.aliyun-2c2g.yml --env-file .env.prod logs --tail=200
```

## 9. 浏览器验收

在你本地电脑浏览器打开：

```text
http://chunchang.tech/sites/chunchang
```

确认：

- 页面能打开
- 页面是中文
- 样式正常
- 不显示 Next.js 报错页

打开后台登录：

```text
http://chunchang.tech/login
```

使用默认账号登录：

```text
admin@xiao9.com
admin123
```

登录后检查：

```text
http://chunchang.tech/dashboard
```

进入内容管理后，至少试一下：

- 新增菜单
- 新增文章
- 富文本编辑
- 上传图片
- 保存后前台能看到变化

## 10. 以后更新代码怎么部署

以后每次你本地改完、提交并 push 后，在服务器执行：

```bash
cd /opt/website-builder
make prod-aliyun-backup
git pull
./scripts/aliyun-2c2g-deploy.sh
make prod-aliyun-health
```

如果只是重启，不重新构建镜像：

```bash
cd /opt/website-builder
./scripts/aliyun-2c2g-deploy.sh --no-build
```

如果你改了 `.env.prod` 里的 `PUBLIC_BASE_URL`，必须重新构建：

```bash
cd /opt/website-builder
./scripts/aliyun-2c2g-deploy.sh --build
```

原因：Next.js 的浏览器 API 地址会在构建时写进前端包。

## 11. 备份

手动备份：

```bash
cd /opt/website-builder
make prod-aliyun-backup
```

备份文件会生成在：

```text
/opt/website-builder/backups/
```

查看备份：

```bash
ls -lh backups
du -sh backups
```

把备份下载到本地电脑：

```bash
mkdir -p ~/website-builder-backups
scp root@47.116.137.192:/opt/website-builder/backups/*.gz ~/website-builder-backups/
```

40G 系统盘不大，建议定期把旧备份下载到本地或同步到 OSS。

## 12. 常用运维命令

进入项目目录：

```bash
cd /opt/website-builder
```

查看容器：

```bash
make prod-aliyun-ps
```

查看全部日志：

```bash
make prod-aliyun-logs
```

查看后端日志：

```bash
docker logs -f --tail=200 wb-prod-server
```

查看前端日志：

```bash
docker logs -f --tail=200 wb-prod-web
```

查看 Nginx 日志：

```bash
docker logs -f --tail=200 wb-prod-nginx
```

停止服务：

```bash
make prod-aliyun-down
```

重新启动：

```bash
make prod-aliyun-up
```

重启所有容器：

```bash
docker compose -f docker-compose.prod.aliyun-2c2g.yml --env-file .env.prod restart
```

## 13. 常见报错处理

### 13.1 提示 `.env.prod still contains placeholder secrets`

原因：`.env.prod` 里还有默认占位密码。

处理：

```bash
cd /opt/website-builder
vim .env.prod
```

把下面两项换成真实值：

```text
POSTGRES_PASSWORD=真实强密码
JWT_SECRET=至少32位随机字符串
```

### 13.2 Docker 拉镜像失败

先重试：

```bash
cd /opt/website-builder
./scripts/aliyun-2c2g-deploy.sh
```

如果一直失败，检查服务器是否能访问 Docker Hub：

```bash
docker pull nginx:1.26-alpine
docker pull postgres:15-alpine
docker pull redis:7-alpine
```

如果这里失败，大概率是服务器网络或 Docker Hub 访问问题。可以后续配置镜像加速器，或者改成从阿里云容器镜像服务拉自建镜像。

### 13.3 构建时内存不够

先确认 swap 已开启：

```bash
free -h
swapon --show
```

如果没有 swap，重新执行初始化：

```bash
sudo ./scripts/aliyun-2c2g-init.sh
```

然后重新部署：

```bash
./scripts/aliyun-2c2g-deploy.sh
```

### 13.4 网站打不开

先在服务器本机检查：

```bash
curl -i http://127.0.0.1/healthz
curl -i http://127.0.0.1/actuator/health
make prod-aliyun-ps
```

如果服务器本机正常，但你本地浏览器打不开，去阿里云安全组确认 `80` 端口已经开放。

如果服务器本机也不正常，看日志：

```bash
docker logs --tail=200 wb-prod-nginx
docker logs --tail=200 wb-prod-web
docker logs --tail=200 wb-prod-server
```

### 13.5 后台接口请求还是指向 localhost

检查 `.env.prod`：

```bash
cd /opt/website-builder
cat .env.prod
```

确认：

```text
PUBLIC_BASE_URL=http://chunchang.tech
```

然后强制重新构建：

```bash
./scripts/aliyun-2c2g-deploy.sh --build
```

## 14. 后续换域名

当前域名是 `chunchang.tech`。如果还没做解析，先到域名控制台添加解析：

1. 在域名 DNS 里添加 A 记录，指向 `47.116.137.192`
2. 修改服务器 `.env.prod`

```bash
cd /opt/website-builder
vim .env.prod
```

确认：

```text
PUBLIC_BASE_URL=http://chunchang.tech
```

3. 重新构建部署：

```bash
./scripts/aliyun-2c2g-deploy.sh --build
```

HTTPS 证书后续可以接入 Certbot 或阿里云 SSL 证书。当前阶段先用 `http://chunchang.tech` 跑通。

## 15. 最终确认清单

部署完成后，逐项确认：

- `http://chunchang.tech/sites/chunchang` 能打开
- `http://chunchang.tech/login` 能登录
- `http://chunchang.tech/dashboard` 能进入后台
- `http://chunchang.tech/actuator/health` 返回 `UP`
- 新增菜单后可以保存
- 最后一级菜单下可以新增文章
- 富文本可以保存文字、图片、链接
- 上传图片后能拿到 URL
- 前台能看到发布后的内容
- `make prod-aliyun-backup` 能生成备份文件

这些都通过，就说明当前 2 核 2G 阿里云练手部署已经跑通。
