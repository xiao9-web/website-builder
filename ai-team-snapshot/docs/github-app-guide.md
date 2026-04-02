
# GitHub App安装指南 - 文档2.4实现

## GitHub App vs GitHub Action对比
| 特性 | GitHub Action | GitHub App |
|------|---------------|------------|
| 安装复杂度 | 低（配置文件） | 中（OAuth流程） |
| 实时响应 | 否（需要触发） | 是（Webhook） |
| 跨仓库 | 否 | 是 |
| 持久化状态 | 否 | 是 |
| 适用场景 | CI/CD集成 | 深度平台集成 |

## 安装步骤
### 步骤1：访问安装页面
运行命令：`/install-github-app`
或直接访问：https://github.com/apps/claude-code

### 步骤2：选择安装范围
- 组织级别：应用于组织下所有仓库
- 仓库级别：只应用于选定的仓库

### 步骤3：配置权限
推荐权限配置：
- Contents: Read
- Pull requests: Read & Write
- Issues: Read & Write
- Metadata: Read
- Webhooks: Read & Write

### 步骤4：配置Webhook（可选）
- Webhook URL: 你的服务器地址（例如：https://your-domain.com/api/github/webhook）
- Webhook Secret: 自定义安全密钥
- Events: Pull request, Issue comment, Push, Release

### 步骤5：配置环境变量
在仓库Secrets中添加：
```
ANTHROPIC_API_KEY: 你的Anthropic API密钥
GITHUB_APP_ID: GitHub App ID
GITHUB_APP_PRIVATE_KEY: GitHub App私钥
GITHUB_APP_WEBHOOK_SECRET: Webhook密钥
```

### 步骤6：验证安装
1. 创建一个测试PR
2. 在评论中输入 `@claude 请审查这个PR`
3. 确认Claude自动回复审查结果

## 使用场景
1. 自动代码审查：PR创建时自动运行审查
2. 交互式命令：在PR评论中使用@claude执行各种操作
3. 自动Issue处理：自动回复Issue、分配标签
4. 发布自动化：自动生成发布说明、更新CHANGELOG
