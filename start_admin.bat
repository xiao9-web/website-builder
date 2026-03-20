@echo off
echo 正在启动管理后台...
cd admin
start "Admin Console" cmd /k "npm run dev"
timeout /t 8 /nobreak >/dev/null
echo 管理后台正在启动中...
echo 管理后台地址: http://localhost:5173
echo.
