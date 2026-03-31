<template>
  <div class="editor-canvas">
    <div class="canvas-header">
      <div class="canvas-title">编辑区域</div>
      <div class="canvas-actions">
        <el-button-group>
          <el-button size="small" @click="addLayout('single')">单列</el-button>
          <el-button size="small" @click="addLayout('two-column')">两列</el-button>
          <el-button size="small" @click="addLayout('three-column')">三列</el-button>
          <el-button size="small" @click="addLayout('sidebar-left')">左侧边栏</el-button>
          <el-button size="small" @click="addLayout('sidebar-right')">右侧边栏</el-button>
        </el-button-group>
        <el-divider direction="vertical" />
        <el-button
          :icon="RefreshLeft"
          :disabled="!canUndo"
          @click="handleUndo"
        >
          撤销
        </el-button>
        <el-button
          :icon="RefreshRight"
          :disabled="!canRedo"
          @click="handleRedo"
        >
          重做
        </el-button>
        <el-button
          :icon="Delete"
          :disabled="!selectedComponentId"
          type="danger"
          @click="handleDeleteComponent"
        >
          删除
        </el-button>
      </div>
    </div>

    <div
      ref="canvasContainer"
      class="canvas-container"
      :style="canvasStyle"
      @dragenter.prevent="onDragEnter"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <div
        v-if="components.length === 0"
        class="empty-canvas"
      >
        <el-empty description="从左侧拖拽组件到这里开始编辑" />
      </div>

      <div
        v-else
        ref="sortableContainer"
        class="components-container"
      >
        <ComponentWrapper
          v-for="(component, index) in components"
          :key="component.id"
          :component="component"
          :index="index"
          :selected="component.id === selectedComponentId"
          @select="handleSelectComponent"
          @move="handleMoveComponent"
          @delete="handleDeleteComponent"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { RefreshLeft, RefreshRight, Delete } from '@element-plus/icons-vue';
import { useEditorStore } from '@/store/modules/editor';
import ComponentWrapper from './ComponentWrapper.vue';
import Sortable from 'sortablejs';
import type { DragEvent } from 'vue';
import type { Component } from '@/types/components';
import { ComponentType } from '@/types/components';
import { getComponentDefaultProps } from './componentLibrary';

const editorStore = useEditorStore();

// 引用
const canvasContainer = ref<HTMLElement | null>(null);
const sortableContainer = ref<HTMLElement | null>(null);
let sortable: Sortable | null = null;

// 计算属性
const components = computed(() => editorStore.components);
const selectedComponentId = computed(() => editorStore.selectedComponentId);
const canUndo = computed(() => editorStore.canUndo);
const canRedo = computed(() => editorStore.canRedo);

// 画布样式（应用渐变背景）
const canvasStyle = computed(() => {
  const settings = editorStore.config?.settings;
  if (!settings) return {};

  const style: any = {};

  // 渐变背景优先
  if (settings.backgroundGradient?.enabled && settings.backgroundGradient.colors?.length > 0) {
    const colors = settings.backgroundGradient.colors.join(', ');
    const direction = settings.backgroundGradient.direction || '135deg';
    style.background = `linear-gradient(${direction}, ${colors})`;

    // 动画效果
    if (settings.backgroundGradient.animated) {
      style.backgroundSize = '400% 400%';
      style.animation = 'gradientShift 15s ease infinite';
    }
  } else if (settings.backgroundColor) {
    style.backgroundColor = settings.backgroundColor;
  }

  return style;
});

// 初始化编辑器
onMounted(() => {
  if (!editorStore.config) {
    editorStore.initializeConfig();
  }
  initializeSortable();
});

// 初始化Sortable
const initializeSortable = async () => {
  await nextTick();
  if (sortableContainer.value && !sortable) {
    sortable = new Sortable(sortableContainer.value, {
      animation: 150,
      handle: '.component-handle',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt;
        if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
          editorStore.moveComponent(oldIndex, newIndex);
        }
      },
    });
  }
};

// 监听组件变化，重新初始化Sortable
watch(components, async () => {
  if (sortable) {
    sortable.destroy();
    sortable = null;
  }
  await nextTick();
  initializeSortable();
});

