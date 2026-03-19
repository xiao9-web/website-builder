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

        <div v-else class="default-preview">
          <el-empty description="组件预览" :image-size="40" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Rank, Delete, PictureFilled, Menu, Edit } from '@element-plus/icons-vue';
import { ComponentType, getComponentName } from '@/types/components';
import type { Component } from '@/types/components';

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
</style>
