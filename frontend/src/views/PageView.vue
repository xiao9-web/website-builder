<template>
  <div class="page-view" :style="pageStyle">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="page" class="page-content" :style="contentStyle">
      <div class="page-body">
        <!-- 使用 ComponentRenderer 渲染页面组件 -->
        <ComponentRenderer
          v-for="component in page.layout_config?.components"
          :key="component.id"
          :component="component"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getPageApi } from '../api/page'
import ComponentRenderer from '../components/Renderer/ComponentRenderer.vue'

const route = useRoute()
const loading = ref(true)
const error = ref('')
const page = ref<any>(null)

const pageStyle = computed(() => {
  if (!page.value?.layout_config?.settings) return {}

  const settings = page.value.layout_config.settings
  const style: any = {
    minHeight: '100vh',
  }

  // 渐变背景优先
  if (settings.backgroundGradient?.enabled && settings.backgroundGradient.colors?.length > 0) {
    const colors = settings.backgroundGradient.colors.join(', ')
    const direction = settings.backgroundGradient.direction || '135deg'
    style.background = `linear-gradient(${direction}, ${colors})`

    // 动画效果
    if (settings.backgroundGradient.animated) {
      style.backgroundSize = '400% 400%'
      style.animation = 'gradientShift 15s ease infinite'
    }
  } else if (settings.backgroundColor) {
    style.backgroundColor = settings.backgroundColor
  }

  return style
})

const contentStyle = computed(() => {
  if (!page.value?.layout_config?.settings) return {}

  const settings = page.value.layout_config.settings
  return {
    maxWidth: settings.maxWidth || '1200px',
    margin: '0 auto',
    color: settings.textColor,
    fontFamily: settings.fontFamily,
  }
})

onMounted(async () => {
  try {
    const pageId = parseInt(route.params.id as string)
    page.value = await getPageApi(pageId)
  } catch (err: any) {
    error.value = err.message || '加载页面失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-view {
  padding: 0;
  margin: 0;
  width: 100%;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.page-content {
  padding: 40px 20px;
}

.loading,
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #ffffff;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.page-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
