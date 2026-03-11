#!/bin/bash

echo "🚀 启动 Website Builder 开发环境"
echo ""

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker Desktop"
    exit 1
fi

# 启动 MySQL
echo "📦 启动 MySQL 容器..."
docker-compose up -d mysql

# 等待 MySQL 就绪
echo "⏳ 等待 MySQL 启动..."
until docker exec website-builder-mysql mysqladmin ping -h localhost -uroot -proot123456 --silent > /dev/null 2>&1; do
    printf '.'
    sleep 2
done
echo ""
echo "✅ MySQL 已就绪"

echo ""
echo "🎉 环境启动完成！"
echo ""
echo "📊 MySQL 信息："
echo "   - 主机: localhost"
echo "   - 端口: 3306"
echo "   - 数据库: website_builder"
echo "   - 用户名: root"
echo "   - 密码: root123456"
echo "   - 数据存储: /Volumes/SSD-XIAO9/docker-data/website-builder/mysql"
echo ""
echo "📝 下一步："
echo "   1. 安装依赖: npm run install:all"
echo "   2. 启动后端: npm run dev:server"
echo "   3. 启动管理后台: npm run dev:admin"
echo "   4. 启动官网预览: npm run dev:frontend"
