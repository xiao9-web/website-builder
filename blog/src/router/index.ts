import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    { path: '/',                 name: 'home',       component: () => import('../views/Home.vue') },
    { path: '/articles',         name: 'articles',   component: () => import('../views/Articles.vue') },
    { path: '/articles/:slug',   name: 'article',    component: () => import('../views/ArticleDetail.vue') },
    { path: '/archive',          name: 'archive',    component: () => import('../views/Archive.vue') },
    { path: '/tags',             name: 'tags',       component: () => import('../views/Tags.vue') },
    { path: '/about',            name: 'about',      component: () => import('../views/BlogAbout.vue') },
    { path: '/:pathMatch(.*)*',  redirect: '/' },
  ],
})

export default router
