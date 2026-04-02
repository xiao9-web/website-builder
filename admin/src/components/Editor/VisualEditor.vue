<template>
  <div class="visual-editor">
    <!-- 顶部工具栏 -->
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <el-button size="small" @click="handleBack">← 返回</el-button>
        <span class="page-title">{{ pageTitle }}</span>
      </div>
      <div class="toolbar-right">
        <el-button size="small" @click="showTemplates = true">📋 模板</el-button>
        <el-button size="small" @click="handleUndo" :disabled="!editorStore.canUndo">撤销</el-button>
        <el-button size="small" @click="handleRedo" :disabled="!editorStore.canRedo">重做</el-button>
        <el-button size="small" @click="handleSave">保存</el-button>
        <el-button size="small" type="primary" @click="handlePublish">发布</el-button>
      </div>
    </div>

    <!-- 主编辑区域 -->
    <div class="editor-main">
      <!-- 左侧组件库 -->
      <ComponentLibrary @add-component="handleAddComponent" />

      <!-- 中间预览区 -->
      <div class="preview-area">
        <div
          class="preview-content"
          @drop="handleDrop"
          @dragover.prevent
        >
          <div v-if="!editorStore.config || editorStore.config.components.length === 0" class="empty-canvas">
            <el-empty description="从左侧拖拽或点击组件开始创建页面" />
          </div>
          <div
            v-for="(component, index) in editorStore.config?.components"
            :key="component.id"
            class="component-wrapper"
            :class="{ selected: editorStore.selectedComponentId === component.id }"
            :style="{ width: component.style?.width || '100%' }"
            @click.stop="handleSelectComponent(component.id)"
          >
            <ComponentRenderer :component="component" />
            <div class="component-actions">
              <el-button size="small" text @click.stop="handleMoveUp(index)">↑</el-button>
              <el-button size="small" text @click.stop="handleMoveDown(index)">↓</el-button>
              <el-button size="small" text type="danger" @click.stop="handleDelete(component.id)">删除</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧属性面板 -->
      <PropertyPanelSimple />
    </div>

    <!-- 模板选择对话框 -->
    <PageTemplates v-model:visible="showTemplates" @select="handleSelectTemplate" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useEditorStore } from '@/store/modules/editor'
import { ComponentType, type PageLayoutConfig } from '@/types/components'
import ComponentLibrary from './ComponentLibrary.vue'
import ComponentRenderer from '../Renderer/ComponentRenderer.vue'
import PropertyPanelSimple from './PropertyPanelSimple.vue'
import PageTemplates from './PageTemplates.vue'

const props = defineProps<{
  initialConfig?: PageLayoutConfig | null
}>()

const emit = defineEmits<{
  save: [config: PageLayoutConfig]
  publish: [config: PageLayoutConfig]
}>()

const router = useRouter()
const editorStore = useEditorStore()
const showTemplates = ref(false)

const pageTitle = computed(() => editorStore.config?.settings?.title || '新页面')

// 初始化编辑器
onMounted(() => {
  if (props.initialConfig) {
    editorStore.importConfig(props.initialConfig)
  } else {
    editorStore.initializeConfig()
  }
})

// 监听初始配置变化
watch(() => props.initialConfig, (newConfig) => {
  if (newConfig) {
    editorStore.importConfig(newConfig)
  }
})

const handleBack = () => {
  router.back()
}

const handleUndo = () => {
  editorStore.undo()
}

const handleRedo = () => {
  editorStore.redo()
}

const handleSave = () => {
  const config = editorStore.exportConfig()
  if (config) {
    emit('save', config)
  }
}

const handlePublish = () => {
  const config = editorStore.exportConfig()
  if (config) {
    emit('publish', config)
  }
}

const handleAddComponent = (type: ComponentType) => {
  editorStore.addComponent(type)
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const componentType = event.dataTransfer?.getData('componentType')
  if (componentType) {
    editorStore.addComponent(componentType)
  }
}

const handleSelectComponent = (id: string) => {
  editorStore.selectComponent(id)
}

const handleMoveUp = (index: number) => {
  if (index > 0) {
    editorStore.moveComponent(index, index - 1)
  }
}

const handleMoveDown = (index: number) => {
  const components = editorStore.config?.components || []
  if (index < components.length - 1) {
    editorStore.moveComponent(index, index + 1)
  }
}

const handleDelete = (id: string) => {
  editorStore.deleteComponent(id)
}

const handleSelectTemplate = (config: PageLayoutConfig) => {
  editorStore.importConfig(config)
}
</script>

<style scoped>
.visual-editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f7fa;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.editor-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.preview-area {
  flex: 1;
  overflow-y: auto;
  background: #f5f7fa;
  padding: 20px;
}

.preview-content {
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
  min-height: 600px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-content: flex-start;
}

.empty-canvas {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.component-wrapper {
  position: relative;
  margin-bottom: 0;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 6px;
  transition: all 0.2s;
  cursor: pointer;
  flex: 0 0 auto;
  box-sizing: border-box;
}

.component-wrapper:hover {
  border-color: #e4e7ed;
  background: #fafafa;
}

.component-wrapper.selected {
  border-color: #409eff;
  background: #ecf5ff;
}

.component-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: none;
  gap: 4px;
  background: rgba(255, 255, 255, 0.95);
  padding: 4px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.component-wrapper:hover .component-actions,
.component-wrapper.selected .component-actions {
  display: flex;
}
</style>
