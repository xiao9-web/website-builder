# Bug Report

## Bug Summary
1. 后台管理的页面编辑器无法做出常见的页面布局（如两列、三列等）
2. 菜单关联页面后，前端展示的是静态菜单样式，而不是动态渲染页面模板内容

## Bug Details

### Expected Behavior
1. **页面编辑器布局功能**：在后台管理的页面编辑器中，应该能够轻松创建常见的页面布局，如：
   - 两列布局（左右分栏）
   - 三列布局
   - 图文混排
   - 卡片网格等
   
2. **菜单关联页面动态展示**：当菜单关联了页面（page_id）后，前端官网应该：
   - 点击菜单跳转到对应页面
   - 动态渲染页面的layout_config内容
   - 使用页面模板的样式和布局

### Actual Behavior  
1. **页面编辑器布局功能差**：
   - 虽然添加了组件宽度设置（50%、33.33%等），但无法做出常见的页面布局
   - 组件并排显示效果不理想
   - 缺少实用的布局工具

2. **菜单展示是静态的**：
   - 菜单虽然有page_id字段，但前端没有实现动态渲染
   - 点击菜单后无法显示页面的实际内容
   - 菜单只是显示静态样式，没有与页面模板关联

### Steps to Reproduce
**问题1：页面编辑器布局**
1. 在管理后台进入页面管理
2. 创建或编辑一个页面
3. 尝试创建两列布局（如左侧图片，右侧文字）
4. 观察：无法轻松实现常见布局

**问题2：菜单关联页面**
1. 在管理后台创建一个页面（使用可视化编辑器，添加内容）
2. 在菜单管理中创建菜单，设置page_id关联到该页面
3. 访问前端官网 http://localhost:5174
4. 点击该菜单
5. 观察：菜单只有静态样式，没有显示页面的实际内容

### Environment
- **Version**: 当前开发版本
- **Platform**: macOS, Chrome浏览器
- **Configuration**: 
  - 后端：NestJS + MySQL (端口3000)
  - 管理后台：Vue 3 + Vite (端口5173)
  - 前端官网：Vue 3 + Vite (端口5174)

## Impact Assessment

### Severity
- [x] High - Major functionality broken
- [ ] Critical - System unusable
- [ ] Medium - Feature impaired but workaround exists
- [ ] Low - Minor issue or cosmetic

### Affected Users
所有使用系统的用户，包括：
- 管理员：无法通过菜单展示自定义页面
- 前端访客：无法访问通过菜单关联的页面内容

### Affected Features
1. 菜单系统 - 页面关联功能完全不可用
2. 可视化编辑器 - 布局功能体验差

## Additional Context

### Error Messages
无明显错误信息，功能未实现

### Screenshots/Media
无

### Related Issues
- 之前已经实现了菜单关联文章的功能（article_id）
- 可视化编辑器已经添加了宽度选择器，但实际渲染效果不佳
- 数据库中menus表有page_id字段，但前端路由和页面组件未实现

## Initial Analysis

### Suspected Root Cause
1. **菜单关联页面**：
   - 前端App.vue中的getMenuPath()函数可能没有处理page_id的逻辑
   - 前端路由配置中缺少 `/page/:id` 路由
   - 缺少PageView.vue组件来渲染页面的layout_config

2. **组件并排布局**：
   - VisualEditor.vue中的flex布局可能有问题
   - 组件间距、对齐方式需要优化
   - 可能需要调整CSS样式

### Affected Components
1. **菜单关联页面**：
   - `frontend/src/App.vue` - getMenuPath()函数
   - `frontend/src/router/index.ts` - 路由配置
   - `frontend/src/views/` - 需要新建PageView.vue
   - `frontend/src/api/page.ts` - 可能需要添加获取页面API

2. **组件并排布局**：
   - `admin/src/components/Editor/VisualEditor.vue` - 预览区域样式
   - `admin/src/components/Editor/PropertyPanelSimple.vue` - 宽度设置逻辑

---

**创建时间**: 2026-04-07
**报告人**: 用户反馈
**优先级**: High
