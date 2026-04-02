#!/bin/bash
# 审查后处理钩子 - 文档1.2.2实现

REVIEW_RESULT=$1
PR_NUMBER=$2

echo "📝 处理代码审查结果..."

# 如果审查通过，自动添加通过标签
if [ "$REVIEW_RESULT" = "approved" ]; then
  echo "✅ 代码审查通过，添加approved标签"
  gh pr edit $PR_NUMBER --add-label "approved"
  
  # 自动运行部署到测试环境
  echo "🚀 自动部署到测试环境..."
  npm run deploy:staging
else
  echo "❌ 代码审查未通过，添加needs-changes标签"
  gh pr edit $PR_NUMBER --add-label "needs-changes"
  
  # 发送通知给提交者
  echo "📧 发送修改通知..."
  # 这里可以集成企业微信/飞书通知
fi

# 生成审查报告
echo "📊 生成审查报告..."
npm run audit:analyze > review-report.txt

echo "✅ 审查后处理完成！"
