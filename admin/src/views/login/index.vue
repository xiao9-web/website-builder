<template>
  <div class="login-page">
    <!-- 背景装饰圆 -->
    <div class="bg-circle bg-circle-1"></div>
    <div class="bg-circle bg-circle-2"></div>
    <div class="bg-circle bg-circle-3"></div>

    <div class="login-card">
      <!-- 头部 -->
      <div class="login-head">
        <div class="login-logo">
          <el-icon size="28"><Monitor /></el-icon>
        </div>
        <h1 class="login-title">官网管理系统</h1>
        <p class="login-subtitle">欢迎回来，请登录您的账号</p>
      </div>

      <!-- 表单 -->
      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
        @keyup.enter="handleLogin"
        label-position="top"
      >
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            clearable
          >
            <template #prefix>
              <el-icon color="#94A3B8"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password" label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            clearable
          >
            <template #prefix>
              <el-icon color="#94A3B8"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <p class="login-hint">默认账号：admin &nbsp;/&nbsp; admin123</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { Monitor, User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import type { LoginParams } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = ref<LoginParams>({
  username: '',
  password: '',
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' },
  ],
}

const handleLogin = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      await userStore.login(loginForm.value)
      ElMessage.success('登录成功')
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/dashboard')
    } catch {
      // 错误由 request 拦截器处理
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-page {
  width: 100%;
  height: 100%;
  background: #EEF2FF;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 背景装饰圆 */
.bg-circle {
  position: absolute;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  opacity: 0.08;
  pointer-events: none;
}

.bg-circle-1 {
  width: 500px;
  height: 500px;
  top: -180px;
  right: -120px;
}

.bg-circle-2 {
  width: 320px;
  height: 320px;
  bottom: -100px;
  left: -80px;
  opacity: 0.06;
}

.bg-circle-3 {
  width: 180px;
  height: 180px;
  bottom: 120px;
  right: 100px;
  opacity: 0.05;
}

/* 卡片 */
.login-card {
  width: 420px;
  background: var(--color-bg-card);
  border-radius: var(--radius-2xl);
  padding: var(--space-10) var(--space-8);
  box-shadow: var(--shadow-xl);
  position: relative;
  z-index: 1;
}

/* 头部 */
.login-head {
  text-align: center;
  margin-bottom: var(--space-8);
}

.login-logo {
  width: 56px;
  height: 56px;
  background: var(--color-primary);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin: 0 auto var(--space-4);
  box-shadow: 0 8px 20px rgba(79, 110, 247, 0.3);
}

.login-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  letter-spacing: 0.5px;
}

.login-subtitle {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
}

/* 表单 */
.login-form {
  :deep(.el-form-item__label) {
    font-weight: var(--font-medium);
    color: var(--color-text-primary);
    font-size: var(--text-sm);
    padding-bottom: var(--space-1);
  }

  :deep(.el-input__wrapper) {
    height: 44px;
    padding: 0 var(--space-4);
  }
}

.login-btn {
  width: 100%;
  height: 46px;
  font-size: var(--text-md);
  font-weight: var(--font-semibold);
  letter-spacing: 2px;
  margin-top: var(--space-2);
  background: var(--color-primary);
  border-color: var(--color-primary);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.login-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(79, 110, 247, 0.35);
}

.login-hint {
  text-align: center;
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-top: var(--space-5);
}
</style>
