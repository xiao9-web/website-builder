
# Claude Code新成员入职清单 - 文档1.5.3实现

## 第1步：环境准备
- [ ] 安装Claude Code CLI：`npm install -g @anthropic/claude-code`
- [ ] 配置全局CLAUDE.md：复制docs/global-claude-template.md到~/.claude/CLAUDE.md
- [ ] 获取API密钥：从Anthropic控制台获取API密钥
- [ ] 配置环境变量：`export ANTHROPIC_API_KEY=your-api-key`

## 第2步：项目配置
- [ ] 克隆项目仓库：`git clone <repo-url>`
- [ ] 安装依赖：`npm install`
- [ ] 运行 `claude` 初始化项目配置
- [ ] 检查MCP服务器是否正常：`claude mcp list`
- [ ] 复制环境变量模板：`cp .env.example .env`并配置

## 第3步：熟悉规范
- [ ] 阅读项目根目录CLAUDE.md
- [ ] 阅读src/和tests/下的CLAUDE.md
- [ ] 阅读docs/ai-context/下的所有文档
- [ ] 运行 `/help` 查看所有可用命令
- [ ] 尝试运行一次代码审查：`/code-review src/example.ts`

## 第4步：验证配置
- [ ] 运行测试命令：`npm test`确认测试通过
- [ ] 运行lint命令：`npm run lint`确认无错误
- [ ] 启动开发服务器：`npm run dev`确认正常运行
- [ ] 提交一个测试PR验证CI流程
- [ ] 联系技术负责人确认配置正确

## 常用命令速查
- `/help` - 查看所有可用命令
- `/code-review` - 代码审查
- `/security-review` - 安全审查
- `/analyze-demand` - 需求分析
- `/design-arch` - 架构设计
- `npm run audit:analyze` - 查看审计日志
- `npm run audit:cost` - 查看成本统计
