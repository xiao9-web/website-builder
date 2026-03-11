#!/bin/bash

# 网站构建系统 - 开发环境启动脚本

echo "🚀 启动网站构建系统开发环境..."
echo ""

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker"
    exit 1
fi

# 启动 MySQL 数据库
echo "📦 检查 MySQL 数据库..."
if ! docker ps | grep -q website-builder-mysql; then
    echo "启动 MySQL 容器..."
    docker-compose up -d
    echo "等待 MySQL 启动..."
    sleep 10
else
    echo "✅ MySQL 已在运行"
fi

# 启动后端服务
echo ""
echo "🔧 启动后端服务 (端口 3000)..."
cd server && npm run start:dev > /tmp/server.log 2>&1 &
SERVER_PID=$!
echo "后端服务 PID: $SERVER_PID"

# 等待后端启动
sleep 5

# 启动管理后台
echo ""
echo "💼 启动管理后台 (端口 5173/5174)..."
cd ../admin && npm run dev > /tmp/admin.log 2>&1 &
ADMIN_PID=$!
echo "管理后台 PID: $ADMIN_PID"

# 启动前端官网
echo ""
echo "🌐 启动前端官网 (端口 5174/5175)..."
cd ../frontend && npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "前端官网 PID: $FRONTEND_PID"

echo ""
echo "✅ 所有服务启动完成！"
echo ""
echo "📋 服务地址："
echo "  - 后端 API:    http://localhost:3000/api/v1"
echo "  - 管理后台:    http://localhost:5174"
echo "  - 前端官网:    http://localhost:5175"
echo ""
echo "📝 日志文件："
echo "  - 后端日志:    /tmp/server.log"
echo "  - 管理后台日志: /tmp/admin.log"
echo "  - 前端官网日志: /tmp/frontend.log"
echo ""
echo "🛑 停止服务: ./stop-dev.sh"
