export interface Article {
  id: number
  slug: string
  title: string
  summary: string
  content: string
  category: string
  categoryColor: string
  tags: string[]
  coverColor: string
  coverEmoji: string
  date: string
  views: number
  readingTime: number
  featured?: boolean
}

export const articles: Article[] = [
  {
    id: 1,
    slug: 'vue3-composition-api-best-practices',
    title: 'Vue 3 组合式 API 最佳实践：从入门到熟练',
    summary: '深入探讨 Vue 3 Composition API 的核心概念与实战技巧，包括 ref/reactive 选择策略、composable 封装模式、以及如何避免常见陷阱。适合有 Vue 2 基础的开发者进阶阅读。',
    content: `## 为什么选择 Composition API

Vue 3 的 Composition API 是 Options API 的革命性升级，它让逻辑复用变得优雅，让代码组织更加灵活。

## ref vs reactive：选择策略

这是初学者最常困惑的问题。

\`\`\`typescript
// ref：适合基本类型和需要整体替换的对象
const count = ref(0)
const user = ref<User | null>(null)

// reactive：适合复杂的对象状态
const form = reactive({
  name: '',
  email: '',
  age: 0
})
\`\`\`

**核心原则**：如果你需要整体替换一个值（如异步获取后赋值），用 \`ref\`。如果是一个稳定的响应式对象，用 \`reactive\`。

## Composable 最佳封装模式

> 一个好的 composable 应该像一个纯函数：输入明确，输出可预测，没有隐藏的副作用。

\`\`\`typescript
// useScrollProgress.ts
export function useScrollProgress() {
  const progress = ref(0)

  const update = () => {
    const scrolled = window.scrollY
    const total = document.body.scrollHeight - window.innerHeight
    progress.value = total > 0 ? Math.min((scrolled / total) * 100, 100) : 0
  }

  onMounted(() => window.addEventListener('scroll', update, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', update))

  return { progress }
}
\`\`\`

## 常见陷阱与解决方案

1. **响应性丢失**：解构 reactive 对象时丢失响应性 → 使用 \`toRefs()\`
2. **内存泄漏**：忘记在 \`onUnmounted\` 中清理事件监听 → 使用 \`useEventListener\` composable
3. **计算属性滥用**：把有副作用的操作放在 computed → 改用 watchEffect

## 未来展望

随着 Vue 3.4 的稳定，Composition API 已经是生态系统的标准选择。掌握它，你就掌握了现代 Vue 开发的核心。`,
    category: '前端技术',
    categoryColor: '#3B82F6',
    tags: ['Vue 3', 'Composition API', 'TypeScript'],
    coverColor: 'linear-gradient(135deg, #dbeafe, #ede9fe)',
    coverEmoji: '⚡',
    date: '2026-05-14',
    views: 1823,
    readingTime: 8,
    featured: true,
  },
  {
    id: 2,
    slug: 'typescript-type-gymnastics',
    title: 'TypeScript 类型体操进阶：条件类型与映射类型',
    summary: '从 Conditional Types 到 Mapped Types，从 infer 关键字到模板字面量类型，系统梳理 TypeScript 高级类型的核心用法，并通过实际案例加深理解。',
    content: `## 什么是类型体操

TypeScript 的类型系统是图灵完备的，这意味着我们可以用类型来做计算。

## 条件类型（Conditional Types）

\`\`\`typescript
type IsArray<T> = T extends any[] ? true : false

type A = IsArray<string[]>  // true
type B = IsArray<string>    // false
\`\`\`

## infer 关键字

\`\`\`typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type Fn = () => { name: string; age: number }
type Result = ReturnType<Fn>  // { name: string; age: number }
\`\`\`

## 映射类型（Mapped Types）

\`\`\`typescript
// 让所有属性变为可选
type Optional<T> = { [K in keyof T]?: T[K] }

// 让所有属性变为只读
type Readonly<T> = { readonly [K in keyof T]: T[K] }
\`\`\`

> 掌握这些高级类型，你就能写出真正类型安全的代码。`,
    category: '前端技术',
    categoryColor: '#3B82F6',
    tags: ['TypeScript', '类型系统', '进阶'],
    coverColor: 'linear-gradient(135deg, #fce7f3, #dbeafe)',
    coverEmoji: '🔷',
    date: '2026-05-12',
    views: 1204,
    readingTime: 10,
  },
  {
    id: 3,
    slug: 'nestjs-from-zero',
    title: '从零搭建 NestJS 后端：模块化架构实践',
    summary: '手把手带你从零搭建一个生产级 NestJS 后端服务，涵盖模块划分、依赖注入、TypeORM 集成、JWT 鉴权、统一响应格式、异常过滤器等核心知识点。',
    content: `## NestJS 的核心思想

NestJS 借鉴了 Angular 的架构理念，通过装饰器和依赖注入将代码组织得井井有条。

## 项目初始化

\`\`\`bash
npm i -g @nestjs/cli
nest new my-project
\`\`\`

## 模块化架构

\`\`\`typescript
@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
\`\`\`

## 统一响应格式

\`\`\`typescript
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => ({ code: 200, data, message: 'success' }))
    )
  }
}
\`\`\``,
    category: '后端开发',
    categoryColor: '#10B981',
    tags: ['NestJS', 'Node.js', '后端架构'],
    coverColor: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    coverEmoji: '🦅',
    date: '2026-05-10',
    views: 987,
    readingTime: 12,
  },
  {
    id: 4,
    slug: 'css-grid-mastery',
    title: 'CSS Grid 布局完全指南：从基础到复杂布局',
    summary: '深入讲解 CSS Grid 的所有核心概念，包括网格线、区域命名、auto-fill/auto-fit 的区别、subgrid 的应用，以及如何用 Grid 实现各种复杂的响应式布局。',
    content: `## Grid vs Flexbox

Grid 是二维布局，Flexbox 是一维布局。简单说：用 Flexbox 排列一行元素，用 Grid 做整体页面布局。

## 核心概念

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 24px;
}
\`\`\`

## auto-fill vs auto-fit

\`\`\`css
/* auto-fill：尽量多填充列，即使空着 */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

/* auto-fit：折叠空列，让现有元素拉伸 */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
\`\`\`

> 大多数响应式卡片布局用 auto-fill 就够了。`,
    category: '前端技术',
    categoryColor: '#3B82F6',
    tags: ['CSS', 'Grid', '布局', '响应式'],
    coverColor: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    coverEmoji: '🎨',
    date: '2026-05-08',
    views: 2156,
    readingTime: 7,
  },
  {
    id: 5,
    slug: 'reading-deep-work',
    title: '读《深度工作》：在注意力涣散的时代如何专注',
    summary: '卡尔·纽波特的《深度工作》让我重新审视自己的工作方式。这篇读书笔记记录了书中最触动我的观点，以及我在实际工作中的应用尝试。',
    content: `## 什么是深度工作

> "深度工作：在无干扰的状态下专注进行职业活动，使个人的认知能力达到极限。"
> —— 卡尔·纽波特

这个定义简单但深刻。它指出了现代工作的核心矛盾：我们越来越习惯被打断，却在抱怨自己效率低下。

## 最打动我的观点

### 注意力残留

当你从任务A切换到任务B时，你的注意力并不会立刻完全转移。任务A留下的"注意力残留"会干扰你对任务B的思考。

这解释了为什么频繁切换任务会让人精疲力竭，即使每个单独的任务都很简单。

### 深度工作的稀缺性

讽刺的是，深度工作越来越稀缺，但对职业成功越来越重要。这创造了一个巨大的机会。

## 我的实践

1. 每天上午 9-12 点：深度工作时段，关闭所有通知
2. 下午处理邮件、沟通等浅层工作
3. 每周五做"工作关闭仪式"，确保心理上真正离开工作

实践三个月下来，博客文章产出翻了一倍，代码质量明显提升。`,
    category: '读书笔记',
    categoryColor: '#8B5CF6',
    tags: ['读书', '效率', '专注力'],
    coverColor: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
    coverEmoji: '📚',
    date: '2026-05-06',
    views: 743,
    readingTime: 6,
  },
  {
    id: 6,
    slug: 'docker-for-developers',
    title: 'Docker 开发环境实战：告别"我机器上能跑"',
    summary: '从开发者视角介绍 Docker 的核心概念，重点讲解如何用 Docker Compose 搭建本地开发环境，解决环境一致性问题，以及常见的 Docker 使用技巧和踩坑记录。',
    content: `## 为什么开发者需要 Docker

"在我机器上能跑"是软件开发的经典玩笑，也是真实的痛点。Docker 通过容器化技术，确保开发、测试、生产环境完全一致。

## 核心概念

- **镜像（Image）**：只读模板，包含运行应用所需的一切
- **容器（Container）**：镜像的运行实例
- **Dockerfile**：构建镜像的脚本

## Docker Compose 实战

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123456
      MYSQL_DATABASE: myapp
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
\`\`\`

## 常见踩坑

1. **node_modules 挂载问题**：用匿名卷覆盖，避免宿主机的 node_modules 污染容器
2. **端口占用**：用 \`lsof -i :3000\` 查找并 kill 占用进程
3. **构建缓存**：合理利用层缓存，把变化少的指令放前面`,
    category: '工具效率',
    categoryColor: '#F59E0B',
    tags: ['Docker', 'DevOps', '开发环境'],
    coverColor: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
    coverEmoji: '🐳',
    date: '2026-05-04',
    views: 1567,
    readingTime: 9,
  },
  {
    id: 7,
    slug: 'morning-routine-developer',
    title: '程序员的晨间仪式：如何用30分钟开启高效的一天',
    summary: '分享我坚持两年的晨间仪式，包括冥想、运动计划、任务规划的具体做法。不是鸡汤，是可操作的具体步骤和工具推荐。',
    content: `## 为什么晨间仪式很重要

意志力是有限资源。早晨是意志力最充沛的时候，用来做最重要的事情是最明智的选择。

## 我的晨间仪式（30分钟）

### 1. 5分钟冥想
用 Headspace 的引导冥想，专注于呼吸。不用追求"什么都不想"，只是观察自己的思绪。

### 2. 10分钟运动
简单的 7分钟科学锻炼 + 3分钟拉伸。运动会立即提升专注力和心情。

### 3. 10分钟规划
打开 Notion，写下今天最重要的3件事（MIT：Most Important Tasks）。

### 4. 5分钟阅读
不看手机，读实体书或 Kindle。建立"阅读→工作"的积极联系。

## 两年实践的感悟

坚持这个仪式最大的挑战不是懒，是"差不多"思维：
- "今天早上稍微看一下手机应该没事吧"
- "就今天跳过一次吧"

这些"差不多"积累起来，仪式就消失了。

> 仪式的价值不在于每一步有多神奇，而在于它给你的大脑发送了一个清晰的信号：**工作时间开始了。**`,
    category: '生活随笔',
    categoryColor: '#EC4899',
    tags: ['效率', '习惯', '生活方式'],
    coverColor: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    coverEmoji: '🌅',
    date: '2026-05-02',
    views: 892,
    readingTime: 5,
  },
  {
    id: 8,
    slug: 'vite-plugin-development',
    title: '编写你的第一个 Vite 插件：原理与实践',
    summary: '通过实现一个自动导入 SVG 图标的 Vite 插件，深入理解 Vite 的插件机制，包括插件钩子、虚拟模块、HMR 更新等核心概念。',
    content: `## Vite 插件基础

Vite 插件基于 Rollup 插件接口，并做了一些扩展。一个最简单的插件是这样的：

\`\`\`typescript
export default function myPlugin() {
  return {
    name: 'my-plugin',
    transform(code: string, id: string) {
      if (id.endsWith('.vue')) {
        // 对 .vue 文件做些什么
        return code.replace('hello', 'world')
      }
    }
  }
}
\`\`\`

## 核心钩子

| 钩子 | 触发时机 |
|------|---------|
| \`config\` | 解析 Vite 配置前 |
| \`configResolved\` | 配置解析完成后 |
| \`transform\` | 文件被请求/导入时 |
| \`load\` | 加载虚拟模块 |
| \`handleHotUpdate\` | 文件变化时 |

## 虚拟模块

虚拟模块是 Vite 插件最强大的特性之一：

\`\`\`typescript
const virtualModuleId = 'virtual:my-icons'

export default function svgPlugin() {
  return {
    name: 'svg-icons',
    resolveId(id) {
      if (id === virtualModuleId) return '\\0' + virtualModuleId
    },
    load(id) {
      if (id === '\\0' + virtualModuleId) {
        return \`export const icons = [\${loadIcons()}]\`
      }
    }
  }
}
\`\`\``,
    category: '前端技术',
    categoryColor: '#3B82F6',
    tags: ['Vite', '插件开发', '工程化'],
    coverColor: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
    coverEmoji: '⚙️',
    date: '2026-04-30',
    views: 678,
    readingTime: 11,
  },
]

