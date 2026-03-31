<template>
  <div class="property-panel">
    <el-card class="panel-card">
      <template #header>
        <div class="card-header">
          <el-tabs v-model="activeTab" class="panel-tabs">
            <el-tab-pane label="组件属性" name="component"></el-tab-pane>
            <el-tab-pane label="页面设置" name="page"></el-tab-pane>
          </el-tabs>
        </div>
      </template>

      <!-- 页面设置 -->
      <div v-if="activeTab === 'page'" class="properties-content">
        <div class="property-section">
          <div class="section-title">基础设置</div>
          <el-form :model="pageSettings" label-width="90px" size="small">
            <el-form-item label="页面标题">
              <el-input
                v-model="pageSettings.title"
                @change="handlePageSettingChange"
              />
            </el-form-item>
            <el-form-item label="页面描述">
              <el-input
                v-model="pageSettings.description"
                type="textarea"
                :rows="2"
                @change="handlePageSettingChange"
              />
            </el-form-item>
            <el-form-item label="最大宽度">
              <el-input
                v-model="pageSettings.maxWidth"
                placeholder="例如: 1200px"
                @change="handlePageSettingChange"
              />
            </el-form-item>
          </el-form>
        </div>

        <div class="property-section">
          <div class="section-title">背景设置</div>
          <el-form :model="pageSettings" label-width="90px" size="small">
            <el-form-item label="启用渐变">
              <el-switch
                v-model="gradientEnabled"
                @change="handleGradientToggle"
              />
            </el-form-item>

            <template v-if="gradientEnabled">
              <el-form-item label="渐变颜色">
                <div class="gradient-colors">
                  <div
                    v-for="(color, index) in gradientColors"
                    :key="index"
                    class="color-item"
                  >
                    <el-color-picker
                      v-model="gradientColors[index]"
                      @change="handleGradientChange"
                    />
                    <el-button
                      v-if="gradientColors.length > 2"
                      size="small"
                      :icon="Delete"
                      circle
                      @click="removeGradientColor(index)"
                    />
                  </div>
                  <el-button
                    v-if="gradientColors.length < 6"
                    size="small"
                    :icon="Plus"
                    @click="addGradientColor"
                  >
                    添加颜色
                  </el-button>
                </div>
              </el-form-item>

              <el-form-item label="渐变方向">
                <el-select
                  v-model="gradientDirection"
                  @change="handleGradientChange"
                >
                  <el-option label="左上到右下" value="135deg" />
                  <el-option label="左到右" value="to right" />
                  <el-option label="上到下" value="to bottom" />
                  <el-option label="右上到左下" value="45deg" />
                </el-select>
              </el-form-item>

              <el-form-item label="动画效果">
                <el-switch
                  v-model="gradientAnimated"
                  @change="handleGradientChange"
                />
              </el-form-item>
            </template>

            <template v-else>
              <el-form-item label="背景颜色">
                <el-color-picker
                  v-model="pageSettings.backgroundColor"
                  @change="handlePageSettingChange"
                />
              </el-form-item>
            </template>
          </el-form>
        </div>
      </div>

      <!-- 组件属性 -->
      <div v-else-if="activeTab === 'component'">
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
                <!-- 文本输入 - 图片/视频URL支持附件选择 -->
                <div v-if="config.type === 'text'" class="input-with-picker">
                  <el-input
                    :model-value="componentProps[key]"
                    :placeholder="config.label"
                    @update:model-value="handlePropertyChange(key, $event)"
                  />
                  <el-button
                    v-if="isMediaProperty(key)"
                    size="small"
                    @click="openAttachmentPicker(key)"
                  >
                    选择
                  </el-button>
                </div>

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
      </div>
    </el-card>

    <!-- 附件选择器 -->
    <AttachmentPicker
      v-model="showAttachmentPicker"
      :type="attachmentPickerType"
      @select="handleAttachmentSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue';
import { Plus, Delete } from '@element-plus/icons-vue';
import { useEditorStore } from '@/store/modules/editor';
import { getComponentPropertyConfig } from './componentLibrary';
import type { Component, PropertyConfig } from '@/types/components';
import AttachmentPicker from '@/components/AttachmentPicker.vue';
import type { Attachment } from '@/api/attachment';

