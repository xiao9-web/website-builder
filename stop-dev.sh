#!/bin/bash

# 网站构建系统 - 停止开发环境脚本

echo "🛑 停止网站构建系统开发环境..."
echo ""

# 停止 Node.js 进程
echo "停止后端服务..."
pkill -f "nest start" || echo "后端服务未运行"

echo "停止管理后台..."
lsof -ti:5174 | xargs kill -9 2>/dev/null || echo "管理后台未运行"

echo "停止前端官网..."
lsof -ti:5175 | xargs kill -9 2>/dev/null || echo "前端官网未运行"

echo ""
echo "✅ 所有服务已停止"
