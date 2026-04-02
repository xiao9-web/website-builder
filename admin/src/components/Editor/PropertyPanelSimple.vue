<template>
  <div class="property-panel-simple">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="组件" name="component">
        <div v-if="!selectedComponent" class="empty-state">
          <el-empty description="请选择一个组件" />
        </div>
        <div v-else class="component-props">
          <div class="prop-header">
            <span class="component-type">{{ getComponentTypeName(selectedComponent.type) }}</span>
            <el-button size="small" type="danger" text @click="deleteComponent">删除</el-button>
          </div>

          <!-- 通用属性 -->
          <el-divider content-position="left">基础</el-divider>
          <el-form label-position="top" size="small">
            <el-form-item label="组件宽度">
              <el-select v-model="componentWidth" @change="handleWidthChange">
                <el-option label="整行 (100%)" value="100%" />
                <el-option label="半行 (50%)" value="50%" />
                <el-option label="三分之一 (33%)" value="33.33%" />
                <el-option label="四分之一 (25%)" value="25%" />
              </el-select>
            </el-form-item>
            <el-form-item label="显示">
              <el-switch v-model="selectedComponent.visible" />
            </el-form-item>
          </el-form>

          <!-- 根据组件类型显示不同的属性 -->
          <el-divider content-position="left">属性</el-divider>
          <TextEditor
            v-if="selectedComponent.type === ComponentType.TEXT"
            :component="selectedComponent"
            @update="handleComponentUpdate"
          />
          <ImageEditor
            v-else-if="selectedComponent.type === ComponentType.IMAGE"
            :component="selectedComponent"
            @update="handleComponentUpdate"
          />
          <GenericEditor
            v-else
            :component="selectedComponent"
            @update="handleComponentUpdate"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="页面" name="page">
        <el-form label-position="top" size="small" v-if="editorStore.config?.settings">
          <el-form-item label="页面标题">
            <el-input v-model="editorStore.config.settings.title" />
          </el-form-item>

          <el-divider content-position="left">背景</el-divider>

          <el-form-item label="背景样式">
            <el-radio-group v-model="backgroundType" @change="handleBackgroundTypeChange">
              <el-radio-button label="none">无</el-radio-button>
              <el-radio-button label="color">纯色</el-radio-button>
              <el-radio-button label="gradient">渐变</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="backgroundType === 'color'" label="背景颜色">
            <el-color-picker v-model="backgroundColor" @change="handleBackgroundChange" />
          </el-form-item>

          <template v-if="backgroundType === 'gradient'">
            <el-form-item label="渐变预设">
              <div class="gradient-presets">
                <div
                  v-for="preset in gradientPresets"
                  :key="preset.name"
                  class="preset-item"
                  :class="{ active: isActivePreset(preset) }"
                  :style="{ background: preset.value }"
                  @click="applyGradientPreset(preset)"
                />
              </div>
            </el-form-item>
          </template>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEditorStore } from '@/store/modules/editor';
import { ComponentType } from '@/types/components';
import TextEditor from './PropertyEditors/TextEditor.vue';
import ImageEditor from './PropertyEditors/ImageEditor.vue';
import GenericEditor from './PropertyEditors/GenericEditor.vue';

const editorStore = useEditorStore();
const activeTab = ref('component');

const selectedComponent = computed(() => editorStore.selectedComponent);
const pageSettings = computed(() => editorStore.config?.settings || {});

// 组件宽度
const componentWidth = computed({
  get: () => {
    if (!selectedComponent.value) return '100%'
    return (selectedComponent.value.style?.width as string) || '100%'
  },
  set: (value: string) => {
    if (selectedComponent.value) {
      editorStore.updateComponentProps(selectedComponent.value.id, {
        style: { ...selectedComponent.value.style, width: value }
      })
    }
  }
})

const handleWidthChange = () => {
  // 宽度变化已通过 computed setter 处理
}

// 背景设置
const backgroundType = ref<'none' | 'color' | 'gradient'>('none');
const backgroundColor = ref('#ffffff');

// 渐变预设
const gradientPresets = [
  { name: '蓝紫', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: '橙红', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: '青绿', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: '粉橙', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: '紫蓝', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { name: '深蓝', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
];

const getComponentTypeName = (type: ComponentType) => {
  const names: Record<ComponentType, string> = {
    [ComponentType.TEXT]: '文本',
    [ComponentType.IMAGE]: '图片',
    [ComponentType.BUTTON]: '按钮',
    [ComponentType.CARD]: '卡片',
    [ComponentType.CAROUSEL]: '轮播图',
    [ComponentType.NAVIGATION]: '导航',
    [ComponentType.FORM]: '表单',
    [ComponentType.HERO_BANNER]: 'Hero横幅',
    [ComponentType.SECTION_TITLE]: '分区标题',
    [ComponentType.VIDEO_BLOCK]: '视频',
    [ComponentType.ARTICLE_LIST]: '文章列表',
    [ComponentType.ARTICLE_NAV]: '文章导航',
    [ComponentType.TABLE_OF_CONTENTS]: '目录',
    [ComponentType.CONTAINER]: '容器',
    [ComponentType.ROW]: '行',
    [ComponentType.COLUMN]: '列',
  };
  return names[type] || type;
};

const deleteComponent = () => {
  if (selectedComponent.value) {
    editorStore.deleteComponent(selectedComponent.value.id);
  }
};

const handleComponentUpdate = (updates: any) => {
  if (selectedComponent.value) {
    editorStore.updateComponentProps(selectedComponent.value.id, updates);
  }
};

const handleBackgroundTypeChange = () => {
  if (backgroundType.value === 'none') {
    editorStore.updatePageSettings({ backgroundColor: undefined });
  }
};

const handleBackgroundChange = () => {
  editorStore.updatePageSettings({ backgroundColor: backgroundColor.value });
};

const isActivePreset = (preset: any) => {
  return pageSettings.value.backgroundColor === preset.value;
};

const applyGradientPreset = (preset: any) => {
  editorStore.updatePageSettings({ backgroundColor: preset.value });
};
</script>

<style scoped>
.property-panel-simple {
  width: 320px;
  height: 100%;
  background: #fff;
  border-left: 1px solid #e8e8e8;
  overflow-y: auto;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
}

.component-props {
  padding: 16px;
}

.prop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.component-type {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.gradient-presets {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.preset-item {
  height: 48px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.preset-item:hover {
  transform: scale(1.05);
}

.preset-item.active {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.no-editor {
  padding: 20px;
}
</style>