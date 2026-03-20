@echo off
echo 正在启动后端服务...
cd server
start "Backend Service" cmd /k "npm run start:dev"
timeout /t 10 /nobreak >/dev/null
echo 后端服务正在启动中，请等待...
echo 后端服务地址: http://localhost:3000
echo.
