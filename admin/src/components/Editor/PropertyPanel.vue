<template>
  <div class="property-panel">
    <el-card class="panel-card">
      <template #header>
        <div class="card-header">
          <span>属性面板</span>
        </div>
      </template>

      <div v-if="!selectedComponent" class="empty-properties">
        <el-empty description="请选择一个组件进行编辑" />
      </div>

      <div v-else class="properties-content">
        <!-- 组件基础信息 -->
        <div class="property-section">
          <div class="section-title">基础信息</div>
          <el-form :model="componentProps" label-width="80px" size="small">
            <el-form-item label="组件名称">
              <el-input
                v-model="componentProps.name"
                placeholder="组件名称"
                @change="handlePropertyChange('name', componentProps.name)"
              />
            </el-form-item>
            <el-form-item label="可见性">
              <el-switch
                v-model="componentProps.visible"
                @change="handlePropertyChange('visible', componentProps.visible)"
              />
            </el-form-item>
            <el-form-item label="CSS类名">
              <el-input
                v-model="componentProps.className"
                placeholder="CSS类名"
                @change="handlePropertyChange('className', componentProps.className)"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 组件特定属性 -->
        <div v-if="componentPropertyConfig" class="property-section">
          <div class="section-title">组件属性</div>
          <el-form :model="componentProps" label-width="80px" size="small">
            <div
              v-for="(config, key) in componentPropertyConfig"
              :key="key"
            >
              <el-form-item
                :label="config.label"
                :required="config.required"
              >
                <!-- 文本输入 -->
                <el-input
                  v-if="config.type === 'text'"
                  :model-value="componentProps[key]"
                  :placeholder="config.label"
                  @update:model-value="handlePropertyChange(key, $event)"
                />

                <!-- 文本域 -->
                <el-input
                  v-else-if="config.type === 'textarea'"
                  :model-value="componentProps[key]"
                  type="textarea"
                  :rows="3"
                  :placeholder="config.label"
                  @update:model-value="handlePropertyChange(key, $event)"
                />

                <!-- 数字输入 -->
                <el-input-number
                  v-else-if="config.type === 'number'"
                  :model-value="componentProps[key]"
                  :placeholder="config.label"
                  @update:model-value="handlePropertyChange(key, $event)"
                />

                <!-- 下拉选择 -->
                <el-select
                  v-else-if="config.type === 'select'"
                  :model-value="componentProps[key]"
                  :placeholder="config.label"
                  @update:model-value="handlePropertyChange(key, $event)"
                >
                  <el-option
                    v-for="option in config.options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>

                <!-- 颜色选择器 -->
                <el-color-picker
                  v-else-if="config.type === 'color'"
                  :model-value="componentProps[key]"
                  @update:model-value="handlePropertyChange(key, $event)"
                />

                <!-- 开关 -->
                <el-switch
                  v-else-if="config.type === 'boolean'"
                  :model-value="componentProps[key]"
                  @update:model-value="handlePropertyChange(key, $event)"
                />
              </el-form-item>
            </div>
          </el-form>
        </div>

        <!-- 样式设置 -->
        <div class="property-section">
          <div class="section-title">样式设置</div>
          <el-form label-width="80px" size="small">
            <el-form-item label="背景颜色">
              <el-color-picker
                :model-value="componentProps.style?.backgroundColor"
                @update:model-value="handleStyleChange('backgroundColor', $event)"
              />
            </el-form-item>
            <el-form-item label="文字颜色">
              <el-color-picker
                :model-value="componentProps.style?.color"
                @update:model-value="handleStyleChange('color', $event)"
              />
            </el-form-item>
            <el-form-item label="内边距">
              <el-input
                :model-value="componentProps.style?.padding"
                placeholder="例如: 16px"
                @update:model-value="handleStyleChange('padding', $event)"
              />
            </el-form-item>
            <el-form-item label="外边距">
              <el-input
                :model-value="componentProps.style?.margin"
                placeholder="例如: 16px"
                @update:model-value="handleStyleChange('margin', $event)"
              />
            </el-form-item>
            <el-form-item label="圆角">
              <el-input
                :model-value="componentProps.style?.borderRadius"
                placeholder="例如: 4px"
                @update:model-value="handleStyleChange('borderRadius', $event)"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useEditorStore } from '@/store/modules/editor';
import { getComponentPropertyConfig } from './componentLibrary';
import type { Component, PropertyConfig } from '@/types/components';

const editorStore = useEditorStore();

// 计算属性
const selectedComponent = computed(() => editorStore.selectedComponent);
const componentPropertyConfig = computed(() => {
  if (!selectedComponent.value) return null;
  return getComponentPropertyConfig(selectedComponent.value.type);
});

// 组件属性的响应式对象
const componentProps = reactive<Partial<Component>>({});

// 监听选中组件变化，更新属性对象
watch(
  selectedComponent,
  (newComponent) => {
    if (newComponent) {
      Object.assign(componentProps, { ...newComponent });
    }
  },
  { immediate: true, deep: true }
);

// 处理属性变化
const handlePropertyChange = (key: string, value: any) => {
  if (!selectedComponent.value) return;

  (componentProps as any)[key] = value;
  editorStore.updateComponentProps(selectedComponent.value.id, { [key]: value });
};

// 处理样式变化
const handleStyleChange = (key: string, value: any) => {
  if (!selectedComponent.value) return;

  if (!componentProps.style) {
    componentProps.style = {};
  }

  componentProps.style[key] = value;
  editorStore.updateComponentProps(selectedComponent.value.id, {
    style: { ...componentProps.style },
  });
};
</script>

<style scoped>
.property-panel {
  width: 280px;
  height: 100%;
  overflow-y: auto;
}

.panel-card {
  height: 100%;
  border: none;
  border-radius: 0;
}

.card-header {
  font-weight: 600;
}

.empty-properties {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.properties-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.property-section {
  border-bottom: 1px solid var(--el-border-color-lighter);
  padding-bottom: 16px;
}

.property-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.section-title {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-regular);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

:deep(.el-form-item) {
  margin-bottom: 12px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}
</style>
