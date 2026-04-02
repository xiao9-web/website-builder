# AI助理最佳实践

## 🎯 核心原则

### 1. 明确目标
- 每次使用AI助理前，先明确你想要达成的目标
- 将大目标拆解为小任务
- 使用合适的命令完成每个任务

### 2. 渐进式开发
- 从简单到复杂
- 每步验证结果
- 及时调整方向

### 3. 保持上下文
- 使用 `/context-prime` 了解项目背景
- 重要信息会自动保存到记忆中
- 新会话开始时，AI会读取之前的记忆

## 💡 使用技巧

### 命令选择

| 场景 | 推荐命令 | 说明 |
|------|----------|------|
| 开始新项目 | `/context-prime` | 快速了解项目结构 |
| 需求不明确 | `/analyze-demand` | 分析和拆解需求 |
| 技术选型 | `/design-arch` | 架构设计和技术选型 |
| 写代码 | `/dev` | 开发相关命令 |
| 修Bug | `/quick-fix` | 快速诊断和修复 |
| 代码质量 | `/code-review` | 代码审查 |
| 性能问题 | `/optimize` | 代码优化 |
| 写文章 | `/write-article` | 技术文章写作 |
| 产品设计 | `/create-prd` | 产品需求文档 |

### 提示词技巧

#### ✅ 好的提示词
```
/analyze-demand
我需要开发一个用户管理系统，包括：
1. 用户注册和登录
2. 用户信息管理
3. 权限控制
目标用户是企业内部员工，预计1000人使用
```

#### ❌ 不好的提示词
```
/analyze-demand
做个用户系统
```

### 工作流组合

#### 完整开发流程
```
/analyze-demand → /create-prd → /design-arch → /dev → /test → /code-review → /deploy
```

#### 快速迭代
```
/quick-fix → /test → /code-review
```

#### 代码优化
```
/context-prime → /optimize → /test
```

## 🔒 安全注意事项

### 1. 敏感信息
- ❌ 不要在提示词中包含真实的API密钥、密码
- ✅ 使用环境变量或配置文件
- ✅ 使用占位符，如 `YOUR_API_KEY`

### 2. 代码审查
- ✅ AI生成的代码必须经过审查
- ✅ 运行测试验证功能
- ✅ 检查安全漏洞

### 3. 数据隐私
- ❌ 不要分享用户隐私数据
- ✅ 使用脱敏数据进行测试
- ✅ 遵守数据保护法规

## 📊 效率提升技巧

### 1. 使用快捷脚本
```bash
# 快速启动工作流
npm run workflow

# 快速初始化项目
npm run setup
```

### 2. 自定义命令
在 `.claude/commands/` 目录下创建自己的命令：

```markdown
name: my-command
description: 我的自定义命令

# 命令内容
...
```

### 3. 保存常用模板
在项目中创建 `templates/` 目录，保存常用的代码模板、文档模板等。

## 🐛 常见问题

### Q: AI生成的代码有错误怎么办？
A: 使用 `/quick-fix` 描述错误，AI会帮你诊断和修复。

### Q: 如何让AI记住项目规范？
A: 编辑 `CLAUDE.md` 文件，添加你的规范要求。AI会自动读取并遵守。

### Q: 命令太多记不住怎么办？
A: 使用 `npm run workflow` 启动交互式菜单，选择你需要的命令。

### Q: 如何提高AI的回答质量？
A:
1. 提供清晰的上下文
2. 使用具体的例子
3. 明确期望的输出格式
4. 分步骤提问

## 🎓 学习资源

### 官方文档
- [Claude Code文档](https://docs.anthropic.com/claude-code)
- [MCP协议](https://modelcontextprotocol.io)

### 社区资源
- [Awesome Claude Code](https://github.com/hesreallyhim/awesome-claude-code)
- 更多技能和插件

### 项目文档
- [快速上手](./quick-start.md)
- [工作流指南](./workflow-guide.md)
- [项目规范](../CLAUDE.md)

## 🚀 进阶技巧

### 1. 创建自定义工作流
组合多个命令创建自己的工作流：

```bash
# 创建新功能的完整流程
function new-feature() {
  echo "1. 分析需求..."
  # /analyze-demand

  echo "2. 设计架构..."
  # /design-arch

  echo "3. 开发实现..."
  # /dev

  echo "4. 测试验证..."
  # /test
}
```

### 2. 集成到IDE
- 在VSCode中使用Claude Code扩展
- 配置快捷键
- 自定义代码片段

### 3. 团队协作
- 统一 `CLAUDE.md` 规范
- 共享自定义命令
- 建立最佳实践文档

## 📈 持续改进

### 反馈循环
1. 使用AI助理完成任务
2. 记录遇到的问题
3. 优化提示词和工作流
4. 更新文档和规范

### 定期回顾
- 每周回顾使用情况
- 识别常见模式
- 创建新的自定义命令
- 分享经验和技巧
