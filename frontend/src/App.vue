<template>
  <div id="app">
    <GradientBackground />

    <header class="header">
      <div class="container">
        <div class="header-left">
          <router-link to="/" class="logo">
            <span class="logo-icon">🏙️</span>
            <span class="logo-text">{{ siteConfig.site_name || '我的博客' }}</span>
          </router-link>
        </div>
        <nav class="nav">
          <template v-for="menu in menus" :key="menu.id">
            <!-- 一级菜单 -->
            <div v-if="!menu.parent_id" class="nav-item">
              <router-link
                :to="getMenuPath(menu)"
                class="nav-link"
              >
                {{ menu.name }}
              </router-link>
              <!-- 二级菜单 -->
              <div v-if="menu.children && menu.children.length > 0" class="submenu">
                <template v-for="child in menu.children" :key="child.id">
                  <div class="submenu-item">
                    <router-link
                      :to="getMenuPath(child)"
                      class="nav-link"
                    >
                      {{ child.name }}
                    </router-link>
                    <!-- 三级菜单 -->
                    <div v-if="child.children && child.children.length > 0" class="subsubmenu">
                      <router-link
                        v-for="grandchild in child.children"
                        :key="grandchild.id"
                        :to="getMenuPath(grandchild)"
                        class="nav-link"
                      >
                        {{ grandchild.name }}
                      </router-link>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </nav>
        <div class="header-right">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="搜索文档" class="search-input" />
            <span class="search-shortcut">⌘K</span>
          </div>
          <div class="nav-actions">
            <button class="icon-btn" title="语言切换">🌐</button>
            <button class="icon-btn" title="主题切换">☀️</button>
            <a href="https://github.com" target="_blank" class="icon-btn" title="GitHub">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </a>
          </div>
        </div>
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
import { getPublishedMenus } from './api/menu'
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

const getMenuPath = (menu: Menu) => {
  // 优先使用关联的分类（显示文章列表）
  if (menu.category_id && menu.category) {
    return `/category/${menu.category_id}`
  }
  // 如果关联了文章，跳转到菜单文章列表页
  if (menu.article_id) {
    return `/menu/${menu.id}`
  }
  // 如果有自定义路径，使用自定义路径
  if (menu.path && menu.path !== '/') {
    return menu.path
  }
  // 默认返回首页
  return '/'
}

onMounted(async () => {
  try {
    const data = await getPublishedMenus()
    menus.value = data
  } catch (error) {
    console.error('Failed to load menus:', error)
    // 使用默认菜单作为后备
    menus.value = [
      { id: 1, name: '首页', path: '/', target: '_self', is_visible: true, sort: 0 },
      { id: 2, name: '关于', path: '/about', target: '_self', is_visible: true, sort: 1 },
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.container {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  gap: 32px;
  padding: 0 40px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  min-width: 280px;
}

.nav {
  display: flex;
  gap: 8px;
  align-items: center;
  flex: 1;
  justify-content: center;
  position: relative;
}

.nav-item {
  position: relative;
}

.nav-item > .nav-link {
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-item:hover > .nav-link {
  background: rgba(102, 126, 234, 0.08);
}

.submenu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 6px;
  min-width: 200px;
  z-index: 200;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.nav-item:hover > .submenu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.submenu-item {
  position: relative;
}

.submenu-item > .nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.submenu-item > .nav-link::after {
  content: '›';
  font-size: 18px;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.2s ease;
}

.submenu-item:has(.subsubmenu) > .nav-link::after {
  opacity: 0.4;
  transform: translateX(0);
}

.submenu-item:hover > .nav-link {
  background: rgba(102, 126, 234, 0.08);
  color: #667eea;
}

.submenu-item:hover > .nav-link::after {
  opacity: 1;
  transform: translateX(2px);
}

.subsubmenu {
  position: absolute;
  top: 0;
  left: calc(100% + 8px);
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 6px;
  min-width: 200px;
  z-index: 200;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-8px);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.submenu-item:hover > .subsubmenu {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
}

.submenu .nav-link,
.subsubmenu .nav-link {
  display: block;
  padding: 10px 14px;
  border-bottom: none;
  white-space: nowrap;
  color: #555;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.submenu .nav-link:hover,
.subsubmenu .nav-link:hover {
  background: rgba(102, 126, 234, 0.08);
  color: #667eea;
  border-bottom: none;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.logo:hover {
  opacity: 0.8;
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
  width: 220px;
  transition: background 0.2s, border-color 0.2s;
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

.nav-link {
  color: #555;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
  padding: 4px 8px;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: #333;
  border-bottom-color: #667eea;
}

.nav-link.router-link-active {
  color: #667eea;
  border-bottom-color: #667eea;
  font-weight: 600;
}

.nav-actions {
  display: flex;
  gap: 8px;
  align-items: center;
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
  margin-top: 60px;
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
