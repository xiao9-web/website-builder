<template>
  <div class="text-renderer" :style="textStyle" v-html="component.content" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TextComponent } from '@/types/components';

const props = defineProps<{
  component: TextComponent;
}>();

const textStyle = computed(() => ({
  fontSize: props.component.fontSize || '16px',
  fontWeight: props.component.fontWeight || 'normal',
  color: props.component.color || '#000',
  lineHeight: props.component.lineHeight || '1.6',
  textAlign: props.component.textAlign || 'left',
  padding: '8px 0',
}));
</script>
