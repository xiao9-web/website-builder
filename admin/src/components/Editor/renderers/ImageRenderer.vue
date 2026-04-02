<template>
  <div class="image-renderer">
    <img :src="component.src" :alt="component.alt" :style="imageStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ImageComponent } from '@/types/components';

const props = defineProps<{
  component: ImageComponent;
}>();

const imageStyle = computed(() => ({
  width: props.component.width || '100%',
  height: props.component.height || 'auto',
  objectFit: props.component.objectFit || 'contain',
  borderRadius: '8px',
}));
</script>

<style scoped>
.image-renderer {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}
img {
  max-width: 100%;
}
</style>
