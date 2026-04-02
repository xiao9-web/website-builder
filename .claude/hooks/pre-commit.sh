#!/bin/bash
# 提交前检查钩子 - 文档1.2.2实现

echo "🔍 执行提交前检查..."

# 1. 代码格式化检查
echo "📝 检查代码格式..."
npm run format:check
if [ $? -ne 0 ]; then
  echo "❌ 代码格式不符合规范，请运行 npm run format 修复"
  exit 1
fi

# 2. 代码lint检查
echo "🔎 检查代码质量..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ 代码存在lint错误，请修复后再提交"
  exit 1
fi

# 3. 单元测试
echo "🧪 运行单元测试..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ 单元测试未通过，请修复后再提交"
  exit 1
fi

# 4. 安全扫描
echo "🛡️  执行安全扫描..."
npm run audit:security
if [ $? -ne 0 ]; then
  echo "❌ 发现安全漏洞，请修复后再提交"
  exit 1
fi

# 5. 敏感信息检查
echo "🔒 检查敏感信息..."
grep -r "api_key\|password\|secret\|token" --include="*.ts" --include="*.js" --include="*.json" src/ | grep -v ".d.ts" | grep -v "node_modules"
if [ $? -eq 0 ]; then
  echo "❌ 发现可能的敏感信息硬编码，请检查后再提交"
  exit 1
fi

echo "✅ 所有检查通过，可以提交！"
exit 0
