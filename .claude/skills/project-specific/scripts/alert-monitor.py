
#!/usr/bin/env python3
# 异常行为监控脚本 - 文档3.4实现

import json
from pathlib import Path
from datetime import datetime, timedelta
from collections import defaultdict

def monitor_anomalies(log_dir: str, hours: int = 1):
    """监控最近N小时的异常行为"""
    
    log_path = Path(log_dir)
    cutoff = datetime.now() - timedelta(hours=hours)
    
    anomalies = {
        "permission_denied": [],
        "sensitive_access": [],
        "high_risk_commands": [],
        "error_events": [],
        "unusual_activity": []
    }
    
    # 统计用户活动
    user_activity = defaultdict(int)
    command_usage = defaultdict(int)
    
    for log_file in log_path.glob("*.json"):
        try:
            file_date = datetime.strptime(log_file.stem, "%Y-%m-%d")
            if file_date.date() < cutoff.date():
                continue

            with open(log_file) as f:
                data = json.load(f)

            for entry in data.get("entries", []):
                entry_time = datetime.fromisoformat(entry["timestamp"].replace("Z", "+00:00"))
                if entry_time < cutoff:
                    continue

                user_activity[entry.get("userId", "unknown")] += 1
                command_usage[entry.get("command", "unknown")] += 1

                # 权限拒绝事件
                if entry.get("status") == "blocked":
                    anomalies["permission_denied"].append(entry)
                
                # 敏感文件访问
                sensitive_patterns = [".env", "secrets", "credentials", "key", "password"]
                path = entry.get("path", "")
                if any(pattern in path for pattern in sensitive_patterns):
                    anomalies["sensitive_access"].append(entry)
                
                # 高危命令
                high_risk_commands = ["rm -rf", "sudo", "curl | bash", "wget | bash", "git push --force"]
                command = entry.get("command", "")
                if any(risk in command for risk in high_risk_commands):
                    anomalies["high_risk_commands"].append(entry)
                
                # 错误事件
                if entry.get("event") == "error":
                    anomalies["error_events"].append(entry)

        except Exception as e:
            print(f"Error processing {log_file}: {e}")
    
    # 检测异常活跃用户
    avg_activity = sum(user_activity.values()) / max(len(user_activity), 1)
    for user, count in user_activity.items():
        if count > avg_activity * 5:  # 超过平均5倍视为异常
            anomalies["unusual_activity"].append({
                "type": "high_activity",
                "user": user,
                "count": count,
                "average": avg_activity
            })
    
    return anomalies

def generate_alert_report(anomalies: dict) -> str:
    """生成告警报告"""
    
    report = []
    report.append("=" * 60)
    report.append("🚨 安全告警报告")
    report.append("=" * 60)
    report.append(f"生成时间：{datetime.now().isoformat()}")
    report.append("")
    
    total_anomalies = sum(len(v) for v in anomalies.values())
    report.append(f"总异常事件数：{total_anomalies}")
    report.append("")
    
    if anomalies["permission_denied"]:
        report.append(f"🔒 权限拒绝事件：{len(anomalies['permission_denied'])}次")
        for entry in anomalies["permission_denied"][:5]:
            report.append(f"  - {entry['timestamp']}: 用户 {entry.get('userId')} 尝试访问 {entry.get('path')} 被拒绝")
    
    if anomalies["sensitive_access"]:
        report.append(f"⚠️  敏感文件访问：{len(anomalies['sensitive_access'])}次")
        for entry in anomalies["sensitive_access"][:5]:
            report.append(f"  - {entry['timestamp']}: 用户 {entry.get('userId')} 访问了敏感文件 {entry.get('path')}")
    
    if anomalies["high_risk_commands"]:
        report.append(f"☠️  高危命令执行：{len(anomalies['high_risk_commands'])}次")
        for entry in anomalies["high_risk_commands"][:5]:
            report.append(f"  - {entry['timestamp']}: 用户 {entry.get('userId')} 执行了高危命令：{entry.get('command')}")
    
    if anomalies["error_events"]:
        report.append(f"❌ 错误事件：{len(anomalies['error_events'])}次")
        for entry in anomalies["error_events"][:5]:
            report.append(f"  - {entry['timestamp']}: {entry.get('message')}")
    
    if anomalies["unusual_activity"]:
        report.append(f"⚡ 异常活动：{len(anomalies['unusual_activity'])}次")
        for activity in anomalies["unusual_activity"]:
            report.append(f"  - 用户 {activity['user']} 活动异常：{activity['count']}次操作（平均：{activity['average']:.1f}）")
    
    if total_anomalies > 0:
        report.append("")
        report.append("⚠️  请及时检查上述异常事件！")
    else:
        report.append("✅ 未发现异常行为")
    
    return "\n".join(report)

if __name__ == "__main__":
    import sys
    log_dir = sys.argv[1] if len(sys.argv) > 1 else "./logs/claude-audit/"
    hours = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    
    anomalies = monitor_anomalies(log_dir, hours)
    print(generate_alert_report(anomalies))
    
    # 如果有高危异常，退出码为1，用于CI/CD告警
    if len(anomalies["high_risk_commands"]) > 0 or len(anomalies["permission_denied"]) > 10:
        sys.exit(1)
