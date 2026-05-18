<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <aside class="layout-sidebar" :class="{ collapsed: isCollapse }">
      <!-- Logo 区 -->
      <div class="sidebar-logo">
        <div class="logo-icon">
          <el-icon size="22"><Monitor /></el-icon>
        </div>
        <span class="logo-text" v-show="!isCollapse">官网管理</span>
      </div>

      <!-- 菜单区 -->
      <nav class="sidebar-nav">
        <!-- 分组：控制台 -->
        <div class="nav-item" :class="{ active: activeMenu === '/dashboard' }" @click="navigate('/dashboard')">
          <el-icon class="nav-icon"><Odometer /></el-icon>
          <span class="nav-label" v-show="!isCollapse">控制台</span>
        </div>

        <!-- 分组：内容管理 -->
        <div class="nav-group-label" v-show="!isCollapse">内容管理</div>
        <div class="nav-item" :class="{ active: activeMenu === '/article' }" @click="navigate('/article')">
          <el-icon class="nav-icon"><Document /></el-icon>
          <span class="nav-label" v-show="!isCollapse">文章管理</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === '/page' }" @click="navigate('/page')">
          <el-icon class="nav-icon"><Files /></el-icon>
          <span class="nav-label" v-show="!isCollapse">页面管理</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === '/attachment' }" @click="navigate('/attachment')">
          <el-icon class="nav-icon"><Picture /></el-icon>
          <span class="nav-label" v-show="!isCollapse">附件管理</span>
        </div>

        <!-- 分组：网站管理 -->
        <div class="nav-group-label" v-show="!isCollapse">网站管理</div>
        <div class="nav-item" :class="{ active: activeMenu === '/menu' }" @click="navigate('/menu')">
          <el-icon class="nav-icon"><Menu /></el-icon>
          <span class="nav-label" v-show="!isCollapse">菜单管理</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === '/site-config' }" @click="navigate('/site-config')">
          <el-icon class="nav-icon"><Setting /></el-icon>
          <span class="nav-label" v-show="!isCollapse">网站配置</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === '/deploy' }" @click="navigate('/deploy')">
          <el-icon class="nav-icon"><UploadFilled /></el-icon>
          <span class="nav-label" v-show="!isCollapse">部署管理</span>
        </div>

        <!-- 分组：系统 -->
        <div class="nav-group-label" v-show="!isCollapse">系统</div>
        <div class="nav-item" :class="{ active: activeMenu === '/user' }" @click="navigate('/user')">
          <el-icon class="nav-icon"><User /></el-icon>
          <span class="nav-label" v-show="!isCollapse">用户管理</span>
        </div>
      </nav>

      <!-- 底部用户区 -->
      <div class="sidebar-user" @click="showUserMenu = !showUserMenu" v-if="!isCollapse">
        <el-avatar :size="32" class="user-avatar">
          {{ userInfo?.nickname?.charAt(0) || userInfo?.username?.charAt(0) || '管' }}
        </el-avatar>
        <div class="user-meta">
          <span class="user-name">{{ userInfo?.nickname || userInfo?.username }}</span>
          <span class="user-role">管理员</span>
        </div>
        <el-icon class="user-more"><MoreFilled /></el-icon>
      </div>
      <div class="sidebar-user sidebar-user--collapsed" v-else>
        <el-avatar :size="32" class="user-avatar">
          {{ userInfo?.nickname?.charAt(0) || userInfo?.username?.charAt(0) || '管' }}
        </el-avatar>
      </div>
    </aside>

    <!-- 主内容区 -->
    <div class="layout-main">
      <!-- 顶部导航 -->
      <header class="layout-header">
        <div class="header-left">
          <button class="collapse-btn" @click="toggleCollapse" :title="isCollapse ? '展开侧边栏' : '折叠侧边栏'">
            <el-icon size="18">
              <Fold v-if="!isCollapse" />
              <Expand v-else />
            </el-icon>
          </button>
          <el-breadcrumb separator="/" class="header-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="breadcrumbTitle">{{ breadcrumbTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="header-user">
              <el-avatar :size="30" class="header-avatar">
                {{ userInfo?.nickname?.charAt(0) || userInfo?.username?.charAt(0) || '管' }}
              </el-avatar>
              <span class="header-username">{{ userInfo?.nickname || userInfo?.username }}</span>
              <el-icon size="12" class="header-arrow"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon> 个人信息
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon> 退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 内容区 -->
      <main class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Menu,
  Odometer,
  Document,
  Files,
  Picture,
  Setting,
  UploadFilled,
  User,
  Fold,
  Expand,
  ArrowDown,
  Monitor,
  MoreFilled,
  SwitchButton,
} from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isCollapse = ref(false)
const showUserMenu = ref(false)
const userInfo = computed(() => userStore.userInfo)

