# 可视化编辑器组件数据结构规范

## 概述

本文档定义了网站构建系统可视化编辑器的组件数据结构和JSON Schema规范，用于标准化组件的创建、配置和渲染过程。

## 组件类型

### ComponentType 枚举

```typescript
enum ComponentType {
  TEXT = 'text',           // 文本组件
  IMAGE = 'image',         // 图片组件
  BUTTON = 'button',       // 按钮组件
  CARD = 'card',           // 卡片组件
  CAROUSEL = 'carousel',   // 轮播图组件
  NAVIGATION = 'navigation', // 导航组件
  FORM = 'form',           // 表单组件
}
```

## 基础组件结构

所有组件都继承自`BaseComponent`接口：

```typescript
interface BaseComponent {
  id: string;              // 组件唯一标识符
  type: ComponentType;     // 组件类型
  name?: string;           // 组件名称（可选）
  visible: boolean;        // 组件可见性
  className?: string;      // CSS类名（可选）
  style?: Record<string, any>; // 自定义样式（可选）
}
```

## 组件属性详细说明

### 1. 文本组件 (TextComponent)

```typescript
interface TextComponent extends BaseComponent {
  type: ComponentType.TEXT;
  content: string;                     // 文本内容
  fontSize?: string;                   // 字体大小（默认：16px）
  fontWeight?: string;                 // 字体粗细（默认：normal）
  color?: string;                      // 文本颜色（默认：#000000）
  lineHeight?: string;                 // 行高（默认：1.6）
  textAlign?: 'left' | 'center' | 'right'; // 文本对齐方式
}
```

**示例**：
```json
{
  "id": "text-1",
  "type": "text",
  "visible": true,
  "content": "欢迎来到我的网站",
  "fontSize": "24px",
  "fontWeight": "bold",
  "color": "#333",
  "textAlign": "center"
}
```

### 2. 图片组件 (ImageComponent)

```typescript
interface ImageComponent extends BaseComponent {
  type: ComponentType.IMAGE;
  src: string;                        // 图片地址
  alt?: string;                       // 替代文本（可选）
  width?: string;                     // 图片宽度（可选）
  height?: string;                    // 图片高度（可选）
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'; // 图片适应方式
}
```

**示例**：
```json
{
  "id": "image-1",
  "type": "image",
  "visible": true,
  "src": "https://example.com/image.jpg",
  "alt": "示例图片",
  "width": "100%",
  "height": "300px",
  "objectFit": "cover"
}
```

### 3. 按钮组件 (ButtonComponent)

```typescript
interface ButtonComponent extends BaseComponent {
  type: ComponentType.BUTTON;
  text: string;                       // 按钮文字
  btnType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'; // 按钮类型
  size?: 'default' | 'medium' | 'small' | 'large'; // 按钮尺寸
  icon?: string;                      // 图标（可选）
  url?: string;                       // 链接地址（可选）
  target?: '_self' | '_blank';       // 打开方式
}
```

**示例**：
```json
{
  "id": "button-1",
  "type": "button",
  "visible": true,
  "text": "点击这里",
  "btnType": "primary",
  "size": "large",
  "icon": "el-icon-search",
  "url": "/search",
  "target": "_self"
}
```

### 4. 卡片组件 (CardComponent)

```typescript
interface CardComponent extends BaseComponent {
  type: ComponentType.CARD;
  title?: string;                     // 卡片标题（可选）
  content?: string;                   // 卡片内容（可选）
  headerImage?: string;               // 卡片头部图片（可选）
  footer?: string;                    // 卡片底部内容（可选）
  shadow?: 'always' | 'hover' | 'never'; // 卡片阴影
}
```

**示例**：
```json
{
  "id": "card-1",
  "type": "card",
  "visible": true,
  "title": "产品介绍",
  "content": "这是一款功能强大的产品，帮助您轻松构建网站",
  "headerImage": "https://example.com/header.jpg",
  "shadow": "hover"
}
```

### 5. 轮播图组件 (CarouselComponent)

```typescript
interface CarouselComponent extends BaseComponent {
  type: ComponentType.CAROUSEL;
  images: Array<{
    id: string;
    src: string;
    alt: string;
    url?: string;
    target?: '_self' | '_blank';
  }>;                                 // 轮播图图片数组
  autoplay?: boolean;                 // 是否自动播放（默认：true）
  interval?: number;                  // 自动播放间隔（ms，默认：3000）
  indicator?: 'none' | 'outside' | 'inside'; // 指示器位置
  arrow?: 'never' | 'hover' | 'always'; // 箭头显示方式
}
```

**示例**：
```json
{
  "id": "carousel-1",
  "type": "carousel",
  "visible": true,
  "images": [
    {
      "id": "img1",
      "src": "https://example.com/slide1.jpg",
      "alt": "幻灯片1",
      "url": "/slide1",
      "target": "_blank"
    },
    {
      "id": "img2",
      "src": "https://example.com/slide2.jpg",
      "alt": "幻灯片2"
    }
  ],
  "autoplay": true,
  "interval": 3000,
  "indicator": "outside",
  "arrow": "hover"
}
```

