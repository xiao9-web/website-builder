<template>
  <div id="app">
    <GradientBackground />

    <header class="header">
      <div class="container">
        <div class="header-left">
          <div class="logo">
            <span class="logo-icon">🏙️</span>
            <span class="logo-text">{{ siteConfig.site_name || '我的博客' }}</span>
          </div>
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="搜索文档" class="search-input" />
            <span class="search-shortcut">⌘K</span>
          </div>
        </div>
        <nav class="nav">
          <router-link
            v-for="menu in menus"
            :key="menu.id"
            :to="menu.path"
            class="nav-link"
          >
            {{ menu.name }}
          </router-link>
          <div class="nav-actions">
            <button class="icon-btn" title="语言切换">🌐</button>
            <button class="icon-btn" title="主题切换">☀️</button>
            <a href="https://github.com" target="_blank" class="icon-btn" title="GitHub">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </a>
          </div>
        </nav>
      </div>
    </header>

    <main class="main">
      <router-view />
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
  height: 60px;
  gap: 32px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  padding: 6px 12px;
  min-width: 200px;
  transition: all 0.2s;
}

.search-box:focus-within {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(0, 0, 0, 0.2);
}

.search-icon {
  font-size: 14px;
  opacity: 0.5;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #333;
}

.search-input::placeholder {
  color: #999;
}

.search-shortcut {
  font-size: 12px;
  color: #999;
  font-family: monospace;
}

.nav {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-link {
  color: #555;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
  padding: 8px 12px;
  border-radius: 6px;
  white-space: nowrap;
}

.nav-link:hover {
  color: #333;
  background: rgba(0, 0, 0, 0.05);
}

.nav-link.router-link-active {
  color: #333;
  background: rgba(0, 0, 0, 0.08);
  font-weight: 600;
}

.nav-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: 16px;
  padding-left: 16px;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
  text-decoration: none;
}

.icon-btn:hover {
  background: rgba(0, 0, 0, 0.05);
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
