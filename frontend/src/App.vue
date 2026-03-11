<template>
  <div id="app">
    <GradientBackground />

    <header class="header">
      <div class="container">
        <div class="header-left">
          <div class="logo">
            <span class="logo-icon">🏙️</span>
            <h1>{{ siteConfig.site_name || '我的博客' }}</h1>
          </div>
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
      <Home />
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
import GradientBackground from './components/GradientBackground.vue'
import Home from './views/Home.vue'
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

const menus = ref<Menu[]>([])

onMounted(async () => {
  try {
    // 从API获取菜单数据
    const response = await fetch('http://localhost:3000/api/v1/menus/published')
    if (response.ok) {
      const data = await response.json()
      menus.value = data.filter((menu: any) => menu.is_visible).sort((a: any, b: any) => a.sort - b.sort)
    }
  } catch (error) {
    console.error('Failed to load menus:', error)
    // 使用默认菜单作为后备
    menus.value = [
      { id: 1, name: '首页', path: '/', target: '_self' },
      { id: 2, name: '关于', path: '/about', target: '_self' },
    ]
  }
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
  height: 64px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 28px;
}

.logo h1 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.nav {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-link {
  color: #555;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s;
  padding: 4px 0;
}

.nav-link:hover {
  color: #333;
}

.main {
  flex: 1;
  width: 100%;
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
