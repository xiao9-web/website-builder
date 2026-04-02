<template>
  <div class="image-editor">
    <el-form-item label="图片地址">
      <el-input v-model="localProps.src" @input="handleUpdate" placeholder="https://..." />
    </el-form-item>

    <el-form-item label="替代文本">
      <el-input v-model="localProps.alt" @input="handleUpdate" />
    </el-form-item>

    <el-form-item label="宽度">
      <el-input v-model="localProps.width" @input="handleUpdate" placeholder="100%" />
    </el-form-item>

    <el-form-item label="高度">
      <el-input v-model="localProps.height" @input="handleUpdate" placeholder="auto" />
    </el-form-item>

    <el-form-item label="填充方式">
      <el-select v-model="localProps.objectFit" @change="handleUpdate">
        <el-option label="包含" value="contain" />
        <el-option label="覆盖" value="cover" />
        <el-option label="填充" value="fill" />
      </el-select>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { ImageComponent } from '@/types/components'

const props = defineProps<{
  component: ImageComponent
}>()

const emit = defineEmits<{
  update: [props: Partial<ImageComponent>]
}>()

const localProps = reactive({
  src: props.component.src || '',
  alt: props.component.alt || '',
  width: props.component.width || '100%',
  height: props.component.height || 'auto',
  objectFit: props.component.objectFit || 'contain'
})

watch(() => props.component, (newVal) => {
  localProps.src = newVal.src || ''
  localProps.alt = newVal.alt || ''
  localProps.width = newVal.width || '100%'
  localProps.height = newVal.height || 'auto'
  localProps.objectFit = newVal.objectFit || 'contain'
}, { deep: true })

const handleUpdate = () => {
  emit('update', { ...localProps })
}
</script>
