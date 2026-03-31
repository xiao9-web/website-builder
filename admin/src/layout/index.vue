<template>
  <div class="layout-container">
    <el-container class="layout-wrapper">
      <!-- 侧边栏 -->
      <el-aside width="240px" class="layout-sidebar">
        <div class="sidebar-logo">
          <h2>官网管理</h2>
        </div>
        <el-menu
          :default-active="activeMenu"
          router
          class="sidebar-menu"
          :collapse="isCollapse"
        >
          <el-menu-item index="/dashboard">
            <el-icon><Odometer /></el-icon>
            <template #title>控制台</template>
          </el-menu-item>
          <el-menu-item index="/menu">
            <el-icon><Menu /></el-icon>
            <template #title>菜单管理</template>
          </el-menu-item>
          <el-menu-item index="/article">
            <el-icon><Document /></el-icon>
            <template #title>文章管理</template>
          </el-menu-item>
          <el-menu-item index="/page">
            <el-icon><Files /></el-icon>
            <template #title>页面管理</template>
          </el-menu-item>
          <el-menu-item index="/attachment">
            <el-icon><Picture /></el-icon>
            <template #title>附件管理</template>
          </el-menu-item>
          <el-menu-item index="/site-config">
            <el-icon><Setting /></el-icon>
            <template #title>网站配置</template>
          </el-menu-item>
          <el-menu-item index="/deploy">
            <el-icon><UploadFilled /></el-icon>
            <template #title>部署管理</template>
          </el-menu-item>
          <el-menu-item index="/user">
            <el-icon><User /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container class="layout-main">
        <!-- 顶部导航 -->
        <el-header class="layout-header">
          <div class="header-left">
            <el-icon @click="toggleCollapse" class="collapse-btn">
              <Fold v-if="!isCollapse" />
              <Expand v-if="isCollapse" />
            </el-icon>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-if="breadcrumbTitle">{{ breadcrumbTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <el-avatar :size="32" :src="userInfo?.avatar" class="mr-10">
                  {{ userInfo?.nickname?.charAt(0) || '管' }}
                </el-avatar>
                <span class="username">{{ userInfo?.nickname || userInfo?.username }}</span>
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 内容区 -->
        <el-main class="layout-content">
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
} from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isCollapse = ref(false)
const userInfo = computed(() => userStore.userInfo)

const activeMenu = computed(() => {
  return route.path
})

const breadcrumbTitle = computed(() => {
  return route.meta.title as string
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    userStore.logout()
    ElMessage.success('退出成功')
    router.push('/login')
  }
}

// 获取用户信息
const getUserInfo = async () => {
  try {
    await userStore.getUserInfo()
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

getUserInfo()
</script>

<style scoped lang="css">
.layout-container {
  width: 100%;
  height: 100%;
}

.layout-wrapper {
  height: 100%;
}

.layout-sidebar {
  background: #001529;
  height: 100%;
  overflow: hidden;
  transition: width 0.3s;
}

.sidebar-logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #002140;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

.sidebar-menu {
  border-right: none;
  background: #001529;
}

:deep(.el-menu-item) {
  color: #aeb9c2;
}

:deep(.el-menu-item:hover) {
  background: #1890ff !important;
  color: #fff !important;
}

:deep(.el-menu-item.is-active) {
  background: #1890ff !important;
  color: #fff !important;
}

.layout-main {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.layout-header {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px !important;
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-btn {
  font-size: 20px;
  margin-right: 20px;
  cursor: pointer;
  color: #666;
}

.collapse-btn:hover {
  color: #1890ff;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;
  height: 100%;
}

.user-info:hover {
  background: #f5f5f5;
}

.username {
  margin: 0 8px;
  color: #666;
}

.layout-content {
  flex: 1;
  background: #f0f2f5;
  padding: 20px;
  overflow: auto;
}

/* 过渡动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
