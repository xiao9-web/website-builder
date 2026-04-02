
# 项目结构说明

## 项目技术栈
- 运行环境：Node.js 22 + Python 3.12
- 编程语言：TypeScript 5.x + Python 3.x
- 构建工具：tsc + npm
- 代码规范：ESLint + Prettier
- 测试框架：Jest
- AI工具：Claude Code v2.1+

## 目录结构
```
ai-team/
├── .claude/                      # Claude Code配置
│   ├── settings.json             # 权限和工具配置
│   ├── commands/                 # 自定义命令
│   ├── hooks/                    # 生命周期钩子
│   └── skills/                   # 项目技能包
├── .github/                      # GitHub集成
│   └── workflows/                # CI/CD工作流
├── docs/                         # 项目文档
│   └── ai-context/              # AI上下文文档
├── src/                          # 源代码
├── tests/                        # 测试代码
├── CLAUDE.md                     # 主配置文件
├── .mcp.json                     # MCP服务器配置
├── .gitignore                    # Git忽略规则
├── package.json                  # 项目配置
└── tsconfig.json                 # TypeScript配置
```

## 核心模块
### 团队角色模块
- 需求分析师：负责需求拆解和任务分配
- 架构师：负责技术方案设计
- 前端开发：负责UI和交互实现
- 后端开发：负责API和业务逻辑
- 测试工程师：负责质量保证
- 运维工程师：负责部署和监控

### 工作流模块
- 需求讨论流程：用户需求 → 分析 → 设计 → 开发 → 测试 → 部署
- 代码审查流程：PR提交 → AI审查 → 人工复核 → 合并
- 发布流程：开发分支 → 测试环境 → 预发布 → 生产环境

## 代码生成约定
- 所有API响应使用统一格式：{ data, error, meta }
- 错误码使用HTTP状态码 + 业务错误码
- 所有日期时间使用UTC时区，存储为ISO 8601格式
- 日志使用结构化JSON格式
- 配置文件使用环境变量，不硬编码敏感信息