// 拖拽进入
const onDragEnter = (e: DragEvent) => {
  if (canvasContainer.value) {
    canvasContainer.value.classList.add('drag-over');
  }
};

// 拖拽中
const onDragOver = (e: DragEvent) => {
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'copy';
  }
};

// 拖拽离开
const onDragLeave = (e: DragEvent) => {
  if (canvasContainer.value) {
    const rect = canvasContainer.value.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (
      x < rect.left ||
      x > rect.right ||
      y < rect.top ||
      y > rect.bottom
    ) {
      canvasContainer.value.classList.remove('drag-over');
    }
  }
};

// 拖拽放置
const onDrop = (e: DragEvent) => {
  if (canvasContainer.value) {
    canvasContainer.value.classList.remove('drag-over');
  }

  if (e.dataTransfer) {
    const data = e.dataTransfer.getData('application/json');
    if (data) {
      try {
        const { type } = JSON.parse(data);
        editorStore.addComponent(type);
      } catch (error) {
        console.error('Failed to parse drag data:', error);
      }
    }
  }
};

// 撤销
const handleUndo = () => {
  editorStore.undo();
};

// 重做
const handleRedo = () => {
  editorStore.redo();
};

// 选择组件
const handleSelectComponent = (component: Component) => {
  editorStore.selectComponent(component.id);
};

// 移动组件
const handleMoveComponent = (fromIndex: number, toIndex: number) => {
  editorStore.moveComponent(fromIndex, toIndex);
};

// 删除组件
const handleDeleteComponent = (componentId?: string) => {
  editorStore.deleteComponent(componentId);
};

// 添加布局
const addLayout = (layoutType: string) => {
  let rowComponent: any;

  switch (layoutType) {
    case 'single':
      // 单列：不需要行容器，直接拖组件即可
      return;
    case 'two-column':
      // 两列：50% + 50%
      rowComponent = getComponentDefaultProps(ComponentType.ROW);
      rowComponent.children = [
        { ...getComponentDefaultProps(ComponentType.COLUMN), flex: '1' },
        { ...getComponentDefaultProps(ComponentType.COLUMN), flex: '1' }
      ];
      break;
    case 'three-column':
      // 三列：33% + 33% + 33%
      rowComponent = getComponentDefaultProps(ComponentType.ROW);
      rowComponent.children = [
        { ...getComponentDefaultProps(ComponentType.COLUMN), flex: '1' },
        { ...getComponentDefaultProps(ComponentType.COLUMN), flex: '1' },
        { ...getComponentDefaultProps(ComponentType.COLUMN), flex: '1' }
      ];
      break;
    case 'sidebar-left':
      // 左侧边栏：250px + 自适应
      rowComponent = getComponentDefaultProps(ComponentType.ROW);
      rowComponent.children = [
        { ...getComponentDefaultProps(ComponentType.COLUMN), width: '250px', flex: '0' },
        { ...getComponentDefaultProps(ComponentType.COLUMN), flex: '1' }
      ];
      break;
    case 'sidebar-right':
      // 右侧边栏：自适应 + 250px
      rowComponent = getComponentDefaultProps(ComponentType.ROW);
      rowComponent.children = [
        { ...getComponentDefaultProps(ComponentType.COLUMN), flex: '1' },
        { ...getComponentDefaultProps(ComponentType.COLUMN), width: '250px', flex: '0' }
      ];
      break;
  }

  if (rowComponent) {
    editorStore.components.push(rowComponent);
  }
};

</script>

<style scoped>
.editor-canvas {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid var(--el-border-color);
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color);
  background: var(--el-bg-color-page);
}

.canvas-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.canvas-actions {
  display: flex;
  gap: 8px;
}

.canvas-container {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  transition: background 0.3s;
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

.canvas-container.drag-over {
  background: #ecf5ff;
  border: 2px dashed var(--el-color-primary);
}

.empty-canvas {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
}

.components-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sortable-ghost {
  opacity: 0.4;
  background: #c8ebfb;
}

.sortable-chosen {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.sortable-drag {
  opacity: 0.8;
}
</style>
