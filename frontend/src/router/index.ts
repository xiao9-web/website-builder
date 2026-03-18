import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Category from '../views/Category.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/articles',
      name: 'articles',
      component: Category
    },
    {
      path: '/articles/:slug',
      name: 'article-detail',
      component: () => import('../views/ArticleDetail.vue')
    },
    {
      path: '/preview/:id',
      name: 'article-preview',
      component: () => import('../views/ArticlePreview.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue')
    },
    {
      path: '/thoughts',
      name: 'thoughts',
      component: Category
    },
    {
      path: '/wujidasheng',
      name: 'wujidasheng',
      component: Category
    },
    // 动态路由，匹配所有其他路径到 Category 组件
    {
      path: '/:pathMatch(.*)*',
      name: 'dynamic-category',
      component: Category
    }
  ]
})

export default router
