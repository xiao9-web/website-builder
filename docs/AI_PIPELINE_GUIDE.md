# AI 自动化开发流水线使用指南

## 📋 功能说明

这是一个**无人值守**的 AI 自动化开发流水线，可以自动完成从需求分析到部署配置的全流程。

### 流程阶段

```
需求输入
   ↓
1. 需求分析（PM）→ 01_prd.md
   ↓
2. 架构设计（Architect）→ 02_design.md
   ↓
3. 代码开发（Developer）→ 03_code.md
   ↓
4. 测试用例（Tester）→ 04_test.md
   ↓
5. 部署配置（DevOps）→ 05_deploy.md
   ↓
总结报告 → 00_summary.md
```

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装 Python 依赖
pip install anthropic python-dotenv

# 或使用 requirements.txt
pip install -r requirements.txt
```

### 2. 配置 API Key

**方法1：环境变量**
```bash
export ANTHROPIC_API_KEY='your_api_key_here'
```

**方法2：.env 文件**
```bash
# 在项目根目录创建 .env 文件
echo "ANTHROPIC_API_KEY=your_api_key_here" > .env
```

**获取 API Key**：
- 访问 https://console.anthropic.com/
- 注册/登录账号
- 在 API Keys 页面创建新的 API Key

### 3. 运行脚本

```bash
# 基本用法
python run_ai_pipeline.py "我想做一个博客系统"

# 更复杂的需求
python run_ai_pipeline.py "开发一个在线商城，支持商品管理、购物车、订单支付"

# 后台运行（Linux/Mac）
nohup python run_ai_pipeline.py "我想做一个博客系统" > pipeline.log 2>&1 &

# 后台运行（使用 screen）
screen -S ai_pipeline
python run_ai_pipeline.py "我想做一个博客系统"
# 按 Ctrl+A+D 退出 screen，进程继续运行
```

### 4. 查看输出

```bash
# 查看输出目录
cd ai_output

# 查看总结报告
cat 00_summary.md

# 查看各阶段输出
cat 01_prd.md      # 需求文档
cat 02_design.md   # 架构设计
cat 03_code.md     # 代码实现
cat 04_test.md     # 测试用例
cat 05_deploy.md   # 部署配置
```

## 📁 输出文件说明

| 文件 | 内容 | 用途 |
|------|------|------|
| `00_summary.md` | 执行总结报告 | 查看整体执行情况 |
| `01_prd.md` | 产品需求文档 | 了解功能需求和验收标准 |
| `02_design.md` | 技术架构设计 | 了解系统架构和数据库设计 |
| `03_code.md` | 代码实现 | 获取完整的代码示例 |
| `04_test.md` | 测试用例 | 获取测试代码和测试策略 |
| `05_deploy.md` | 部署配置 | 获取 Docker、Nginx、CI/CD 配置 |

## ⚙️ 高级配置

### 修改模型参数

编辑 `run_ai_pipeline.py`：

```python
# 使用更强大的模型
MODEL = "claude-opus-4-6"  # 默认是 claude-sonnet-4-6

# 增加输出长度
MAX_TOKENS = 16000  # 默认是 8000

# 调整重试次数
MAX_RETRIES = 5  # 默认是 3
```

### 自定义输出目录

```python
# 修改输出目录
OUTPUT_DIR = Path("my_custom_output")
```

### 添加自定义阶段

```python
class CustomStage(PipelineStage):
    def __init__(self):
        super().__init__(
            name="自定义阶段",
            role="自定义角色",
            output_file="06_custom.md"
        )

    def build_prompt(self, input_text: str, context: Dict = None) -> str:
        return "你的自定义提示词"

# 在 AIPipeline 中添加
self.stages.append(CustomStage())
```

## 🔧 容错机制

### 测试阶段失败重试

脚本会自动重试失败的测试阶段：
- 最多重试 3 次
- 每次重试间隔 5 秒
- 如果仍失败，标记为"有风险"并继续

### 错误处理

如果流水线执行失败：
1. 会生成 `error_report.md` 错误报告
2. 已完成的阶段输出会被保留
3. 可以查看错误信息进行排查

## 🌐 部署到服务器

### 使用 Docker

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY run_ai_pipeline.py .

CMD ["python", "run_ai_pipeline.py"]
```

```bash
# 构建镜像
docker build -t ai-pipeline .

# 运行容器
docker run -e ANTHROPIC_API_KEY=your_key \
           -v $(pwd)/ai_output:/app/ai_output \
           ai-pipeline "我想做一个博客系统"
```

