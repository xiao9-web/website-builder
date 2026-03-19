@echo off
echo 正在启动网站构建系统后端服务...

cd server
echo 安装后端依赖...
npm install

echo 启动后端开发服务器...
npm run start:dev

pause
