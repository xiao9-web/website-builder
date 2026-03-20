@echo off
echo 正在启动前端服务...
cd frontend
start "Frontend Website" cmd /k "npm run dev"
timeout /t 8 /nobreak >/dev/null
echo 前端服务正在启动中...
echo 前端地址: http://localhost:5174
echo.