const editorStore = useEditorStore();

// 当前激活的标签页
const activeTab = ref('component');

// 附件选择器
const showAttachmentPicker = ref(false);
const attachmentPickerType = ref<'image' | 'video' | ''>('');
const currentPickerProperty = ref<string>('');

// 计算属性
const selectedComponent = computed(() => editorStore.selectedComponent);
const componentPropertyConfig = computed(() => {
  if (!selectedComponent.value) return null;
  return getComponentPropertyConfig(selectedComponent.value.type);
});

// 组件属性的响应式对象
const componentProps = reactive<Partial<Component>>({});

// 页面设置
const pageSettings = reactive({
  title: '',
  description: '',
  backgroundColor: '#ffffff',
  maxWidth: '1200px',
});

// 渐变设置
const gradientEnabled = ref(false);
const gradientColors = ref(['#667eea', '#764ba2', '#f093fb', '#4facfe']);
const gradientDirection = ref('135deg');
const gradientAnimated = ref(true);

// 初始化页面设置
watch(
  () => editorStore.config,
  (config) => {
    if (config?.settings) {
      pageSettings.title = config.settings.title || '';
      pageSettings.description = config.settings.description || '';
      pageSettings.backgroundColor = config.settings.backgroundColor || '#ffffff';
      pageSettings.maxWidth = config.settings.maxWidth || '1200px';

      // 初始化渐变设置
      if (config.settings.backgroundGradient) {
        gradientEnabled.value = config.settings.backgroundGradient.enabled || false;
        gradientColors.value = config.settings.backgroundGradient.colors || ['#667eea', '#764ba2'];
        gradientDirection.value = config.settings.backgroundGradient.direction || '135deg';
        gradientAnimated.value = config.settings.backgroundGradient.animated !== false;
      }
    }
  },
  { immediate: true, deep: true }
);

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

// 处理页面设置变化
const handlePageSettingChange = () => {
  editorStore.updatePageSettings({
    ...pageSettings,
    backgroundGradient: gradientEnabled.value
      ? {
          enabled: true,
          colors: gradientColors.value,
          direction: gradientDirection.value,
          animated: gradientAnimated.value,
        }
      : { enabled: false, colors: [] },
  });
};

// 处理渐变开关
const handleGradientToggle = () => {
  handlePageSettingChange();
};

// 处理渐变变化
const handleGradientChange = () => {
  handlePageSettingChange();
};

// 添加渐变颜色
const addGradientColor = () => {
  gradientColors.value.push('#ffffff');
  handleGradientChange();
};

// 删除渐变颜色
const removeGradientColor = (index: number) => {
  gradientColors.value.splice(index, 1);
  handleGradientChange();
};

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

// 判断是否为媒体属性（图片、视频等）
const isMediaProperty = (key: string) => {
  const mediaProperties = ['src', 'backgroundImage', 'headerImage', 'videoUrl', 'posterUrl'];
  return mediaProperties.includes(key);
};

// 打开附件选择器
const openAttachmentPicker = (propertyKey: string) => {
  currentPickerProperty.value = propertyKey;

  // 根据属性名判断类型
  if (propertyKey.includes('video') || propertyKey.includes('Video')) {
    attachmentPickerType.value = 'video';
  } else {
    attachmentPickerType.value = 'image';
  }

  showAttachmentPicker.value = true;
};

// 处理附件选择
const handleAttachmentSelect = (attachment: Attachment) => {
  if (!currentPickerProperty.value) return;

  const url = import.meta.env.VITE_API_BASE_URL + attachment.url;
  handlePropertyChange(currentPickerProperty.value, url);
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
  padding: 0;
}

.panel-tabs {
  margin: -8px -12px;
}

.panel-tabs :deep(.el-tabs__header) {
  margin: 0;
}

.panel-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
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

.gradient-colors {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-form-item) {
  margin-bottom: 12px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

.input-with-picker {
  display: flex;
  gap: 8px;

  .el-input {
    flex: 1;
  }

  .el-button {
    flex-shrink: 0;
  }
}
</style>
