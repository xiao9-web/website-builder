# 🤖 AI代码团队

> 基于Claude Code的个人AI助理系统，集成多个AI角色，助力日常开发和写作

## ✨ 特性

- 🎭 **多角色AI团队**：需求分析师、架构师、开发、测试、运维等
- 🔧 **工作流自动化**：从需求到部署的完整流程支持
- ✍️ **写作助手**：帮助撰写技术文章、文档
- 🔍 **智能诊断**：快速定位和修复问题
- 🔒 **安全审计**：代码安全检查和合规审计
- 📊 **MCP集成**：GitHub、代码解释器、网络搜索等

## 🚀 快速开始

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd ai-team

# 2. 初始化
npm run setup

# 3. 配置环境变量
# 编辑 .env 文件，填入必要的API密钥

# 4. 在Claude Code中使用
# 打开项目目录，使用 /analyze-demand、/design-arch 等命令
```

## 📖 使用指南

详细使用说明请查看：
- [快速上手指南](docs/quick-start.md) - 5分钟快速入门
- [工作流指南](docs/workflow-guide.md) - 完整工作流程
- [最佳实践](docs/best-practices.md) - 使用技巧和注意事项
- [角色优化总结](docs/roles-optimization-summary.md) - AI角色详细说明

### 核心命令

| 命令 | 说明 | 使用场景 |
|------|------|----------|
| `/analyze-demand` | 需求分析 | 分析需求、拆解任务 |
| `/create-prd` | 产品需求文档 | 创建PRD文档 |
| `/design-arch` | 架构设计 | 技术选型、架构设计 |
| `/context-prime` | 项目上下文 | 快速了解项目结构 |
| `/dev` | 开发工具 | 构建、测试、格式化 |
| `/code-review` | 代码审查 | 质量检查、安全审查 |
| `/optimize` | 代码优化 | 性能优化、重构 |
| `/test` | 测试 | 编写和运行测试 |
| `/deploy` | 部署 | 部署相关操作 |
| `/security` | 安全审计 | 安全检查和审计 |
| `/write-article` | 写文章 | 技术文章写作 |
| `/quick-fix` | 快速修复 | 问题诊断和修复 |

## 🏗️ 项目结构

```
ai-team/
├── .claude/                 # Claude Code配置
│   ├── commands/           # AI角色命令
│   ├── skills/             # 自定义技能
│   ├── memory/             # 持久化记忆
│   └── settings.json       # 设置
├── backend/                # 后端代码
├── docs/                   # 文档
│   ├── quick-start.md     # 快速上手
│   ├── workflow-guide.md  # 工作流指南
│   ├── best-practices.md  # 最佳实践
│   └── ...
├── scripts/                # 工具脚本
│   └── workflow.js        # 工作流启动器
├── src/                    # 源代码
├── tests/                  # 测试
├── .mcp.json              # MCP服务器配置
├── CLAUDE.md              # 项目规范
└── package.json           # 项目配置
```

## 💡 使用示例

### 开发新功能

```bash
# 1. 分析需求
/analyze-demand
# 描述你的需求...

# 2. 设计架构
/design-arch
# 基于需求分析结果设计架构...

# 3. 开发实现
# AI会帮你生成代码

# 4. 代码审查
/code-review
# 审查生成的代码

# 5. 测试
/test
# 编写和运行测试

# 6. 部署
/deploy
```

### 写技术文章

```bash
/write-article
# 主题：如何使用Claude Code构建AI助理
# AI会生成完整的文章结构和内容
```

### 修复Bug

```bash
/quick-fix
# 描述问题：用户登录失败，返回500错误
# AI会诊断问题并提供解决方案
```

## 🛠️ 技术栈

- **运行时**：Node.js 22, Python 3.12
- **语言**：TypeScript
- **AI**：Claude Code v2.1+
- **协议**：MCP (Model Context Protocol)

## 📋 待办事项

- [ ] 添加更多AI角色（产品经理、UI设计师等）
- [ ] 集成更多MCP服务器
- [ ] 添加工作流可视化
- [ ] 支持团队协作
- [ ] 添加性能监控

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

ISC

## 🔗 相关链接

### 官方资源

- [Claude Code文档](https://docs.anthropic.com/claude-code)
- [MCP协议](https://modelcontextprotocol.io)

### 项目文档

- [项目规范](./CLAUDE.md)
- [快速上手](./docs/quick-start.md)
- [工作流指南](./docs/workflow-guide.md)
- [最佳实践](./docs/best-practices.md)

### 社区资源

- [Awesome Claude Code](https://github.com/hesreallyhim/awesome-claude-code) - 精选的Claude Code资源集合
- [Claude Scientific Skills](https://github.com/K-Dense-AI/claude-scientific-skills) - 科研、工程、分析技能集