### 6. 导航组件 (NavigationComponent)

```typescript
interface NavigationComponent extends BaseComponent {
  type: ComponentType.NAVIGATION;
  logo?: {
    src: string;
    alt: string;
    url: string;
  };                                  // 导航栏Logo
  menuItems: Array<{
    id: string;
    name: string;
    url: string;
    target?: '_self' | '_blank';
    children?: Array<{
      id: string;
      name: string;
      url: string;
      target?: '_self' | '_blank';
    }>;                               // 子菜单
  }>;                                 // 菜单项数组
  backgroundColor?: string;           // 背景颜色
  textColor?: string;                 // 文字颜色
}
```

**示例**：
```json
{
  "id": "nav-1",
  "type": "navigation",
  "visible": true,
  "logo": {
    "src": "https://example.com/logo.png",
    "alt": "Logo",
    "url": "/"
  },
  "menuItems": [
    {
      "id": "menu1",
      "name": "首页",
      "url": "/"
    },
    {
      "id": "menu2",
      "name": "产品",
      "url": "/products"
    },
    {
      "id": "menu3",
      "name": "关于我们",
      "url": "/about",
      "children": [
        {
          "id": "submenu1",
          "name": "公司简介",
          "url": "/about/company"
        }
      ]
    }
  ],
  "backgroundColor": "#fff",
  "textColor": "#333"
}
```

### 7. 表单组件 (FormComponent)

```typescript
interface FormComponent extends BaseComponent {
  type: ComponentType.FORM;
  fields: Array<{
    id: string;
    name: string;
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select'; // 字段类型
    placeholder?: string;              // 占位符（可选）
    required?: boolean;               // 是否必填（可选）
    options?: Array<{
      label: string;
      value: string;
    }>;                                // 下拉选项（可选）
  }>;                                  // 表单字段数组
  submitText?: string;                 // 提交按钮文字
  successMessage?: string;             // 提交成功消息
  errorMessage?: string;               // 提交失败消息
}
```

**示例**：
```json
{
  "id": "form-1",
  "type": "form",
  "visible": true,
  "fields": [
    {
      "id": "field1",
      "name": "姓名",
      "type": "text",
      "placeholder": "请输入姓名",
      "required": true
    },
    {
      "id": "field2",
      "name": "邮箱",
      "type": "email",
      "placeholder": "请输入邮箱",
      "required": true
    },
    {
      "id": "field3",
      "name": "留言",
      "type": "textarea",
      "placeholder": "请输入您的留言"
    }
  ],
  "submitText": "提交",
  "successMessage": "提交成功！",
  "errorMessage": "提交失败，请重试"
}
```

## 页面布局配置

```typescript
interface PageLayoutConfig {
  version: string;                     // 布局版本
  components: Component[];             // 页面组件列表
  settings: {
    title: string;                     // 页面标题
    description: string;               // 页面描述
    backgroundColor?: string;         // 页面背景颜色
    textColor?: string;               // 页面文字颜色
    fontFamily?: string;              // 页面字体
    maxWidth?: string;                // 页面最大宽度
  };
}
```

**页面配置示例**：
```json
{
  "version": "1.0.0",
  "components": [
    {
      "id": "nav-1",
      "type": "navigation",
      "visible": true,
      "logo": {
        "src": "https://example.com/logo.png",
        "alt": "Logo",
        "url": "/"
      },
      "menuItems": [
        {
          "id": "menu1",
          "name": "首页",
          "url": "/"
        }
      ]
    },
    {
      "id": "text-1",
      "type": "text",
      "visible": true,
      "content": "欢迎访问我的网站",
      "fontSize": "24px",
      "fontWeight": "bold",
      "textAlign": "center"
    }
  ],
  "settings": {
    "title": "我的网站",
    "description": "一个使用可视化编辑器创建的网站",
    "backgroundColor": "#f5f5f5",
    "textColor": "#333",
    "fontFamily": "Arial, sans-serif",
    "maxWidth": "1200px"
  }
}
```

## 组件属性面板配置

```typescript
interface PropertyConfig {
  [key: string]: {
    type: string;
    label: string;
    required?: boolean;
    default?: any;
    options?: Array<{
      label: string;
      value: any;
    }>;
  };
}
```

## 使用说明

1. 组件数据结构支持嵌套和组合
2. 所有组件属性都支持在编辑器中实时编辑
3. 页面配置可以保存为JSON文件或数据库记录
4. 支持导入/导出功能
5. 组件属性变化时会自动触发渲染更新

## 版本历史

- **1.0.0** (2026-03-19)：初始版本，支持7种基础组件类型
