# 快速开始指南

## 🎯 项目重新定位

**原定位**：复杂的可视化页面构建器
**新定位**：主题化内容管理系统（Theme-based CMS）

**核心理念**：
- 内容与展示分离
- 通过主题切换实现不同风格
- 简单配置，无需拖拽编辑

---

## 📚 重要文档

### 必读文档（按顺序）
1. **[需求文档 v2.0](./REQUIREMENTS_V2.md)** ⭐⭐⭐
   - 产品定位和核心功能
   - 数据库设计
   - 技术架构
   - 验收标准

2. **[2周开发计划](./DEVELOPMENT_PLAN_2WEEKS.md)** ⭐⭐⭐
   - 详细的每日任务清单
   - 里程碑和交付物
   - 风险应对

3. **[数据库设计](./DATABASE_SCHEMA.sql)** ⭐⭐
   - 完整的建表语句
   - 初始数据
   - 存储过程

### 参考文档
4. [AI协作指南](./AI_COLLABORATION.md)
5. [开发规范](./DEV_STANDARDS.md)
6. [架构设计](./architecture.md)

---

## 🚀 立即开始

### Step 1：理解新需求（15分钟）
```bash
# 阅读需求文档
cat docs/REQUIREMENTS_V2.md

# 重点关注：
# - 产品定位（第1节）
# - 核心功能（第2节）
# - 数据库设计（第3节）
```

### Step 2：执行数据库迁移（5分钟）
```bash
# 连接数据库
mysql -u root -p website_builder

# 执行建表语句
source docs/DATABASE_SCHEMA.sql

# 验证表是否创建成功
SHOW TABLES;
SELECT * FROM themes;
```

### Step 3：开始第一天任务（今天）
```bash
# 查看今日任务
cat docs/DEVELOPMENT_PLAN_2WEEKS.md | grep -A 20 "Day 1"

# 今日目标：
# 1. 创建 Theme 模块
# 2. 实现主题相关 API
# 3. 测试主题切换功能
```

---

## 📋 今日任务清单（Day 1）

### ✅ 已完成
- [x] 重新定义需求
- [x] 设计数据库
- [x] 制定开发计划

### 🔲 待完成（按顺序）

#### 1. 创建数据库表（30分钟）
```bash
cd server
mysql -u root -p website_builder < ../docs/DATABASE_SCHEMA.sql
```

#### 2. 创建 Theme 模块（2小时）
```bash
# 生成模块
cd server
nest g module theme
nest g service theme
nest g controller theme

# 创建文件：
# - src/theme/theme.entity.ts
# - src/theme/theme.service.ts
# - src/theme/theme.controller.ts
# - src/theme/dto/activate-theme.dto.ts
```

#### 3. 实现主题 API（2小时）
需要实现的接口：
- `GET /themes` - 获取所有主题
- `GET /themes/active` - 获取当前启用主题
- `POST /themes/:id/activate` - 激活主题

#### 4. 测试 API（1小时）
```bash
# 启动后端
npm run start:dev

# 测试接口（使用 Postman 或 curl）
curl http://localhost:3000/themes
curl http://localhost:3000/themes/active
curl -X POST http://localhost:3000/themes/1/activate
```

---

## 🎯 本周目标（Week 1）

### Day 1-2：基础模块
- Theme 模块
- PageConfig 模块

### Day 3-4：业务模块
- Product 模块
- Media 模块

### Day 5：优化和文档
- 错误处理
- API 文档
- 测试

**Week 1 交付物**：
✅ 所有后端 API 开发完成并测试通过

---

## 💡 开发建议

### 1. 严格按照计划执行
- 每天开始前查看任务清单
- 按顺序完成任务
- 不要跳过步骤

### 2. 小步提交代码
```bash
# 完成一个小功能就提交
git add .
git commit -m "feat: 添加主题实体定义"
git push
```

### 3. 遇到问题及时记录
```bash
# 创建问题记录文件
echo "## 问题1：XXX" >> docs/ISSUES.md
```

### 4. 每天结束前更新进度
```bash
# 更新开发计划中的任务状态
# 将 [ ] 改为 [x]
```

---

## 🚨 注意事项

### ❌ 不要做的事
1. 不要偏离需求文档
2. 不要添加计划外的功能
3. 不要过度优化
4. 不要跳过测试

### ✅ 要做的事
1. 严格按照需求文档开发
2. 每个功能都要测试
3. 代码要有基本注释
4. 及时提交代码

---

## 📞 需要帮助？

### 如果遇到技术问题
1. 查看相关文档
2. Google 搜索
3. 向 AI 助手求助（描述清楚问题）

### 如果需求不清楚
1. 查看 `REQUIREMENTS_V2.md`
2. 查看数据库设计
3. 查看开发计划

### 如果时间不够
1. 优先完成核心功能
2. 简化非核心功能
3. 调整计划

---

## 🎉 开始开发

现在你可以开始第一天的开发了！

```bash
# 1. 确保环境正常
cd server && npm run start:dev

# 2. 执行数据库迁移
mysql -u root -p website_builder < ../docs/DATABASE_SCHEMA.sql

# 3. 开始创建 Theme 模块
nest g module theme
nest g service theme
nest g controller theme

# 4. 按照需求文档实现功能
# 参考：docs/REQUIREMENTS_V2.md 第4节
```

---

## 📊 进度追踪

### Week 1 进度
- [ ] Day 1: Theme 模块
- [ ] Day 2: PageConfig 模块
- [ ] Day 3: Product 模块
- [ ] Day 4: Media 模块
- [ ] Day 5: 优化和文档

### Week 2 进度
- [ ] Day 6: 主题管理 + 媒体库
- [ ] Day 7: 产品管理
- [ ] Day 8: 页面配置器
- [ ] Day 9: 前端主题实现
- [ ] Day 10: 测试和优化

---

## ✅ 验收标准

2周后，你应该能够：
1. ✅ 在后台切换主题，前端立即生效
2. ✅ 配置博客主题首页（标题、头像、推荐文章）
3. ✅ 配置企业主题首页（轮播图、视频、产品、联系方式）
4. ✅ 管理产品（增删改查）
5. ✅ 上传和管理媒体文件
6. ✅ 前端正常展示内容

---

**祝开发顺利！🚀**

有任何问题随时问我。
