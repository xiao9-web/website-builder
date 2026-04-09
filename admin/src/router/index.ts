import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      noAuth: true,
    },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '控制台',
          icon: 'Odometer',
        },
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/menu/index.vue'),
        meta: {
          title: '菜单管理',
          icon: 'Menu',
        },
      },
      {
        path: 'article',
        name: 'Article',
        component: () => import('@/views/article/index.vue'),
        meta: {
          title: '文章管理',
          icon: 'Document',
        },
      },
      {
        path: 'article/edit/:id?',
        name: 'ArticleEdit',
        component: () => import('@/views/article/edit.vue'),
        meta: {
          title: '编辑文章',
          hideMenu: true,
        },
      },
      {
        path: 'article/trash',
        name: 'ArticleTrash',
        component: () => import('@/views/article/trash.vue'),
        meta: {
          title: '文章回收站',
          hideMenu: true,
        },
      },
      {
        path: 'file',
        name: 'File',
        component: () => import('@/views/file/index.vue'),
        meta: {
          title: '文件管理',
          icon: 'Folder',
        },
      },
      {
        path: 'attachment',
        name: 'Attachment',
        component: () => import('@/views/attachment/index.vue'),
        meta: {
          title: '附件管理',
          icon: 'Picture',
        },
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/index.vue'),
        meta: {
          title: '分类管理',
          icon: 'FolderOpened',
        },
      },
      {
        path: 'tag',
        name: 'Tag',
        component: () => import('@/views/tag/index.vue'),
        meta: {
          title: '标签管理',
          icon: 'CollectionTag',
        },
      },
      {
        path: 'page',
        name: 'Page',
        component: () => import('@/views/page/index.vue'),
        meta: {
          title: '页面管理',
          icon: 'Files',
        },
      },
      {
        path: 'page/edit/:id?',
        name: 'PageEdit',
        component: () => import('@/views/page/edit.vue'),
        meta: {
          title: '编辑页面',
          hideMenu: true,
        },
      },
      {
        path: 'product',
        name: 'Product',
        component: () => import('@/views/product/index.vue'),
        meta: {
          title: '产品管理',
          icon: 'ShoppingCart',
        },
      },
      {
        path: 'media',
        name: 'Media',
        component: () => import('@/views/media/index.vue'),
        meta: {
          title: '媒体库',
          icon: 'PictureFilled',
        },
      },
      {
        path: 'site-config',
        name: 'SiteConfig',
        component: () => import('@/views/site-config/index.vue'),
        meta: {
          title: '网站配置',
          icon: 'Setting',
        },
      },
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('@/views/setting/index.vue'),
        meta: {
          title: '系统设置',
          icon: 'Tools',
        },
      },
      {
        path: 'deploy',
        name: 'Deploy',
        component: () => import('@/views/deploy/index.vue'),
        meta: {
          title: '部署管理',
          icon: 'UploadFilled',
        },
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'User',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      noAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - 官网管理系统` || '官网管理系统'
  
  const userStore = useUserStore()
  const token = userStore.token

  // 不需要登录的页面
  if (to.meta.noAuth) {
    next()
    return
  }

  // 没有token跳转到登录页
  if (!token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  next()
})

export default router
