@echo off
echo 正在启动网站构建系统管理后台...

cd admin
echo 安装管理后台依赖...
npm install

echo 启动管理后台开发服务器...
npm run dev

pause
