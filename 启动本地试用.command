#!/bin/zsh
set -euo pipefail

cd "${0:A:h}"
if [[ ! -f .env || ! -d .next || ! -d node_modules ]]; then
  echo '缺少本地配置或构建。请先按照 README.md 完成一次安装、迁移和构建。'
  read '?按回车结束。'
  exit 1
fi

if curl -sS --max-time 1 -o /dev/null http://127.0.0.1:3001/admin 2>/dev/null; then
  echo '后台已在运行：http://127.0.0.1:3001/admin'
  if [[ "${1:-}" != '--no-open' ]]; then open 'http://127.0.0.1:3001/admin'; fi
  exit 0
fi

echo '正在启动本地官网与后台。请保持这个终端窗口打开；关闭窗口即可停止服务。'
echo '后台：http://127.0.0.1:3001/admin'
echo '官网：http://127.0.0.1:3001/'
if [[ "${1:-}" != '--no-open' ]]; then
  (sleep 2; open 'http://127.0.0.1:3001/admin') &
fi
exec node --env-file=.env node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3001
