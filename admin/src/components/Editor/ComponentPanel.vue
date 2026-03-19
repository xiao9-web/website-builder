<template>
  <div class="component-panel">
    <el-card class="panel-card">
      <template #header>
        <div class="card-header">
          <span>组件库</span>
        </div>
      </template>

      <div class="component-list">
        <div
          v-for="component in componentLibrary.components"
          :key="component.type"
          class="component-item"
          draggable="true"
          @dragstart="onDragStart($event, component.type)"
        >
          <el-icon class="component-icon" :size="24">
            <span>{{ component.icon }}</span>
          </el-icon>
          <span class="component-name">{{ component.name }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { DragEvent } from 'vue';
import { componentLibrary } from './componentLibrary';
import type { ComponentType } from '@/types/components';

// 组件库
const emit = defineEmits<{
  dragStart: [e: DragEvent, type: ComponentType];
}>();

// 拖拽开始
const onDragStart = (e: DragEvent, type: ComponentType) => {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify({ type }));
  }
  emit('dragStart', e, type);
};
</script>

<style scoped>
.component-panel {
  width: 240px;
  height: 100%;
  border-right: 1px solid var(--el-border-color);
}

.panel-card {
  height: 100%;
  border: none;
  border-radius: 0;
}

.card-header {
  font-weight: 600;
}

.component-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.component-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  cursor: grab;
  transition: all 0.2s;
  background: var(--el-bg-color);
}

.component-item:hover {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.component-item:active {
  cursor: grabbing;
}

.component-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: 20px;
}

.component-name {
  font-size: 14px;
  color: var(--el-text-color-primary);
}
</style>
