<template>
  <div
    class="component-wrapper"
    :class="{
      'component-selected': selected,
    }"
    @click.stop="handleClick"
  >
    <div class="component-header">
      <div class="component-handle">
        <el-icon><Rank /></el-icon>
      </div>
      <span class="component-name">{{ component.name || getComponentName(component.type) }}</span>
      <div class="component-actions">
        <el-button
          link
          :icon="Delete"
          type="danger"
          @click.stop="handleDelete"
        />
      </div>
    </div>

    <div class="component-content">
      <div class="component-preview">
        <!-- 根据组件类型渲染不同的预览 -->
        <div v-if="component.type === ComponentType.TEXT" class="text-preview">
          <div
            :style="{
              fontSize: (component as any).fontSize,
              fontWeight: (component as any).fontWeight,
              color: (component as any).color,
              lineHeight: (component as any).lineHeight,
              textAlign: (component as any).textAlign,
            }"
          >
            {{ (component as any).content || '文本内容' }}
          </div>
        </div>

        <div v-else-if="component.type === ComponentType.IMAGE" class="image-preview">
          <div v-if="(component as any).src" class="preview-image">
            <img :src="(component as any).src" :alt="(component as any).alt" />
          </div>
          <el-empty v-else description="图片组件" :image-size="40" />
        </div>

        <div v-else-if="component.type === ComponentType.BUTTON" class="button-preview">
          <el-button
            :type="(component as any).btnType"
            :size="(component as any).size"
          >
            {{ (component as any).text || '按钮文字' }}
          </el-button>
        </div>

        <div v-else-if="component.type === ComponentType.CARD" class="card-preview">
          <el-card :shadow="(component as any).shadow">
            <template #header>
              <div v-if="(component as any).headerImage" class="card-header-image">
                <img :src="(component as any).headerImage" />
              </div>
              <div v-else>
                {{ (component as any).title || '卡片标题' }}
              </div>
            </template>
            <div>{{ (component as any).content || '卡片内容' }}</div>
            <template #footer v-if="(component as any).footer">
              <div>{{ (component as any).footer }}</div>
            </template>
          </el-card>
        </div>

        <div v-else-if="component.type === ComponentType.CAROUSEL" class="carousel-preview">
          <div class="carousel-placeholder">
            <el-icon :size="40"><PictureFilled /></el-icon>
            <div class="carousel-label">轮播图组件</div>
            <div class="carousel-count">{{ (component as any).images?.length || 0 }} 张图片</div>
          </div>
        </div>

        <div v-else-if="component.type === ComponentType.NAVIGATION" class="navigation-preview">
          <div class="navigation-placeholder">
            <el-icon :size="40"><Menu /></el-icon>
            <div class="navigation-label">导航组件</div>
            <div class="navigation-count">{{ (component as any).menuItems?.length || 0 }} 个菜单项</div>
          </div>
        </div>

        <div v-else-if="component.type === ComponentType.FORM" class="form-preview">
          <div class="form-placeholder">
            <el-icon :size="40"><Edit /></el-icon>
            <div class="form-label">表单组件</div>
            <div class="form-count">{{ (component as any).fields?.length || 0 }} 个字段</div>
          </div>
        </div>

        <!-- Hero Banner 预览 -->
        <div v-else-if="component.type === ComponentType.HERO_BANNER" class="hero-preview">
          <div class="hero-placeholder" :style="{ background: (component as any).slides?.[0]?.backgroundColor || '#1a1a2e' }">
            <div class="hero-text">
              <div class="hero-title">{{ (component as any).slides?.[0]?.title || 'Hero 大图' }}</div>
              <div class="hero-subtitle">{{ (component as any).slides?.[0]?.subtitle || '副标题' }}</div>
            </div>
            <div class="hero-meta">{{ (component as any).slides?.length || 1 }} 张轮播图 · {{ (component as any).height || '60vh' }}</div>
          </div>
        </div>

        <!-- 分区标题预览 -->
        <div v-else-if="component.type === ComponentType.SECTION_TITLE" class="section-title-preview">
          <div :style="{ textAlign: (component as any).align || 'center', padding: '8px 0' }">
            <div class="st-title" :style="{ color: (component as any).titleColor || '#1a1a2e' }">
              {{ (component as any).title || '分区标题' }}
            </div>
            <div v-if="(component as any).divider" class="st-divider" />
            <div v-if="(component as any).subtitle" class="st-subtitle" :style="{ color: (component as any).subtitleColor || '#666' }">
              {{ (component as any).subtitle }}
            </div>
          </div>
        </div>

        <!-- 视频组件预览 -->
        <div v-else-if="component.type === ComponentType.VIDEO_BLOCK" class="video-preview">
          <div class="video-placeholder">
            <el-icon :size="40"><VideoPlay /></el-icon>
            <div class="video-label">视频组件</div>
            <div class="video-meta">
              {{ (component as any).videoType === 'local' ? '本地视频' : '第三方嵌入' }}
              · {{ (component as any).aspectRatio || '16:9' }}
            </div>
          </div>
        </div>

        <!-- 文章列表预览 -->
        <div v-else-if="component.type === ComponentType.ARTICLE_LIST" class="article-list-preview">
          <div class="al-placeholder">
            <el-icon :size="40"><Document /></el-icon>
            <div class="al-label">文章列表</div>
            <div class="al-meta">
              {{ layoutLabel((component as any).layout) }} · {{ (component as any).columns || 3 }}列 · 每页{{ (component as any).pageSize || 9 }}篇
            </div>
          </div>
        </div>

        <!-- 文章导航预览 -->
        <div v-else-if="component.type === ComponentType.ARTICLE_NAV" class="article-nav-preview">
          <div class="an-placeholder">
            <el-icon :size="40"><Menu /></el-icon>
            <div class="an-label">文章导航</div>
            <div class="an-meta">{{ (component as any).navStyle === 'sidebar' ? '侧边栏' : '标签页' }} 样式</div>
          </div>
        </div>

        <!-- 目录组件预览 -->
        <div v-else-if="component.type === ComponentType.TABLE_OF_CONTENTS" class="toc-preview">
          <div class="toc-placeholder">
            <el-icon :size="40"><List /></el-icon>
            <div class="toc-label">{{ (component as any).title || '目录' }}</div>
            <div class="toc-meta">H2{{ (component as any).maxDepth === 3 ? '+H3' : '' }} · {{ (component as any).position === 'right-sticky' ? '右侧悬浮' : '顶部内嵌' }}</div>
          </div>
        </div>

        <!-- 行容器预览 -->
        <div v-else-if="component.type === ComponentType.ROW" class="row-preview">
          <div class="row-container">
            <div class="row-header">
              <el-icon><Grid /></el-icon>
              <span>行容器 ({{ (component as any).children?.length || 0 }} 列)</span>
            </div>
            <div class="row-drop-zone" :style="{ gap: (component as any).gap || '20px' }">
              <div
                v-for="(child, idx) in (component as any).children || []"
                :key="child.id"
                class="column-item"
              >
                <ComponentWrapper
                  :component="child"
                  :index="idx"
                  :selected="false"
                  @select="$emit('select', child)"
                />
              </div>
              <div class="add-column-btn" @click.stop="handleAddColumn">
                <el-icon><Plus /></el-icon>
                <span>添加列</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 列容器预览 -->
        <div v-else-if="component.type === ComponentType.COLUMN" class="column-preview">
          <div class="column-container">
            <div class="column-header">
              <span>列 (宽度: {{ (component as any).width || 'auto' }})</span>
            </div>
            <div class="column-content">
              <div
                v-for="(child, idx) in (component as any).children || []"
                :key="child.id"
              >
                <ComponentWrapper
                  :component="child"
                  :index="idx"
                  :selected="false"
                  @select="$emit('select', child)"
                />
              </div>
              <div v-if="!(component as any).children?.length" class="empty-column">
                拖拽组件到这里
              </div>
            </div>
          </div>
        </div>

        <div v-else class="default-preview">
          <el-empty description="组件预览" :image-size="40" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Rank, Delete, PictureFilled, Menu, Edit, VideoPlay, Document, List, Grid, Plus } from '@element-plus/icons-vue';
