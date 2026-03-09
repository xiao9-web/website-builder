<template>
  <div id="app">
    <ParticleBackground 
      :color="siteConfig.template_theme_color || '#667eea'"
      :count="80"
      :interactive="true"
      :background-color="backgroundColor"
    />
    
    <header class="header">
      <div class="container">
        <div class="logo">
          <h1>{{ siteConfig.site_name || '我的官网' }}</h1>
        </div>
        <nav class="nav">
          <a 
            v-for="menu in menus" 
            :key="menu.id"
            :href="menu.path"
            :target="menu.target"
            class="nav-link"
          >
            {{ menu.name }}
          </a>
        </nav>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <router-view />
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>{{ siteConfig.site_copyright || 'Copyright © 2024 My Site' }}</p>
        <p v-if="siteConfig.site_icp" class="icp">{{ siteConfig.site_icp }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ParticleBackground from './components/ParticleBackground.vue'
import type { Menu, SiteConfig } from './types'

// 模拟数据，实际部署时会替换为真实数据
const siteConfig = ref<SiteConfig>({
  site_name: '我的官网',
  site_description: '这是我的个人官网',
  site_copyright: 'Copyright © 2024 My Site',
  site_icp: '粤ICP备XXXXXX号',
  template_theme_color: '#667eea',
  template_background: {
    type: 'particle',
    options: {
      color: '#667eea',
      density: 80,
      interactive: true,
    }
  }
})

const menus = ref<Menu[]>([
  { id: 1, name: '首页', path: '/', target: '_self' },
  { id: 2, name: '关于', path: '/about', target: '_self' },
  { id: 3, name: '文章', path: '/articles', target: '_self' },
  { id: 4, name: '项目', path: '/projects', target: '_self' },
  { id: 5, name: 'GitHub', path: 'https://github.com', target: '_blank' },
])

const backgroundColor = ref('linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)')

onMounted(() => {
  // 实际部署时会从data.json加载真实数据
  // const data = await fetch('/data.json').then(res => res.json())
  // siteConfig.value = data.site
  // menus.value = data.menus
})
</script>

<style scoped lang="css">
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.nav {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #667eea;
}

.main {
  flex: 1;
  padding: 40px 0;
}

.footer {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 30px 0;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.footer p {
  margin: 5px 0;
}

.icp {
  font-size: 12px;
  color: #999;
}
</style>
