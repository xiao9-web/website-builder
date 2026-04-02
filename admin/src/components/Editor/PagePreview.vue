<template>
  <div class="page-preview">
    <div
      v-for="component in config.components"
      :key="component.id"
      class="preview-component"
    >
      <ComponentRenderer :component="component" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ComponentRenderer from '../Renderer/ComponentRenderer.vue';
import type { PageLayoutConfig } from '@/types/components';

const props = defineProps<{
  config: PageLayoutConfig;
}>();
</script>

<style scoped>
.page-preview {
  width: 100%;
  min-height: 100%;
  background: #fff;
}

.preview-component {
  width: 100%;
}
</style>
