
# 上下文管理优化指南 - 文档4.1实现

## 上下文窗口构成
```
┌─────────────────────────────────────────────────────────────┐
│                    上下文窗口构成                            │
├─────────────────────────────────────────────────────────────┤
│  系统提示词 (System Prompt)       ~2,000 tokens             │
│  CLAUDE.md 项目配置              ~1,000-5,000 tokens        │
│  对话历史 (History)               动态增长                   │
│  工具结果 (Tool Results)          动态增长                   │
│  当前消息 (Current)               用户输入                   │
│                                                             │
│  总计：最大 200,000 tokens（Claude Sonnet 4.6）             │
└─────────────────────────────────────────────────────────────┘
```

## 优化策略
### 策略1：精简CLAUDE.md
**优化前（冗长）**：
```markdown
## 代码规范
我们的团队使用以下代码规范。首先，所有代码必须使用TypeScript编写。
其次，我们要求所有函数都有JSDoc注释。另外，变量命名必须遵循
camelCase规范。还有，类名必须使用PascalCase...
（继续500字）
```

**优化后（精简）**：
```markdown
## 代码规范
- 语言：TypeScript
- 注释：JSDoc必需
- 命名：变量camelCase，类PascalCase
- 行数：函数<50行，类<300行
```

### 策略2：使用文件引用而非内联
**不推荐**：在CLAUDE.md中内联大量内容
```markdown
## API文档
{大量JSON内容...}
```

**推荐**：引用外部文件
```markdown
## API文档
详见 `docs/api-reference.md`
```

### 策略3：分层配置
```plaintext
项目根目录/CLAUDE.md        # 核心规则（<1000 tokens）
├── src/CLAUDE.md          # 源码规则（<500 tokens）
├── tests/CLAUDE.md        # 测试规则（<500 tokens）
└── docs/CLAUDE.md         # 文档规则（<300 tokens）
```

### 策略4：对话管理
- 定期清理对话：使用 `/clear` 命令清理历史
- 创建新会话：`claude --new-session`
- 分解大任务：将复杂任务拆分为多个小步骤
- 使用Shift+Enter换行输入多行指令

## 上下文大小监控
启用verbose模式可以查看上下文使用情况：
```bash
claude --verbose
```

日志示例：
```
[DEBUG] Context size: 5,432 tokens
[DEBUG] Available context: 194,568 tokens
```

## 最佳实践
1. 保持CLAUDE.md精简，不超过5000字符
2. 避免在对话中粘贴大量代码，使用文件引用
3. 定期清理不需要的对话历史
4. 大任务分步骤处理，每步不超过1个核心目标
5. 使用摘要替代完整历史记录
