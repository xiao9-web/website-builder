name: dev
description: 开发相关命令集合

# 开发命令集合

## /dev/start
启动开发服务器：
```bash
npm run dev
```

## /dev/build
构建生产版本：
```bash
npm run build
```

## /dev/lint
执行代码lint检查：
```bash
npm run lint
```

## /dev/format
格式化代码：
```bash
npm run format
```

## /dev/test
运行测试：
```bash
npm test
```

## /dev/coverage
生成测试覆盖率报告：
```bash
npm test -- --coverage
```

## /dev/clean
清理构建产物和缓存：
```bash
rm -rf dist/ node_modules/.cache/
npm run clean
```
