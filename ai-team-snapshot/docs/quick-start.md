# AI代码团队 - 快速上手指南

## 🎯 项目简介

这是一个基于Claude Code的个人AI助理系统，集成了多个AI角色，帮助你完成日常开发、写作等任务。

## 🚀 快速开始

### 1. 环境准备

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入必要的API密钥
```

### 2. 配置Claude Code

确保你已经安装了Claude Code CLI：
```bash
# 检查版本
claude --version

# 应该显示 v2.1 或更高版本
```

### 3. 使用AI角色

在Claude Code中，你可以使用以下命令调用不同的AI角色：

#### 📋 需求分析
```
/analyze-demand
```
用于分析需求、拆解任务、评估风险

#### 🏗️ 架构设计
```
/design-arch
```
用于设计系统架构、技术选型、接口设计

#### 💻 代码开发
```
/dev
```
快速访问开发相关命令（build、test、lint等）

#### 🔍 代码审查
```
/code-review
```
审查代码质量、安全性、性能

#### 🧪 测试
```
/test
```
编写和运行测试用例

#### 🚀 部署
```
/deploy
```
部署相关操作

#### 🔒 安全审计
```
/security
```
安全检查和审计

#### ✍️ 写文章
```
/write-article
```
帮助撰写技术文章

#### 🔧 快速修复
```
/quick-fix
```
快速诊断和修复问题

## 💡 使用场景示例

### 场景1：开发新功能

1. 使用 `/analyze-demand` 分析需求
2. 使用 `/design-arch` 设计架构
3. 使用 `/dev` 进行开发
4. 使用 `/test` 编写测试
5. 使用 `/code-review` 审查代码
6. 使用 `/deploy` 部署上线

### 场景2：写技术文章

1. 使用 `/write-article` 开始写作
2. 提供文章主题和大纲
3. AI会帮你生成结构化的文章内容
4. 包含代码示例、图表、总结等

### 场景3：修复Bug

1. 使用 `/quick-fix` 描述问题
2. AI会诊断问题原因
3. 提供多个解决方案
4. 推荐最佳方案并实施

## 🛠️ 高级配置

### 自定义AI角色

在 `.claude/commands/` 目录下创建新的 `.md` 文件：

```markdown
name: your-role
description: 角色描述

# 角色提示词
...
```

### 配置MCP服务器

编辑 `.mcp.json` 文件，添加新的服务：

```json
{
  "mcpServers": {
    "your-service": {
      "command": "npx",
      "args": ["-y", "@your/mcp-server"],
      "trust": "limited"
    }
  }
}
```

## 📚 最佳实践

1. **明确任务目标**：在使用AI角色前，先明确你想要达成的目标
2. **逐步推进**：复杂任务分步骤完成，每步使用对应的AI角色
3. **代码审查**：AI生成的代码要经过审查和测试
4. **保存记忆**：重要的项目规范和偏好会自动保存到 `.claude/memory/`
5. **安全第一**：敏感信息不要提交到代码库

## 🔗 相关资源

- [Claude Code文档](https://docs.anthropic.com/claude-code)
- [MCP协议](https://modelcontextprotocol.io)
- [项目CLAUDE.md](./CLAUDE.md) - 项目规范和配置

## ❓ 常见问题

### Q: 如何添加新的技能命令？
A: 在 `.claude/commands/` 目录下创建新的 `.md` 文件，参考现有文件的格式。

### Q: MCP服务器连接失败怎么办？
A: 检查 `.mcp.json` 配置，确保环境变量正确设置，查看 `.claude/logs/` 中的日志。

### Q: 如何自定义代码规范？
A: 编辑 `CLAUDE.md` 文件，添加你的规范要求。

## 📝 更新日志

- 2026-03-13: 添加 write-article 和 quick-fix 命令
- 2026-03-12: 初始化项目结构
