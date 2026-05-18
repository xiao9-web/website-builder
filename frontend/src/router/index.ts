import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    { path: '/',          name: 'home',           component: () => import('../views/Home.vue') },
    { path: '/about',     name: 'about',           component: () => import('../views/About.vue') },
    { path: '/products',  name: 'products',        component: () => import('../views/Products.vue') },
    { path: '/products/:id', name: 'product-detail', component: () => import('../views/ProductDetail.vue') },
    { path: '/news',      name: 'news',            component: () => import('../views/News.vue') },
    { path: '/news/:id',  name: 'news-detail',     component: () => import('../views/NewsDetail.vue') },
    { path: '/contact',   name: 'contact',         component: () => import('../views/Contact.vue') },
    // Catch-all
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
