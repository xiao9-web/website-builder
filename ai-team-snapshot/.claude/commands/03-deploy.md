
name: deploy
description: 部署相关命令集合

# 部署命令集合

## /deploy/staging
部署到测试环境：
```bash
npm run deploy:staging
```

## /deploy/production
部署到生产环境：
```bash
npm run deploy:production
```

## /deploy/rollback
回滚到上一个版本：
```bash
npm run deploy:rollback
```

## /deploy/status
查看部署状态：
```bash
npm run deploy:status
```

## /deploy/logs
查看生产环境日志：
```bash
npm run deploy:logs
```

## /deploy/backup
备份生产环境数据：
```bash
npm run deploy:backup
```

## /deploy/restore
从备份恢复：
```bash
npm run deploy:restore
```
