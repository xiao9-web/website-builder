<template>
  <div id="app">
    <!-- ── Navigation ── -->
    <header class="nav" :class="{ scrolled: isScrolled }">
      <div class="container nav-inner">
        <!-- Logo -->
        <router-link to="/" class="nav-logo">
          <span class="logo-icon">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="15" r="15" fill="#1B6B3A"/>
              <path d="M9 19 C9 13 15 9 15 9 C15 9 21 13 21 19" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
              <path d="M12 19 C12 16 15 14 15 14 C15 14 18 16 18 19" fill="#F5A623"/>
            </svg>
          </span>
          <span class="logo-text">春昌食品科技</span>
        </router-link>

        <!-- Desktop nav links -->
        <nav class="nav-links">
          <router-link to="/" class="nav-link" exact-active-class="active">首页</router-link>
          <router-link to="/about" class="nav-link" active-class="active">关于我们</router-link>
          <router-link to="/products" class="nav-link" active-class="active">产品中心</router-link>
          <router-link to="/news" class="nav-link" active-class="active">新闻资讯</router-link>
          <router-link to="/contact" class="nav-link" active-class="active">联系我们</router-link>
        </nav>

        <!-- Phone -->
        <a href="tel:053188001234" class="nav-phone">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.01L6.6 10.8z"/>
          </svg>
          0531-8800-1234
        </a>

        <!-- Mobile burger -->
        <button class="burger" @click="mobileOpen = !mobileOpen" aria-label="菜单">
          <span :class="{ open: mobileOpen }"></span>
          <span :class="{ open: mobileOpen }"></span>
          <span :class="{ open: mobileOpen }"></span>
        </button>
      </div>

      <!-- Mobile menu -->
      <div class="mobile-menu" :class="{ open: mobileOpen }">
        <router-link to="/" class="mobile-link" @click="mobileOpen = false">首页</router-link>
        <router-link to="/about" class="mobile-link" @click="mobileOpen = false">关于我们</router-link>
        <router-link to="/products" class="mobile-link" @click="mobileOpen = false">产品中心</router-link>
        <router-link to="/news" class="mobile-link" @click="mobileOpen = false">新闻资讯</router-link>
        <router-link to="/contact" class="mobile-link" @click="mobileOpen = false">联系我们</router-link>
        <a href="tel:053188001234" class="mobile-link mobile-phone">📞 0531-8800-1234</a>
      </div>
    </header>

    <!-- ── Page content ── -->
    <main>
      <router-view />
    </main>

    <!-- ── Footer ── -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo">
              <svg width="24" height="24" viewBox="0 0 30 30" fill="none">
                <circle cx="15" cy="15" r="15" fill="#25884A"/>
                <path d="M9 19 C9 13 15 9 15 9 C15 9 21 13 21 19" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M12 19 C12 16 15 14 15 14 C15 14 18 16 18 19" fill="#F5A623"/>
              </svg>
              <span>春昌食品科技</span>
            </div>
            <p class="footer-desc">专注食品科技研发与生产，为客户提供高品质、安全健康的食品解决方案。深耕行业十五年，值得信赖。</p>
            <div class="footer-contact-info">
              <p>📍 山东省济南市历下区科技路88号</p>
              <p>📞 0531-8800-1234</p>
              <p>✉️ contact@chunchang-food.com</p>
            </div>
          </div>
          <div class="footer-col">
            <h4>关于我们</h4>
            <router-link to="/about">公司简介</router-link>
            <router-link to="/about">发展历程</router-link>
            <router-link to="/about">企业荣誉</router-link>
          </div>
          <div class="footer-col">
            <h4>产品中心</h4>
            <router-link to="/products">全部产品</router-link>
            <router-link to="/products">休闲食品</router-link>
            <router-link to="/products">功能食品</router-link>
            <router-link to="/products">健康饮品</router-link>
          </div>
          <div class="footer-col">
            <h4>更多</h4>
            <router-link to="/news">新闻资讯</router-link>
            <router-link to="/contact">联系我们</router-link>
            <a href="#">招商合作</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 山东春昌食品科技有限公司 版权所有</p>
          <a href="https://beian.miit.gov.cn" target="_blank">鲁ICP备XXXXXXXX号</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const mobileOpen = ref(false)