### 使用 GitHub Actions

```yaml
# .github/workflows/ai-pipeline.yml
name: AI Pipeline

on:
  workflow_dispatch:
    inputs:
      requirement:
        description: '需求描述'
        required: true
        default: '我想做一个博客系统'

jobs:
  run-pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install anthropic python-dotenv

      - name: Run AI Pipeline
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          python run_ai_pipeline.py "${{ github.event.inputs.requirement }}"

      - name: Upload outputs
        uses: actions/upload-artifact@v3
        with:
          name: ai-outputs
          path: ai_output/
```

### 使用云服务器

```bash
# 1. 连接到服务器
ssh user@your-server.com

# 2. 上传脚本
scp run_ai_pipeline.py user@your-server.com:~/

# 3. 在服务器上运行
ssh user@your-server.com
export ANTHROPIC_API_KEY='your_key'
nohup python run_ai_pipeline.py "我想做一个博客系统" > pipeline.log 2>&1 &

# 4. 断开连接，脚本继续运行
exit

# 5. 稍后重新连接查看结果
ssh user@your-server.com
cat pipeline.log
ls ai_output/
```

## 💡 使用技巧

### 1. 需求描述要清晰

```bash
# ❌ 不好的需求
python run_ai_pipeline.py "做一个网站"

# ✅ 好的需求
python run_ai_pipeline.py "开发一个博客系统，支持文章发布、评论、标签分类、用户认证、Markdown编辑"
```

### 2. 分阶段执行

如果只想执行某个阶段，可以修改脚本：

```python
# 只执行前3个阶段
self.stages = [
    PMStage(),
    ArchitectStage(),
    DeveloperStage(),
]
```

### 3. 查看实时日志

```bash
# 使用 tail 查看实时日志
tail -f pipeline.log

# 或使用 screen 查看
screen -r ai_pipeline
```

### 4. 批量处理多个需求

```bash
# 创建需求列表
cat > requirements.txt << EOF
我想做一个博客系统
开发一个在线商城
创建一个任务管理工具
EOF

# 批量执行
while read requirement; do
    python run_ai_pipeline.py "$requirement"
    sleep 60  # 避免 API 限流
done < requirements.txt
```

## 🚨 常见问题

### Q1: API Key 无效

```
❌ 未找到 ANTHROPIC_API_KEY 环境变量
```

**解决方法**：
1. 检查 API Key 是否正确
2. 确认环境变量已设置：`echo $ANTHROPIC_API_KEY`
3. 或创建 .env 文件

### Q2: 依赖库缺失

```
❌ 缺少必要的依赖库
```

**解决方法**：
```bash
pip install anthropic python-dotenv
```

### Q3: API 限流

```
❌ Rate limit exceeded
```

**解决方法**：
1. 等待一段时间后重试
2. 升级 API 套餐
3. 在批量执行时增加延迟

### Q4: 输出不符合预期

**解决方法**：
1. 优化需求描述，提供更多细节
2. 修改提示词模板
3. 使用更强大的模型（Opus）

### Q5: 关机后无法继续运行

**解决方法**：
1. 使用云服务器运行
2. 使用 GitHub Actions
3. 使用 Docker 容器

## 📊 性能参考

| 阶段 | 预计耗时 | Token 消耗 |
|------|----------|------------|
| 需求分析 | 30-60秒 | 2000-4000 |
| 架构设计 | 60-90秒 | 4000-6000 |
| 代码开发 | 90-120秒 | 6000-8000 |
| 测试用例 | 60-90秒 | 4000-6000 |
| 部署配置 | 60-90秒 | 4000-6000 |
| **总计** | **5-8分钟** | **20000-30000** |

**成本估算**（Claude Sonnet 4.6）：
- 输入：$3 / 1M tokens
- 输出：$15 / 1M tokens
- 单次运行成本：约 $0.3-0.5

## 🎯 最佳实践

1. **需求要具体**：提供详细的功能需求和技术约束
2. **分批执行**：复杂项目可以分多次执行不同模块
3. **人工审核**：AI 生成的内容需要人工审核和调整
4. **版本控制**：将输出文件纳入 Git 管理
5. **持续迭代**：根据输出结果优化需求描述

## 📞 技术支持

如有问题，请：
1. 查看错误报告：`cat ai_output/error_report.md`
2. 查看日志文件：`cat pipeline.log`
3. 提交 Issue 到 GitHub

---

**祝你使用愉快！🚀**
