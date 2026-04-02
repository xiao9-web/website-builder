<template>
  <div class="component-library">
    <div class="library-header">
      <h3>组件库</h3>
    </div>
    <div class="component-list">
      <div
        v-for="item in componentItems"
        :key="item.type"
        class="component-item"
        draggable="true"
        @dragstart="handleDragStart($event, item.type)"
        @click="handleAddComponent(item.type)"
      >
        <div class="component-icon">{{ item.icon }}</div>
        <div class="component-name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ComponentType } from '@/types/components'
import { componentLibrary } from './componentLibrary'

const emit = defineEmits<{
  addComponent: [type: ComponentType]
}>()

// 从 componentLibrary 中获取所有组件
const componentItems = computed(() => {
  return componentLibrary.components.map(comp => ({
    type: comp.type,
    name: comp.name,
    icon: comp.icon,
    description: comp.description
  }))
})

const handleDragStart = (event: DragEvent, type: ComponentType) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('componentType', type)
  }
}

const handleAddComponent = (type: ComponentType) => {
  emit('addComponent', type)
}
</script>

<style scoped>
.component-library {
  width: 240px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}

.library-header {
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.library-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.component-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.component-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  background: #f5f7fa;
  border-radius: 6px;
  cursor: move;
  transition: all 0.2s;
  user-select: none;
}

.component-item:hover {
  background: #e4e7ed;
  transform: translateX(4px);
}

.component-item:active {
  transform: scale(0.98);
}

.component-icon {
  font-size: 24px;
}

.component-name {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}
</style>
