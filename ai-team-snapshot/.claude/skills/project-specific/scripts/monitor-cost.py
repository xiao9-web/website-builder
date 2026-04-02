
#!/usr/bin/env python3
# 成本监控脚本

import json
from pathlib import Path
from datetime import datetime, timedelta

# 价格配置（美元/百万tokens）
PRICING = {
    "claude-sonnet-4-6": {"input": 3.0, "output": 15.0},
    "claude-haiku-4": {"input": 0.25, "output": 1.25},
    "claude-opus-4-6": {"input": 15.0, "output": 75.0}
}

def calculate_daily_cost(log_dir: str, date: str = None):
    """计算指定日期的使用成本"""

    if date is None:
        date = datetime.now().strftime("%Y-%m-%d")

    log_file = Path(log_dir) / f"{date}.json"

    if not log_file.exists():
        return {"date": date, "total_cost": 0, "details": []}

    with open(log_file) as f:
        data = json.load(f)

    total_cost = 0
    details = []

    for entry in data.get("entries", []):
        if "tokens" not in entry:
            continue

        model = entry.get("model", "claude-sonnet-4-6")
        prices = PRICING.get(model, PRICING["claude-sonnet-4-6"])

        input_tokens = entry["tokens"].get("input", 0)
        output_tokens = entry["tokens"].get("output", 0)

        cost = (input_tokens / 1_000_000 * prices["input"]) + \
               (output_tokens / 1_000_000 * prices["output"])

        total_cost += cost
        details.append({
            "time": entry.get("timestamp"),
            "model": model,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cost": cost
        })

    return {
        "date": date,
        "total_cost": total_cost,
        "details": details
    }

if __name__ == "__main__":
    import sys
    log_dir = sys.argv[1] if len(sys.argv) > 1 else "./logs/claude-audit/"
    today = calculate_daily_cost(log_dir)
    print(f"今日成本：${today['total_cost']:.2f}")
    
    # 周统计
    week_cost = 0
    for i in range(7):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        day_cost = calculate_daily_cost(log_dir, date)
        week_cost += day_cost["total_cost"]
    
    print(f"本周成本：${week_cost:.2f}")