import { ComponentType } from '@/types/components';
import { getComponentName, getComponentDefaultProps } from '@/components/Editor/componentLibrary';
import type { Component } from '@/types/components';
import { useEditorStore } from '@/store/modules/editor';

const editorStore = useEditorStore();

const layoutLabel = (layout: string) => {
  const map: Record<string, string> = { card: '卡片式', list: '列表式', magazine: '杂志式' };
  return map[layout] ?? layout;
};

// Props
const props = defineProps<{
  component: Component;
  index: number;
  selected: boolean;
}>();

// Emits
const emit = defineEmits<{
  select: [component: Component];
  move: [fromIndex: number, toIndex: number];
  delete: [componentId: string];
}>();

// 点击选择组件
const handleClick = () => {
  emit('select', props.component);
};

// 删除组件
const handleDelete = () => {
  emit('delete', props.component.id);
};

// 添加列到行容器
const handleAddColumn = () => {
  if (props.component.type === ComponentType.ROW) {
    const newColumn = getComponentDefaultProps(ComponentType.COLUMN);
    const rowComponent = props.component as any;
    if (!rowComponent.children) {
      rowComponent.children = [];
    }
    rowComponent.children.push(newColumn);
    editorStore.updateComponentProps(props.component.id, rowComponent);
  }
};
</script>

