#!/usr/bin/env python3
"""
AI 自动化开发流水线
无人值守模式 - 可在后台运行完整开发流程

使用方法：
    python run_ai_pipeline.py "我想做一个博客系统"

环境要求：
    pip install anthropic python-dotenv

环境变量：
    ANTHROPIC_API_KEY=your_api_key_here
"""

import os
import sys
import json
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional
import traceback

try:
    from anthropic import Anthropic
    from dotenv import load_dotenv
except ImportError:
    print("❌ 缺少必要的依赖库")
    print("\n请运行以下命令安装：")
    print("  pip install anthropic python-dotenv")
    sys.exit(1)

# 加载环境变量
load_dotenv()

# 配置
API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not API_KEY:
    print("❌ 未找到 ANTHROPIC_API_KEY 环境变量")
    print("\n请设置 API Key：")
    print("  export ANTHROPIC_API_KEY='your_api_key_here'")
    print("或在项目根目录创建 .env 文件：")
    print("  ANTHROPIC_API_KEY=your_api_key_here")
    sys.exit(1)

# 初始化 Claude 客户端
client = Anthropic(api_key=API_KEY)

# 配置参数
MODEL = "claude-sonnet-4-6"
MAX_TOKENS = 8000
MAX_RETRIES = 3
OUTPUT_DIR = Path("ai_output")

# 创建输出目录
OUTPUT_DIR.mkdir(exist_ok=True)


class PipelineStage:
    """流水线阶段基类"""

    def __init__(self, name: str, role: str, output_file: str):
        self.name = name
        self.role = role
        self.output_file = output_file
        self.output_path = OUTPUT_DIR / output_file

    def run(self, input_text: str, context: Dict = None) -> str:
        """执行阶段任务"""
        print(f"\n{'='*60}")
        print(f"🚀 开始阶段：{self.name}")
        print(f"{'='*60}")

        prompt = self.build_prompt(input_text, context)

        try:
            response = self.call_claude(prompt)
            self.save_output(response)
            print(f"✅ {self.name} 完成")
            print(f"📄 输出已保存到：{self.output_path}")
            return response
        except Exception as e:
            print(f"❌ {self.name} 失败：{str(e)}")
            traceback.print_exc()
            raise

    def build_prompt(self, input_text: str, context: Dict = None) -> str:
        """构建提示词（子类实现）"""
        raise NotImplementedError

    def call_claude(self, prompt: str) -> str:
        """调用 Claude API"""
        print(f"📡 正在调用 Claude API...")

        message = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            messages=[{
                "role": "user",
                "content": prompt
            }]
        )

        return message.content[0].text

    def save_output(self, content: str):
        """保存输出到文件"""
        self.output_path.write_text(content, encoding='utf-8')


class PMStage(PipelineStage):
    """产品经理阶段：需求分析"""

    def __init__(self):
        super().__init__(
            name="需求分析（PM）",
            role="产品经理",
            output_file="01_prd.md"
        )

    def build_prompt(self, input_text: str, context: Dict = None) -> str:
        return f"""你是一位资深产品经理，请对以下需求进行深度分析：

用户需求：
{input_text}

请输出一份完整的 PRD（产品需求文档），包括：

## 1. 需求概述
- 核心目标
- 目标用户
- 使用场景

## 2. 功能需求
- 核心功能列表（按优先级排序）
- 每个功能的详细描述
- 用户故事（User Story）

## 3. 非功能需求
- 性能要求
- 安全要求
- 可扩展性要求

## 4. 技术约束
- 技术栈建议
- 第三方服务依赖

## 5. 验收标准
- 明确的验收条件

请用 Markdown 格式输出，内容要详细、专业。"""


class ArchitectStage(PipelineStage):
    """架构师阶段：技术设计"""

    def __init__(self):
        super().__init__(
            name="架构设计（Architect）",
            role="架构师",
            output_file="02_design.md"
        )

    def build_prompt(self, input_text: str, context: Dict = None) -> str:
        prd = context.get('prd', '') if context else ''

        return f"""你是一位资深架构师，请根据以下 PRD 进行技术架构设计：

{prd}

请输出一份完整的技术设计文档，包括：

## 1. 系统架构
- 整体架构图（用文字描述）
- 模块划分
- 技术栈选型及理由

## 2. 数据库设计
- 数据表结构（包含字段、类型、索引）
- 表关系图（用文字描述）

## 3. API 设计
- RESTful API 列表
- 每个 API 的请求/响应格式
- 认证授权方案

## 4. 关键技术方案
- 核心功能的实现方案
- 性能优化方案
- 安全方案

## 5. 部署架构
- 服务器配置
- 容器化方案
- CI/CD 流程

请用 Markdown 格式输出，内容要详细、可执行。"""


