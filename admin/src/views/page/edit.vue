<template>
  <div class="visual-editor-wrapper">
    <VisualEditor
      @save="handleSave"
      @publish="handlePublish"
      :initial-config="initialConfig"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { VisualEditor } from '@/components/Editor';
import type { PageLayoutConfig } from '@/types/components';
import { getPageApi, updatePageApi, createPageApi } from '@/api/page';

const router = useRouter();
const route = useRoute();
const pageId = ref(route.query.id as string);
const initialConfig = ref<PageLayoutConfig | null>(null);

// 加载页面数据
onMounted(async () => {
  if (pageId.value) {
    try {
      const pageData = await getPageApi(parseInt(pageId.value));
      if (pageData.layout_config) {
        initialConfig.value = pageData.layout_config;
      }
    } catch (error) {
      console.error('加载页面数据失败:', error);
      ElMessage.error('加载页面数据失败');
    }
  }
});

// 保存页面
const handleSave = async (config: PageLayoutConfig) => {
  try {
    if (pageId.value) {
      await updatePageApi(pageId.value, {
        layout_config: config,
        title: config.settings.title,
      });
      ElMessage.success('保存成功');
    } else {
      const res = await createPageApi({
        layout_config: config,
        title: config.settings.title,
        slug: config.settings.title.toLowerCase().replace(/\s+/g, '-'),
        status: 'draft',
      });
      pageId.value = res.id.toString();
      ElMessage.success('创建成功');
    }
  } catch (error) {
    console.error('保存失败:', error);
    ElMessage.error('保存失败');
  }
};

// 发布页面
const handlePublish = async (config: PageLayoutConfig) => {
  try {
    if (pageId.value) {
      await updatePageApi(pageId.value, {
        layout_config: config,
        title: config.settings.title,
        status: 'published',
      });
      ElMessage.success('发布成功');
    } else {
      const res = await createPageApi({
        layout_config: config,
        title: config.settings.title,
        slug: config.settings.title.toLowerCase().replace(/\s+/g, '-'),
        status: 'published',
      });
      pageId.value = res.id.toString();
      ElMessage.success('发布成功');
    }
  } catch (error) {
    console.error('发布失败:', error);
    ElMessage.error('发布失败');
  }
};
</script>

<style scoped>
.visual-editor-wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
