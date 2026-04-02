<template>
  <div class="text-editor">
    <el-alert
      title="📝 文本编辑器"
      type="info"
      :closable="false"
      style="margin-bottom: 16px;"
    >
      <template #default>
        支持HTML格式，修改后实时预览
      </template>
    </el-alert>

    <el-form label-position="top" size="small">
      <el-form-item label="文本内容">
        <el-input
          v-model="localProps.content"
          type="textarea"
          :rows="6"
          placeholder="输入文本内容，支持HTML标签如 <h1>、<p>、<strong> 等"
          @input="handleUpdate"
        />
      </el-form-item>

      <el-divider content-position="left">样式设置</el-divider>

      <el-form-item label="字体大小">
        <el-input v-model="localProps.fontSize" @input="handleUpdate">
          <template #append>px</template>
        </el-input>
      </el-form-item>
      <el-form-item label="字体颜色">
        <el-color-picker v-model="localProps.color" @change="handleUpdate" show-alpha />
      </el-form-item>
      <el-form-item label="对齐方式">
        <el-radio-group v-model="localProps.textAlign" @change="handleUpdate">
          <el-radio-button label="left">左对齐</el-radio-button>
          <el-radio-button label="center">居中</el-radio-button>
          <el-radio-button label="right">右对齐</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
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

<style scoped>
.text-editor {
  padding: 0;
}
</style>