const onScroll = () => { isScrolled.value = window.scrollY > 60 }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
/* ── Nav ── */
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  background: transparent;
  transition: background var(--transition), box-shadow var(--transition);
}
.nav.scrolled {
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 12px rgba(0,0,0,0.09);
}
.nav-inner {
  display: flex;
  align-items: center;
  height: var(--nav-height);
  gap: 24px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  text-decoration: none;
}
.logo-icon { display: flex; }
.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  transition: color var(--transition);
}
.nav.scrolled .logo-text { color: var(--primary); }

.nav-links {
  display: flex;
  gap: 2px;
  flex: 1;
  justify-content: center;
}
.nav-link {
  padding: 7px 16px;
  font-size: 15px;
  font-weight: 500;
  color: rgba(255,255,255,0.88);
  border-radius: 6px;
  transition: all var(--transition);
  position: relative;
}
.nav:not(.scrolled) .nav-link:hover {
  color: #fff;
  background: rgba(255,255,255,0.12);
}
.nav:not(.scrolled) .nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0; left: 16px; right: 16px;
  height: 2px;
  background: var(--accent);
  border-radius: 2px;
}
.nav.scrolled .nav-link { color: var(--text-secondary); }
.nav.scrolled .nav-link:hover { color: var(--primary); background: var(--primary-bg); }
.nav.scrolled .nav-link.active { color: var(--primary); font-weight: 600; }

.nav-phone {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
  flex-shrink: 0;
  white-space: nowrap;
  transition: color var(--transition);
}
.nav.scrolled .nav-phone { color: var(--primary); }

.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  padding: 6px;
  margin-left: auto;
}
.burger span {
  display: block;
  width: 24px; height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: all var(--transition);
}
.nav.scrolled .burger span { background: var(--text); }

.mobile-menu {
  display: none;
  flex-direction: column;
  background: var(--bg-dark);
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease;
}
.mobile-menu.open { max-height: 360px; }
.mobile-link {
  display: block;
  padding: 13px 24px;
  font-size: 15px;
  color: rgba(255,255,255,0.8);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  transition: color var(--transition), background var(--transition);
}
.mobile-link:hover { background: rgba(255,255,255,0.06); color: #fff; }
.mobile-phone { color: var(--accent) !important; }

@media (max-width: 900px) {
  .nav-phone { display: none; }
}
@media (max-width: 768px) {
  .burger { display: flex; }
  .nav-links { display: none; }
  .mobile-menu { display: flex; }
}

/* ── Footer ── */
.footer {
  background: var(--bg-dark);
  color: rgba(255,255,255,0.65);
  padding: 64px 0 0;
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  padding-bottom: 48px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
@media (max-width: 900px) {
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
}
@media (max-width: 580px) {
  .footer-grid { grid-template-columns: 1fr; gap: 24px; }
}
.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 14px;
}
.footer-desc {
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 18px;
  color: rgba(255,255,255,0.5);
}
.footer-contact-info p {
  font-size: 13px;
  margin-bottom: 7px;
  color: rgba(255,255,255,0.55);
}
.footer-col h4 {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;
}
.footer-col a {
  display: block;
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 10px;
  transition: color var(--transition);
  text-decoration: none;
}
.footer-col a:hover { color: var(--accent); }
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  font-size: 13px;
  color: rgba(255,255,255,0.35);
  flex-wrap: wrap;
  gap: 8px;
}
.footer-bottom a { color: rgba(255,255,255,0.35); text-decoration: none; }
.footer-bottom a:hover { color: var(--accent); }
</style>
