#!/bin/zsh
set -euo pipefail

cd "${0:A:h}"
if [[ ! -f .env || ! -d node_modules ]]; then
  echo '缺少本地配置或依赖。请先按照 README.md 完成安装。'
  read '?按回车结束。'
  exit 1
fi

echo '仅设置本机试用库的管理员登录信息；邮箱和密码不会发到聊天。'
read 'admin_email?管理员邮箱：'
read -s 'admin_password?新密码（至少 14 字符）：'
echo
read -s 'confirm_password?再次输入新密码：'
echo
if [[ "$admin_password" != "$confirm_password" || ${#admin_password} -lt 14 ]]; then
  echo '两次密码不一致，或密码少于 14 字符。未修改账号。'
  read '?按回车结束。'
  exit 1
fi

printf '%s\n%s\n' "$admin_email" "$admin_password" | node --env-file=.env --import tsx scripts/set-local-admin.ts
unset admin_password confirm_password
echo '现在可双击「启动本地试用.command」打开后台。'
read '?按回车结束。'
