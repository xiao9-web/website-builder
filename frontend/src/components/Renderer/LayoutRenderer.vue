<template>
  <div class="layout-renderer">
    <div
      :class="['page-container', themeClass]"
      :style="pageContainerStyle"
    >
      <!-- 页面标题 -->
      <h1 v-if="config.settings.title" class="page-title">
        {{ config.settings.title }}
      </h1>

      <!-- 页面描述 -->
      <p v-if="config.settings.description" class="page-description">
        {{ config.settings.description }}
      </p>

      <!-- 组件渲染区域 -->
      <div class="components-container">
        <ComponentRenderer
          v-for="component in config.components"
          :key="component.id"
          :component="component"
          @form-submit="handleFormSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ComponentRenderer from './ComponentRenderer.vue'
import {
  type PageLayoutConfig,
} from '@/types'

const props = defineProps<{
  config: PageLayoutConfig
}>()

const emit = defineEmits<{
  formSubmit: [data: Record<string, any>]
}>()

// 页面样式计算
const pageContainerStyle = computed(() => {
  return {
    backgroundColor: props.config.settings.backgroundColor || '#ffffff',
    color: props.config.settings.textColor || '#000000',
    fontFamily: props.config.settings.fontFamily || 'Arial, sans-serif',
    maxWidth: props.config.settings.maxWidth || '1200px',
  }
})

// 主题类
const themeClass = computed(() => {
  return 'theme-default'
})

// 处理表单提交
const handleFormSubmit = (data: Record<string, any>) => {
  emit('formSubmit', data)
}
</script>

<style scoped>
.layout-renderer {
  width: 100%;
}

.page-container {
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  box-sizing: border-box;
}

.page-title {
  margin: 0 0 16px 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-color, #333);
}

.page-description {
  margin: 0 0 32px 0;
  font-size: 16px;
  color: var(--text-color-secondary, #666);
  line-height: 1.5;
}

.components-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