<style scoped>
.component-wrapper {
  position: relative;
  border: 2px solid transparent;
  border-radius: 8px;
  background: var(--el-bg-color);
  transition: all 0.2s;
}

.component-wrapper:hover {
  border-color: var(--el-border-color);
}

.component-wrapper.component-selected {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px var(--el-color-primary-light-5);
}

.component-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: var(--el-fill-color-lighter);
  border-radius: 6px 6px 0 0;
  cursor: move;
}

.component-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--el-text-color-secondary);
  cursor: grab;
}

.component-handle:active {
  cursor: grabbing;
}

.component-name {
  flex: 1;
  margin-left: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.component-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.component-content {
  padding: 16px;
}

.component-preview {
  min-height: 60px;
}

/* 文本预览 */
.text-preview {
  padding: 8px 0;
}

/* 图片预览 */
.image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.preview-image img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
}

/* 按钮预览 */
.button-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
}

/* 卡片预览 */
.card-preview {
  padding: 8px 0;
}

.card-header-image img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

/* 轮播图预览 */
.carousel-preview,
.navigation-preview,
.form-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: var(--el-fill-color-lighter);
  border-radius: 6px;
}

.carousel-label,
.navigation-label,
.form-label {
  margin-top: 8px;
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.carousel-count,
.navigation-count,
.form-count {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* 默认预览 */
.default-preview {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hero Banner 预览 */
.hero-placeholder {
  border-radius: 6px;
  padding: 20px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hero-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hero-meta {
  margin-top: 8px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

/* 分区标题预览 */
.st-title {
  font-size: 18px;
  font-weight: 700;
}

.st-divider {
  width: 40px;
  height: 3px;
  background: var(--el-color-primary);
  margin: 6px auto;
  border-radius: 2px;
}

.st-subtitle {
  font-size: 12px;
  margin-top: 4px;
}

/* 视频、文章列表、文章导航、目录 - 共用占位样式 */
.video-preview,
.article-list-preview,
.article-nav-preview,
.toc-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  background: var(--el-fill-color-lighter);
  border-radius: 6px;
}

.video-placeholder,
.al-placeholder,
.an-placeholder,
.toc-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.video-label,
.al-label,
.an-label,
.toc-label {
  font-size: 14px;
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.video-meta,
.al-meta,
.an-meta,
.toc-meta {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* 行容器预览 */
.row-preview {
  border: 2px dashed #409eff;
  border-radius: 8px;
  padding: 12px;
  background: #f0f9ff;
}

.row-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.row-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
  padding: 8px;
  background: white;
  border-radius: 4px;
}

.row-drop-zone {
  display: flex;
  min-height: 100px;
  background: white;
  border-radius: 4px;
  padding: 8px;
}

.column-item {
  flex: 1;
  min-width: 0;
}

.add-column-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 100px;
  padding: 20px;
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  color: #909399;
}

.add-column-btn:hover {
  border-color: #409eff;
  color: #409eff;
  background: #ecf5ff;
}

/* 列容器预览 */
.column-preview {
  border: 2px solid #67c23a;
  border-radius: 6px;
  padding: 8px;
  background: #f0f9ff;
}

.column-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.column-header {
  font-size: 12px;
  font-weight: 600;
  color: #67c23a;
  padding: 4px 8px;
  background: white;
  border-radius: 4px;
}

.column-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 60px;
  background: white;
  border-radius: 4px;
  padding: 8px;
}

.empty-column {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  color: #909399;
  font-size: 12px;
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
}
</style>
