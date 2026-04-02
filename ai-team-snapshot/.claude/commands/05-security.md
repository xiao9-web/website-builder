
name: security
description: 安全相关命令集合

# 安全命令集合

## /security/audit
执行完整安全审计：
```bash
npm run audit:security
npm run audit:dependency
npm run audit:secrets
```

## /security/dependency
检查依赖安全漏洞：
```bash
npm audit
npm run depcheck
```

## /security/secrets
检查代码中的敏感信息：
```bash
grep -r "api_key\|password\|secret\|token\|private_key" --include="*.ts" --include="*.js" --include="*.json" --include="*.env*" . | grep -v node_modules | grep -v ".d.ts"
```

## /security/update
更新有安全漏洞的依赖：
```bash
npm audit fix
```

## /security/compliance
生成合规性报告：
```bash
npm run audit:compliance
```
