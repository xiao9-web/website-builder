<template>
  <div class="visual-editor">
    <!-- 编辑器头部 -->
    <div class="editor-header">
      <div class="header-left">
        <el-button :icon="ArrowLeft" @click="handleBack">返回</el-button>
        <h2 class="editor-title">{{ pageTitle || '新页面' }}</h2>
      </div>
      <div class="header-center">
        <el-button-group>
          <el-button
            :icon="View"
            :type="viewMode === 'edit' ? 'primary' : 'default'"
            @click="viewMode = 'edit'"
          >
            编辑
          </el-button>
          <el-button
            :icon="Monitor"
            :type="viewMode === 'preview' ? 'primary' : 'default'"
            @click="viewMode = 'preview'"
          >
            预览
          </el-button>
        </el-button-group>
      </div>
      <div class="header-right">
        <el-button :icon="Download" @click="handleExport">导出</el-button>
        <el-button :icon="Upload" @click="handleImport">导入</el-button>
        <el-button :icon="DocumentCopy" @click="handleSaveDraft">保存草稿</el-button>
        <el-button type="primary" :icon="Check" @click="handlePublish">发布</el-button>
      </div>
    </div>

    <!-- 编辑器主体 -->
    <div class="editor-body">
      <template v-if="viewMode === 'edit'">
        <!-- 组件面板 -->
        <ComponentPanel @drag-start="handleDragStart" />

        <!-- 编辑画布 -->
        <EditorCanvas />

        <!-- 属性面板 -->
        <PropertyPanel />
      </template>

      <template v-else>
        <!-- 预览模式 -->
        <div class="preview-container">
          <div class="preview-toolbar">
            <el-button-group>
              <el-button
                :icon="Iphone"
                :type="deviceType === 'mobile' ? 'primary' : 'default'"
                @click="deviceType = 'mobile'"
              >
                移动端
              </el-button>
              <el-button
                :icon="Monitor"
                :type="deviceType === 'tablet' ? 'primary' : 'default'"
                @click="deviceType = 'tablet'"
              >
                平板
              </el-button>
              <el-button
                :icon="Monitor"
                :type="deviceType === 'desktop' ? 'primary' : 'default'"
                @click="deviceType = 'desktop'"
              >
                桌面
              </el-button>
            </el-button-group>
          </div>
          <div class="preview-frame" :class="`preview-${deviceType}`">
            <div class="preview-content">
              <!-- 这里会放置预览渲染器 -->
              <div class="preview-placeholder">
                <el-empty description="预览功能开发中..." />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ArrowLeft,
  View,
  Monitor,
  Download,
  Upload,
  DocumentCopy,
  Check,
  Iphone,
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useEditorStore } from '@/store/modules/editor';
import ComponentPanel from './ComponentPanel.vue';
import EditorCanvas from './EditorCanvas.vue';
import PropertyPanel from './PropertyPanel.vue';
import type { ComponentType, PageLayoutConfig } from '@/types/components';
import type { DragEvent } from 'vue';

const router = useRouter();
const route = useRoute();
const editorStore = useEditorStore();

// Props
defineProps<{
  pageId?: string;
}>();

// Emits
const emit = defineEmits<{
  save: [config: PageLayoutConfig];
  publish: [config: PageLayoutConfig];
}>();

// 状态
const viewMode = ref<'edit' | 'preview'>('edit');
const deviceType = ref<'mobile' | 'tablet' | 'desktop'>('desktop');
const pageTitle = ref('');

// 计算属性
const hasChanges = computed(() => editorStore.hasChanges);

// 初始化
onMounted(() => {
  const pageId = route.query.id as string;
  if (pageId) {
    // TODO: 从API加载页面配置
    pageTitle.value = '编辑页面';
  } else {
    editorStore.initializeConfig();
    pageTitle.value = '新页面';
  }
});

// 返回
const handleBack = () => {
  if (hasChanges.value) {
    ElMessageBox.confirm('您有未保存的更改，确定要离开吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        router.back();
      })
      .catch(() => {
        // 用户取消，什么也不做
      });
  } else {
    router.back();
  }
};

// 拖拽开始
const handleDragStart = (e: DragEvent, type: ComponentType) => {
  // 可以在这里添加拖拽开始时的额外逻辑
};

// 导出配置
const handleExport = () => {
  const config = editorStore.exportConfig();
  if (config) {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.settings.title || 'page'}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    ElMessage.success('导出成功');
  }
};

// 导入配置
const handleImport = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const config = JSON.parse(event.target?.result as string);
          editorStore.importConfig(config);
          pageTitle.value = config.settings.title || '导入的页面';
          ElMessage.success('导入成功');
        } catch (error) {
          ElMessage.error('导入失败，文件格式错误');
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
};

// 保存草稿
const handleSaveDraft = () => {
  const config = editorStore.exportConfig();
  if (config) {
    emit('save', config);
    editorStore.markAsSaved();
    ElMessage.success('保存成功');
  }
};

// 发布
const handlePublish = async () => {
  try {
    await ElMessageBox.confirm('确定要发布此页面吗？', '确认发布', {
      confirmButtonText: '发布',
      cancelButtonText: '取消',
      type: 'warning',
    });

    const config = editorStore.exportConfig();
    if (config) {
      emit('publish', config);
      editorStore.markAsSaved();
      ElMessage.success('发布成功');
    }
  } catch {
    // 用户取消
  }
};
</script>

<style scoped>
.visual-editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--el-bg-color-page);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.editor-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.header-center {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.editor-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 预览模式 */
.preview-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color-page);
}

.preview-toolbar {
  display: flex;
  justify-content: center;
  padding: 16px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
}

.preview-frame {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  overflow: auto;
  background: #1a1a1a;
}

.preview-content {
  background: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.preview-desktop .preview-content {
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
}

.preview-tablet .preview-content {
  width: 768px;
  min-height: 800px;
}

.preview-mobile .preview-content {
  width: 375px;
  min-height: 667px;
}

.preview-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
}
</style>
