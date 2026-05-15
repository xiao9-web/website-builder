<template>
  <div id="app">
    <!-- 导航 -->
    <header class="nav" :class="{ scrolled: isScrolled }">
      <div class="container nav-inner">
        <router-link to="/" class="nav-logo">
          <span class="logo-avatar">🦊</span>
          <span class="logo-text">山上的风</span>
        </router-link>

        <nav class="nav-links">
          <router-link to="/" class="nav-link" exact-active-class="active">首页</router-link>
          <router-link to="/articles" class="nav-link" active-class="active">文章</router-link>
          <router-link to="/archive" class="nav-link" active-class="active">归档</router-link>
          <router-link to="/tags" class="nav-link" active-class="active">标签</router-link>
          <router-link to="/about" class="nav-link" active-class="active">关于</router-link>
        </nav>

        <button class="burger" @click="mobileOpen = !mobileOpen" aria-label="菜单">
          <span :class="{ open: mobileOpen }"></span>
          <span :class="{ open: mobileOpen }"></span>
          <span :class="{ open: mobileOpen }"></span>
        </button>
      </div>

      <div class="mobile-menu" :class="{ open: mobileOpen }">
        <router-link to="/" class="mobile-link" @click="mobileOpen = false">首页</router-link>
        <router-link to="/articles" class="mobile-link" @click="mobileOpen = false">文章</router-link>
        <router-link to="/archive" class="mobile-link" @click="mobileOpen = false">归档</router-link>
        <router-link to="/tags" class="mobile-link" @click="mobileOpen = false">标签</router-link>
        <router-link to="/about" class="mobile-link" @click="mobileOpen = false">关于</router-link>
      </div>
    </header>

    <main>
      <router-view />
    </main>

    <footer class="footer">
      <div class="container footer-inner">
        <p class="footer-copy">© 2026 山上的风 · 用文字记录成长</p>
        <div class="footer-links">
          <a href="#">GitHub</a>
          <a href="#">掘金</a>
          <a href="#">RSS</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const mobileOpen = ref(false)

const onScroll = () => { isScrolled.value = window.scrollY > 20 }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  z-index: 100;
  transition: all 0.3s ease;
}
.nav.scrolled {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-light);
  box-shadow: 0 1px 12px rgba(0,0,0,0.06);
}
.nav-inner {
  display: flex;
  align-items: center;
  gap: 32px;
  height: 100%;
}
.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 16px;
  color: var(--text);
  flex-shrink: 0;
}
.logo-avatar { font-size: 22px; }
.logo-text { color: var(--text); }

.nav-links {
  display: flex;
  gap: 4px;
  margin-left: auto;
}
.nav-link {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--transition);
}
.nav-link:hover { color: var(--text); background: var(--bg-section); }
.nav-link.active { color: var(--primary); background: var(--primary-light); }

/* Burger */
.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
  margin-left: auto;
}
.burger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: all 0.25s ease;
}
.burger span.open:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.burger span.open:nth-child(2) { opacity: 0; }
.burger span.open:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

.mobile-menu {
  display: none;
  flex-direction: column;
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(12px);
  padding: 12px 0;
  border-top: 1px solid var(--border);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.mobile-menu.open { max-height: 300px; }
.mobile-link {
  padding: 12px 24px;
  font-size: 15px;
  color: var(--text-secondary);
  font-weight: 500;
}
.mobile-link:hover { color: var(--primary); }

@media (max-width: 768px) {
  .nav-links { display: none; }
  .burger { display: flex; }
  .mobile-menu { display: flex; }
}

/* Footer */
.footer {
  border-top: 1px solid var(--border);
  padding: 28px 0;
  margin-top: 80px;
}
.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.footer-copy { font-size: 14px; color: var(--text-light); }
.footer-links { display: flex; gap: 20px; }
.footer-links a { font-size: 14px; color: var(--text-light); transition: color var(--transition); }
.footer-links a:hover { color: var(--primary); }
</style>