const activeMenu = computed(() => route.path.split('/').slice(0, 2).join('/') || route.path)

const breadcrumbTitle = computed(() => route.meta.title as string)

const navigate = (path: string) => router.push(path)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '退出确认', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning',
      })
      userStore.logout()
      ElMessage.success('已退出登录')
      router.push('/login')
    } catch {
      // 取消退出
    }
  }
}

const getUserInfo = async () => {
  try {
    await userStore.getUserInfo()
  } catch {
    // 静默处理
  }
}

getUserInfo()
</script>

<style scoped>
/* ── 整体容器 ── */
.layout-container {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--color-bg-page);
}

/* ────────────────────────────
   侧边栏
───────────────────────────── */
.layout-sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  height: 100%;
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  box-shadow: var(--sidebar-shadow);
  transition: width var(--transition-slow), min-width var(--transition-slow);
  z-index: var(--z-sidebar);
  overflow: hidden;
}

.layout-sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
  min-width: var(--sidebar-collapsed-width);
}

/* Logo 区 */
.sidebar-logo {
  height: var(--header-height);
  min-height: var(--header-height);
  background: var(--sidebar-header-bg);
  display: flex;
  align-items: center;
  padding: 0 var(--space-4);
  gap: var(--space-3);
  overflow: hidden;
  white-space: nowrap;
}

.logo-icon {
  width: 36px;
  height: 36px;
  min-width: 36px;
  background: var(--color-primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.logo-text {
  font-size: var(--text-md);
  font-weight: var(--font-semibold);
  color: #fff;
  letter-spacing: 0.5px;
}

/* 菜单导航 */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--space-3) var(--space-2);
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.nav-group-label {
  padding: var(--space-3) var(--space-3) var(--space-1);
  font-size: var(--text-xs);
  color: var(--sidebar-group-label);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  white-space: nowrap;
  overflow: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-3);
  height: 42px;
  border-radius: var(--radius-md);
  margin-bottom: 2px;
  cursor: pointer;
  color: var(--sidebar-text);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  transition: all var(--transition-fast);
  white-space: nowrap;
  overflow: hidden;
  position: relative;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) scaleY(0);
  width: 3px;
  height: 60%;
  background: var(--color-primary);
  border-radius: 0 2px 2px 0;
  transition: transform var(--transition-fast);
}

.nav-item:hover {
  background: var(--sidebar-item-hover-bg);
  color: #fff;
}

.nav-item.active {
  background: var(--sidebar-item-active-bg);
  color: var(--sidebar-text-active);
}

.nav-item.active::before {
  transform: translateY(-50%) scaleY(1);
}

.nav-item.active .nav-icon {
  color: var(--color-primary-light);
}

.nav-icon {
  font-size: 18px;
  min-width: 18px;
  transition: color var(--transition-fast);
}

.nav-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 底部用户区 */
.sidebar-user {
  height: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-4);
  border-top: 1px solid var(--sidebar-divider);
  cursor: pointer;
  transition: background var(--transition-fast);
  overflow: hidden;
  white-space: nowrap;
}

.sidebar-user:hover {
  background: var(--sidebar-item-hover-bg);
}

.sidebar-user--collapsed {
  justify-content: center;
  padding: 0;
}

.user-avatar {
  min-width: 32px;
  background: var(--color-primary);
  color: #fff;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.user-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: var(--text-xs);
  color: var(--sidebar-text);
  margin-top: 1px;
}

.user-more {
  color: var(--sidebar-text);
  font-size: 16px;
}

/* ────────────────────────────
   主内容区
───────────────────────────── */
.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  overflow: hidden;
}

/* 顶部导航 */
.layout-header {
  height: var(--header-height);
  min-height: var(--header-height);
  background: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
  z-index: var(--z-header);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.collapse-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.collapse-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-primary);
}

.header-breadcrumb {
  font-size: var(--text-sm);
}

/* 右侧用户 */
.header-right {
  display: flex;
  align-items: center;
}

.header-user {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast);
  outline: none;
}

.header-user:hover {
  background: var(--color-bg-hover);
}

.header-avatar {
  background: var(--color-primary);
  color: #fff;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.header-username {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.header-arrow {
  color: var(--color-text-tertiary);
  margin-left: 2px;
}

/* 内容区 */
.layout-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--space-6);
  background: var(--color-bg-page);
}

/* ── 页面切换动画 ── */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity var(--transition-slow), transform var(--transition-slow);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
