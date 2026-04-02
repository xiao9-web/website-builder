<template>
  <div class="generic-editor">
    <el-form label-position="top" size="small">
      <el-form-item
        v-for="(config, key) in propertyConfig"
        :key="key"
        :label="config.label"
        :required="config.required"
      >
        <!-- 文本输入 -->
        <el-input
          v-if="config.type === 'text'"
          v-model="localProps[key]"
          @input="handleUpdate"
        />

        <!-- 多行文本 -->
        <el-input
          v-else-if="config.type === 'textarea'"
          v-model="localProps[key]"
          type="textarea"
          :rows="4"
          @input="handleUpdate"
        />

        <!-- 数字输入 -->
        <el-input-number
          v-else-if="config.type === 'number'"
          v-model="localProps[key]"
          @change="handleUpdate"
        />

        <!-- 颜色选择器 -->
        <el-color-picker
          v-else-if="config.type === 'color'"
          v-model="localProps[key]"
          @change="handleUpdate"
        />

        <!-- 布尔开关 -->
        <el-switch
          v-else-if="config.type === 'boolean'"
          v-model="localProps[key]"
          @change="handleUpdate"
        />

        <!-- 下拉选择 -->
        <el-select
          v-else-if="config.type === 'select'"
          v-model="localProps[key]"
          @change="handleUpdate"
        >
          <el-option
            v-for="option in config.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>

        <!-- 其他类型显示提示 -->
        <div v-else class="unsupported-type">
          <el-text type="info" size="small">{{ config.type }} 类型暂不支持可视化编辑</el-text>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Component, PropertyConfig } from '@/types/components'
import { getComponentPropertyConfig } from '@/components/Editor/componentLibrary'

const props = defineProps<{
  component: Component
}>()

const emit = defineEmits<{
  update: [props: Partial<Component>]
}>()

// 获取组件的属性配置
const propertyConfig = getComponentPropertyConfig(props.component.type)

// 本地属性副本
const localProps = reactive<Record<string, any>>({})

// 初始化本地属性
const initLocalProps = () => {
  Object.keys(propertyConfig).forEach(key => {
    localProps[key] = (props.component as any)[key] ?? propertyConfig[key].default
  })
}

initLocalProps()

// 监听组件变化
watch(() => props.component, () => {
  initLocalProps()
}, { deep: true })

// 更新处理
const handleUpdate = () => {
  emit('update', { ...localProps })
}
</script>

<style scoped>
.generic-editor {
  padding: 0;
}

.unsupported-type {
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
}
</style>
