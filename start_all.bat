@echo off
echo 正在启动网站构建系统所有服务...

echo 1. 检查并启动数据库（Docker）
echo 请确保Docker已安装并运行，然后执行以下命令启动MySQL数据库：
echo docker run -d --name website-builder-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root123456 -e MYSQL_DATABASE=website_builder mysql:latest
echo.

echo 2. 启动后端服务
start "" cmd /k "cd /d %~dp0server && npm run start:dev"
echo 后端服务启动中...
timeout /t 10 >nul

echo 3. 启动管理后台
start "" cmd /k "cd /d %~dp0admin && npm run dev"
echo 管理后台启动中...
timeout /t 5 >nul

echo 4. 启动前端服务
start "" cmd /k "cd /d %~dp0frontend && npm run dev"
echo 前端服务启动中...
timeout /t 5 >nul

echo.
echo 服务启动完成！
echo - 后端服务: http://localhost:3000
echo - 管理后台: http://localhost:5173 (或其他可用端口)
echo - 前端服务: http://localhost:5174 (或其他可用端口)
echo.
echo 按任意键关闭此窗口...
pause >nul
