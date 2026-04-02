<template>
  <div class="text-editor">
    <el-form-item label="文本内容">
      <el-input
        v-model="localProps.content"
        type="textarea"
        :rows="4"
        @input="handleUpdate"
      />
    </el-form-item>

    <el-form-item label="字体大小">
      <el-input v-model="localProps.fontSize" @input="handleUpdate">
        <template #append>px</template>
      </el-input>
    </el-form-item>

    <el-form-item label="字体颜色">
      <el-color-picker v-model="localProps.color" @change="handleUpdate" />
    </el-form-item>

    <el-form-item label="对齐方式">
      <el-radio-group v-model="localProps.textAlign" @change="handleUpdate">
        <el-radio-button label="left">左对齐</el-radio-button>
        <el-radio-button label="center">居中</el-radio-button>
        <el-radio-button label="right">右对齐</el-radio-button>
      </el-radio-group>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { TextComponent } from '@/types/components'

const props = defineProps<{
  component: TextComponent
}>()

const emit = defineEmits<{
  update: [props: Partial<TextComponent>]
}>()

const localProps = reactive({
  content: props.component.content || '',
  fontSize: props.component.fontSize || '16px',
  color: props.component.color || '#000000',
  textAlign: props.component.textAlign || 'left'
})

// 监听组件变化，同步到本地
watch(() => props.component, (newVal) => {
  localProps.content = newVal.content || ''
  localProps.fontSize = newVal.fontSize || '16px'
  localProps.color = newVal.color || '#000000'
  localProps.textAlign = newVal.textAlign || 'left'
}, { deep: true })

const handleUpdate = () => {
  emit('update', { ...localProps })
}
</script>
