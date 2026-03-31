# 页面布局系统更新说明

## 已完成的工作

### 1. 添加了容器组件支持左右布局

在 `admin/src/types/components.ts` 中添加了三个新的组件类型：

- **ROW (行容器)**：水平排列的容器，可以放置多个列组件
  - 支持设置列间距 (gap)
  - 支持垂直对齐 (align): start/center/end/stretch
  - 支持水平对齐 (justify): start/center/end/space-between/space-around

- **COLUMN (列容器)**：行容器中的列
  - 支持固定宽度 (width)
  - 支持弹性比例 (flex)
  - 支持内边距 (padding)

- **CONTAINER (容器)**：通用容器组件
  - 支持垂直/水平布局
  - 可嵌套子组件

### 2. 创建了页面模板

在 `admin/src/templates/` 目录下创建了4个模板：

1. **homepage.ts** - 首页模板
   - Hero Banner 大图横幅
   - 最新文章标题
   - 文章列表（3列卡片）

2. **article1.ts** - 标准文章模板
   - 文章标题和元信息
   - 右侧悬浮目录
   - 文章正文
   - 相关文章推荐

3. **article2.ts** - 简洁图文混排模板
   - 封面大图
   - 文章摘要
   - 文章正文（白色卡片）
   - 文章标签

4. **article-with-sidebar.ts** - 带左侧导航的文章模板
   - 左侧：导航菜单（固定宽度250px）
   - 右侧：文章内容（弹性宽度）
   - 使用 ROW 和 COLUMN 组件实现左右布局

### 3. 菜单关联页面模板

- 在后端 `server/src/menu/menu.entity.ts` 添加了 `page_id` 字段
- 在前端 `admin/src/types/index.ts` 的 Menu 接口添加了 `page_id` 和 `page` 字段
- 数据库已添加 `page_id` 列

## 使用方法

### 创建左右布局页面

```typescript
{
  type: ComponentType.ROW,
  children: [
    {
      type: ComponentType.COLUMN,
      width: '250px',  // 左侧固定宽度
      children: [/* 左侧内容 */]
    },
    {
      type: ComponentType.COLUMN,
      flex: '1',  // 右侧自适应
      children: [/* 右侧内容 */]
    }
  ]
}
```

### 菜单关联页面模板

在创建/编辑菜单时，可以设置：
- `page_id`: 关联的页面模板ID
- `category_id`: 关联的分类ID（显示该分类下的文章列表）
- `article_id`: 关联的文章ID（显示单篇文章）

优先级：page_id > category_id > article_id > path

## 下一步工作

1. 在可视化编辑器中添加 ROW 和 COLUMN 组件的拖拽支持
2. 在菜单管理界面添加页面模板选择功能
3. 在前端路由中处理 page_id，渲染对应的页面模板
4. 实现页面模板的数据绑定（将文章数据填充到模板中）
