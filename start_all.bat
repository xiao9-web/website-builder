@echo off
echo 正在启动网站构建系统所有服务...
echo.

REM 启动后端服务
call start_backend.bat

REM 启动管理后台
call start_admin.bat

REM 启动前端服务
call start_frontend.bat

echo.
echo 所有服务正在启动中，请耐心等待...
echo 后端服务: http://localhost:3000
echo 管理后台: http://localhost:5173
echo 前端服务: http://localhost:5174
echo.
echo 按任意键退出...
pause >/dev/null
