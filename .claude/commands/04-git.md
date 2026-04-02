name: git
description: Git相关命令集合

# Git命令集合

## /git/commit
规范提交代码：
```bash
git add .
npm run pre-commit
git commit -m "<type>(<scope>): <description>"
```

## /git/pr
创建PR：
```bash
git push origin feature/xxx
gh pr create --title "Feature: xxx" --body "描述变更内容"
```

## /git/release
创建发布版本：
```bash
npm version minor
git push origin main --tags
gh release create vx.x.x --generate-notes
```

## /git/log
查看格式化提交日志：
```bash
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
```

## /git/clean
清理本地分支：
```bash
git fetch -p
git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -D
```

## /git/sync
同步主分支最新代码：
```bash
git checkout main
git pull origin main
git checkout feature/xxx
git rebase main
```
