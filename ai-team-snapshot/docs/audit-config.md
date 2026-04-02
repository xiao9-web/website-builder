
# 审计日志配置 - 文档3.4实现

## 审计日志格式
```json
{
  "timestamp": "2025-01-15T10:30:45.123Z",
  "sessionId": "sess_abc123",
  "userId": "user@company.com",
  "event": "tool_use",
  "tool": "Bash",
  "command": "npm test",
  "status": "success",
  "duration": 5432,
  "context": {
    "workingDir": "/project",
    "branch": "feature/auth",
    "prNumber": "123"
  }
}
```

## 审计事件类型
| 事件类型 | 说明 |
|---------|------|
| tool_use | 工具调用 |
| file_access | 文件访问 |
| command_execution | 命令执行 |
| permission_change | 权限变更 |
| error | 错误事件 |
| permission_denied | 权限拒绝 |
| authentication | 认证事件 |
| deployment | 部署事件 |

## 审计日志保留策略
- 日志保留期限：90天
- 日志文件格式：按天存储，文件名格式 `YYYY-MM-DD.json`
- 存储位置：`./logs/claude-audit/`
- 备份策略：每周自动备份到对象存储
- 访问控制：只有管理员可以查看审计日志

## 审计日志分析脚本
### 1. analyze-audit.py
功能：分析审计日志，生成统计报告
运行方式：`npm run audit:analyze`

### 2. monitor-cost.py
功能：统计Token使用和成本
运行方式：`npm run audit:cost`

### 3. alert-monitor.py
功能：异常行为监控和告警
- 检测短时间内大量权限拒绝事件
- 检测敏感文件访问
- 检测高危命令执行
- 异常时发送告警通知

## 合规性要求
- 审计日志不可篡改
- 所有敏感操作必须有完整记录
- 定期进行审计日志审查
- 保留日志满足合规要求（GDPR、等保等）
