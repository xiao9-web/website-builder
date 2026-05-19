# 单元测试报告 — website-builder

**生成时间：** 2026-05-19  
**测试框架：** Jest 29 + ts-jest  
**测试目录：** `server/src`  
**运行命令：** `npx jest --coverage --forceExit`

---

## 一、总体结果

| 指标 | 数值 |
|------|------|
| 测试套件总数 | 8 |
| 通过套件数 | **8 ✅** |
| 失败套件数 | 0 |
| 测试用例总数 | 66 |
| 通过用例数 | **66 ✅** |
| 失败用例数 | 0 |
| 总耗时 | 11.302 秒 |

**结论：所有测试全部通过，无失败、无跳过。**

---

## 二、各测试套件详情

| 套件文件 | 状态 | 覆盖的功能点 |
|----------|------|-------------|
| `src/ai/ai.service.spec.ts` | ✅ PASS | SEO元数据生成、文章摘要生成、SSE流式页面配置 |
| `src/user/user.service.spec.ts` | ✅ PASS | 用户列表、单个查询、创建、更新、删除 |
| `src/page/page.service.spec.ts` | ✅ PASS | 页面CRUD、分页列表、slug查询、浏览量递增 |
| `src/article/article.service.spec.ts` | ✅ PASS | 文章CRUD、状态过滤、关键词搜索、分页 |
| `src/menu/menu.service.spec.ts` | ✅ PASS | 菜单树构建、排序、增删改查 |
| `src/deploy/deploy.service.spec.ts` | ✅ PASS | 部署触发、快照发布、版本回滚、日志获取 |
| `src/media/media.service.spec.ts` | ✅ PASS | 媒体文件CRUD、类型过滤、分页 |
| `src/product/product.service.spec.ts` | ✅ PASS | 产品CRUD、分页列表 |

---

## 三、代码覆盖率

### 3.1 整体覆盖率

| 指标 | 覆盖率 |
|------|--------|
| 语句 (Statements) | **28.18%** |
| 分支 (Branches) | **20.60%** |
| 函数 (Functions) | **19.83%** |
| 行 (Lines) | **28.35%** |

> 覆盖率偏低的主要原因：仅 Service 层（8个模块）有测试，所有 Controller、Auth、Setting、Upload 等模块完全未覆盖。

---

### 3.2 各模块覆盖率明细

```
File                         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------------|---------|----------|---------|---------|-------------------
All files                    |   28.18 |     20.6 |   19.83 |   28.35 |
 src/ai/ai.service.ts        |    85.1 |       44 |     100 |   83.33 | 57,94,185-190,200-201
 src/article/article.service |   48.07 |     28.2 |   33.33 |   48.97 | 24-32,165-231,289-361
 src/deploy/deploy.service   |   66.88 |    56.75 |   86.66 |   66.22 | 40,122-139,162,320-379
 src/media/media.service.ts  |   93.93 |     87.5 |   85.71 |   93.54 | 58-59
 src/menu/menu.service.ts    |   86.84 |    66.66 |    90.9 |   85.71 | 88-102
 src/page/page.service.ts    |   87.09 |    41.66 |     100 |   89.28 | 59,63,100
 src/product/product.service |     100 |      100 |     100 |     100 | (完全覆盖)
 src/user/user.service.ts    |   57.14 |    11.11 |      60 |   54.54 | 16-52,71
 src/auth/auth.service.ts    |       0 |        0 |       0 |       0 | 1-39 (无测试)
 src/auth/jwt.strategy.ts    |       0 |        0 |       0 |       0 | 1-22 (无测试)
 src/attachment/attachment   |       0 |        0 |       0 |       0 | 1-105 (无测试)
 src/category/category       |       0 |        0 |       0 |       0 | 1-153 (无测试)
 src/setting/setting.service |       0 |        0 |       0 |       0 | 1-145 (无测试)
 src/tag/tag.service.ts      |       0 |        0 |       0 |       0 | 1-190 (无测试)
 src/theme/theme.service.ts  |       0 |        0 |       0 |       0 | 1-93  (无测试)
 src/upload/upload.service   |       0 |        0 |       0 |       0 | 1-49  (无测试)
 src/site-config/...service  |   19.44 |        0 |       0 |    14.7 | 10-211
 所有 Controllers (16个)     |       0 |     —    |       0 |       0 | (无测试)
```

---

### 3.3 覆盖率分级

#### 覆盖良好（> 80%）

| 模块 | 语句覆盖率 |
|------|-----------|
| `product.service.ts` | 100% |
| `media.service.ts` | 93.9% |
| `page.service.ts` | 87.1% |
| `menu.service.ts` | 86.8% |
| `ai.service.ts` | 85.1% |

#### 覆盖不足（20%–80%）

| 模块 | 语句覆盖率 | 主要缺口 |
|------|-----------|---------|
| `deploy.service.ts` | 66.9% | rollback() 完整流程（L320-379） |
| `user.service.ts` | 57.1% | 初始化管理员、密码修改（L16-52） |
| `article.service.ts` | 48.1% | 软删除/恢复/批量操作（L165-231） |
| `site-config.service.ts` | 19.4% | 几乎全部逻辑未覆盖 |

#### 零覆盖（高风险）

| 模块 | 风险等级 | 说明 |
|------|---------|------|
| `auth.service.ts` | 高 | validateUser / login 核心认证逻辑 |
| `jwt.strategy.ts` | 高 | JWT payload 验证 |
| `local.strategy.ts` | 高 | 本地认证策略 |
| `setting.service.ts` | 高 | batchUpdate 存在已知无事务 bug |
| `attachment.service.ts` | 中 | 文件 I/O 异常路径未测试 |
| `upload.service.ts` | 中 | 上传异常处理未测试 |
| `category.service.ts` | 中 | |
| `tag.service.ts` | 中 | |
| `theme.service.ts` | 中 | |
| 所有 16 个 Controller | 中 | HTTP 路由层、参数验证、权限守卫均未测试 |

---

## 四、测试质量评估

### 优点

- 所有测试使用 `@nestjs/testing` + mock repository，不依赖真实数据库，可在 CI 中独立运行
- mock 数据结构完整，覆盖正常路径
- `ai.service.spec.ts` 正确模拟了 Anthropic SDK 的异步流式接口
- `deploy.service.spec.ts` 覆盖了部署、快照发布、回滚三条主路径

### 不足

- 缺少异常路径测试（如资源不存在、数据库错误、文件 I/O 失败）
- 缺少边界值测试（如 pageSize=0、负数 ID、空字符串关键词）
- `auth` 模块完全无测试，是最大的安全测试盲区
- 所有 Controller 未测试，HTTP 状态码、请求验证、权限控制均无覆盖

---

## 五、补充测试建议（按优先级）

| 优先级 | 目标文件 | 预估耗时 |
|--------|---------|---------|
| P0 | `auth.service.spec.ts` — validateUser 正常/错误路径、login payload | 2h |
| P0 | `jwt.strategy.spec.ts` — JWT 验证、过期 token 处理 | 1h |
| P0 | `setting.service.spec.ts` — batchUpdate 事务回滚场景 | 1h |
| P1 | `attachment.service.spec.ts` — 文件类型判断、图片尺寸异常 | 2h |
| P1 | `auth.controller.spec.ts` — 登录成功/失败 HTTP 响应 | 1.5h |
| P2 | 各 Service 补充异常路径（NotFoundException 等） | 4h |
| P2 | 各 Controller 补充 HTTP 层测试 | 6h |

---

*报告由 Jest 29 + ts-jest 自动生成，覆盖率数据基于 Istanbul v8 插桩统计。*