export const categories = [
  { name: '前端技术', count: 4, color: '#3B82F6' },
  { name: '后端开发', count: 1, color: '#10B981' },
  { name: '工具效率', count: 1, color: '#F59E0B' },
  { name: '读书笔记', count: 1, color: '#8B5CF6' },
  { name: '生活随笔', count: 1, color: '#EC4899' },
]

export const allTags = [
  { name: 'Vue 3', count: 2 },
  { name: 'TypeScript', count: 3 },
  { name: 'CSS', count: 2 },
  { name: 'NestJS', count: 1 },
  { name: 'Docker', count: 1 },
  { name: 'Vite', count: 2 },
  { name: 'Composition API', count: 1 },
  { name: '效率', count: 2 },
  { name: '读书', count: 1 },
  { name: '后端架构', count: 1 },
  { name: '响应式', count: 1 },
  { name: '习惯', count: 1 },
  { name: '布局', count: 1 },
  { name: 'Grid', count: 1 },
  { name: 'DevOps', count: 1 },
]

export const author = {
  name: '山上的风',
  avatar: '🦊',
  bio: '喜欢写代码、写文章、爬山。前端工程师，偶尔全栈。',
  location: '济南',
  github: 'github.com/blogger',
  email: 'hello@myblog.com',
  juejin: '掘金主页',
}
