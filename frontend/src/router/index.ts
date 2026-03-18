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
      component: () => import('../views/ArticleList.vue')
    },
    {
      path: '/articles/:slug',
      name: 'article-detail',
      component: () => import('../views/ArticleDetail.vue')
    },
    {
      path: '/category/:id',
      name: 'category',
      component: () => import('../views/Category.vue')
    },
    {
      path: '/tag/:slug',
      name: 'tag',
      component: () => import('../views/Tag.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/Search.vue')
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
    }
  ]
})

export default router