class DeveloperStage(PipelineStage):
    """开发阶段：代码实现"""

    def __init__(self):
        super().__init__(
            name="代码开发（Developer）",
            role="开发工程师",
            output_file="03_code.md"
        )

    def build_prompt(self, input_text: str, context: Dict = None) -> str:
        design = context.get('design', '') if context else ''

        return f"""你是一位资深全栈开发工程师，请根据以下技术设计文档实现代码：

{design}

请输出以下内容：

## 1. 项目结构
```
project/
├── backend/
│   ├── src/
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── src/
│   ├── tests/
│   └── package.json
└── docker-compose.yml
```

## 2. 后端代码
- 核心模块的完整代码
- 数据库模型
- API 接口实现
- 中间件和工具函数

## 3. 前端代码
- 核心组件的完整代码
- 状态管理
- API 调用封装
- 路由配置

## 4. 配置文件
- package.json
- tsconfig.json
- .env.example
- docker-compose.yml

## 5. 使用说明
- 安装依赖命令
- 启动开发环境命令
- 环境变量配置说明

请输出完整的、可运行的代码，使用 Markdown 代码块格式。"""


class TesterStage(PipelineStage):
    """测试阶段：测试用例"""

    def __init__(self):
        super().__init__(
            name="测试（Tester）",
            role="测试工程师",
            output_file="04_test.md"
        )

    def build_prompt(self, input_text: str, context: Dict = None) -> str:
        code = context.get('code', '') if context else ''

        return f"""你是一位资深测试工程师，请为以下代码编写测试用例：

{code[:3000]}...  # 截取部分代码

请输出以下内容：

## 1. 测试策略
- 单元测试范围
- 集成测试范围
- E2E 测试范围

## 2. 单元测试代码
- 后端核心模块的单元测试
- 前端核心组件的单元测试
- 测试覆盖率目标：> 80%

## 3. 集成测试代码
- API 集成测试
- 数据库集成测试

## 4. E2E 测试用例
- 主要用户流程的 E2E 测试脚本

## 5. 测试报告模板
- 测试结果记录表格
- Bug 报告模板

请输出完整的测试代码，使用 Markdown 代码块格式。"""


class DevOpsStage(PipelineStage):
    """运维阶段：部署配置"""

    def __init__(self):
        super().__init__(
            name="部署运维（DevOps）",
            role="运维工程师",
            output_file="05_deploy.md"
        )

    def build_prompt(self, input_text: str, context: Dict = None) -> str:
        code = context.get('code', '') if context else ''
        test = context.get('test', '') if context else ''

        return f"""你是一位资深运维工程师，请为以下项目配置部署方案：

代码信息：
{code[:1000]}...

测试信息：
{test[:1000]}...

请输出以下内容：

## 1. Docker 配置
- Dockerfile（后端）
- Dockerfile（前端）
- docker-compose.yml（完整配置）

## 2. Nginx 配置
- nginx.conf
- 反向代理配置
- SSL 证书配置

## 3. CI/CD 配置
- GitHub Actions 工作流
- 自动化测试
- 自动化部署

## 4. 部署脚本
- 一键部署脚本（deploy.sh）
- 环境初始化脚本（init.sh）
- 备份脚本（backup.sh）

## 5. 监控配置
- 日志收集配置
- 性能监控配置
- 告警配置

## 6. 部署文档
- 服务器要求
- 部署步骤
- 常见问题排查

请输出完整的配置文件和脚本，使用 Markdown 代码块格式。"""


