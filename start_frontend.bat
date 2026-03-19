@echo off
echo 正在启动网站构建系统前端服务...

cd frontend
echo 安装前端依赖...
npm install

echo 启动前端开发服务器...
npm run dev

pause