class AIPipeline:
    """AI 自动化开发流水线"""

    def __init__(self, requirement: str):
        self.requirement = requirement
        self.context = {}
        self.stages = [
            PMStage(),
            ArchitectStage(),
            DeveloperStage(),
            TesterStage(),
            DevOpsStage(),
        ]
        self.start_time = datetime.now()

    def run(self):
        """运行完整流水线"""
        print("\n" + "="*60)
        print("🤖 AI 自动化开发流水线启动")
        print("="*60)
        print(f"📝 需求：{self.requirement}")
        print(f"⏰ 开始时间：{self.start_time.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"📁 输出目录：{OUTPUT_DIR.absolute()}")

        try:
            # 阶段1：需求分析
            prd = self.stages[0].run(self.requirement)
            self.context['prd'] = prd

            # 阶段2：架构设计
            design = self.stages[1].run(self.requirement, self.context)
            self.context['design'] = design

            # 阶段3：代码开发
            code = self.stages[2].run(self.requirement, self.context)
            self.context['code'] = code

            # 阶段4：测试（带重试机制）
            test = self.run_with_retry(self.stages[3], self.requirement)
            self.context['test'] = test

            # 阶段5：部署运维
            deploy = self.stages[4].run(self.requirement, self.context)
            self.context['deploy'] = deploy

            # 生成总结报告
            self.generate_summary()

            print("\n" + "="*60)
            print("🎉 流水线执行完成！")
            print("="*60)
            self.print_summary()

        except Exception as e:
            print(f"\n❌ 流水线执行失败：{str(e)}")
            traceback.print_exc()
            self.generate_error_report(e)
            sys.exit(1)

    def run_with_retry(self, stage: PipelineStage, input_text: str) -> str:
        """带重试机制的阶段执行"""
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                return stage.run(input_text, self.context)
            except Exception as e:
                if attempt < MAX_RETRIES:
                    print(f"⚠️  第 {attempt} 次尝试失败，{MAX_RETRIES - attempt} 次重试机会剩余")
                    print(f"等待 5 秒后重试...")
                    time.sleep(5)
                else:
                    print(f"❌ 已达到最大重试次数（{MAX_RETRIES}），标记为有风险并继续")
                    # 返回错误信息作为输出
                    error_msg = f"# 测试阶段失败\n\n错误信息：{str(e)}\n\n⚠️ 警告：测试未通过，部署存在风险"
                    stage.save_output(error_msg)
                    return error_msg

    def generate_summary(self):
        """生成总结报告"""
        end_time = datetime.now()
        duration = end_time - self.start_time

        summary = f"""# AI 自动化开发流水线 - 执行报告

## 基本信息
- **需求**：{self.requirement}
- **开始时间**：{self.start_time.strftime('%Y-%m-%d %H:%M:%S')}
- **结束时间**：{end_time.strftime('%Y-%m-%d %H:%M:%S')}
- **总耗时**：{duration}

## 输出文件
1. ✅ 需求文档：`{self.stages[0].output_file}`
2. ✅ 架构设计：`{self.stages[1].output_file}`
3. ✅ 代码实现：`{self.stages[2].output_file}`
4. ✅ 测试用例：`{self.stages[3].output_file}`
5. ✅ 部署配置：`{self.stages[4].output_file}`

## 下一步操作
1. 查看输出文件，确认内容是否符合预期
2. 根据代码文档创建实际的项目文件
3. 运行测试用例验证功能
4. 按照部署文档进行部署

## 注意事项
- 所有输出都是 AI 生成的，需要人工审核
- 代码可能需要调整才能运行
- 测试用例需要根据实际情况修改
- 部署前请仔细检查配置

---
生成时间：{end_time.strftime('%Y-%m-%d %H:%M:%S')}
"""

        summary_path = OUTPUT_DIR / "00_summary.md"
        summary_path.write_text(summary, encoding='utf-8')
        print(f"\n📊 总结报告已保存到：{summary_path}")

    def generate_error_report(self, error: Exception):
        """生成错误报告"""
        error_report = f"""# 流水线执行失败报告

## 错误信息
```
{str(error)}
```

## 堆栈跟踪
```
{traceback.format_exc()}
```

## 已完成的阶段
{self._list_completed_stages()}

## 建议
1. 检查 API Key 是否有效
2. 检查网络连接是否正常
3. 查看具体错误信息，针对性解决
4. 如果是 API 限流，请稍后重试

---
错误时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""

        error_path = OUTPUT_DIR / "error_report.md"
        error_path.write_text(error_report, encoding='utf-8')
        print(f"\n📄 错误报告已保存到：{error_path}")

    def _list_completed_stages(self) -> str:
        """列出已完成的阶段"""
        completed = []
        for stage in self.stages:
            if stage.output_path.exists():
                completed.append(f"- ✅ {stage.name}")
            else:
                completed.append(f"- ❌ {stage.name}")
        return "\n".join(completed)

    def print_summary(self):
        """打印总结信息"""
        end_time = datetime.now()
        duration = end_time - self.start_time

        print(f"\n📊 执行总结：")
        print(f"  ⏱️  总耗时：{duration}")
        print(f"  📁 输出目录：{OUTPUT_DIR.absolute()}")
        print(f"\n📄 生成的文件：")
        for stage in self.stages:
            if stage.output_path.exists():
                size = stage.output_path.stat().st_size
                print(f"  ✅ {stage.output_file} ({size} bytes)")

        print(f"\n💡 下一步：")
        print(f"  1. 查看输出文件：cd {OUTPUT_DIR}")
        print(f"  2. 阅读总结报告：cat 00_summary.md")
        print(f"  3. 根据文档创建实际项目")


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("用法：python run_ai_pipeline.py \"需求描述\"")
        print("\n示例：")
        print("  python run_ai_pipeline.py \"我想做一个博客系统\"")
        print("  python run_ai_pipeline.py \"开发一个在线商城\"")
        sys.exit(1)

    requirement = sys.argv[1]

    # 创建并运行流水线
    pipeline = AIPipeline(requirement)
    pipeline.run()


if __name__ == "__main__":
    main()
