<template>
  <el-dialog
    v-model="visible"
    title="选择页面模板"
    width="800px"
    @close="handleClose"
  >
    <div class="templates-grid">
      <div
        v-for="template in templates"
        :key="template.id"
        class="template-card"
        @click="handleSelectTemplate(template)"
      >
        <div class="template-preview">
          <div class="preview-content" v-html="template.preview"></div>
        </div>
        <div class="template-info">
          <h4>{{ template.name }}</h4>
          <p>{{ template.description }}</p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ComponentType, type PageLayoutConfig } from '@/types/components'

const visible = defineModel<boolean>('visible', { default: false })

const emit = defineEmits<{
  select: [config: PageLayoutConfig]
}>()

interface Template {
  id: string
  name: string
  description: string
  preview: string
  config: PageLayoutConfig
}

// 生成唯一ID
const genId = () => `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

const templates = ref<Template[]>([
  {
    id: 'blank',
    name: '空白页面',
    description: '从零开始创建',
    preview: '<div style="height:120px;background:#f5f7fa;display:flex;align-items:center;justify-content:center;color:#999;font-size:14px;">空白画布</div>',
    config: {
      version: '1.0',
      components: [],
      settings: {
        title: '新页面',
        description: '',
      }
    }
  },
  {
    id: 'simple-text',
    name: '简单文本页',
    description: '标题 + 正文内容',
    preview: '<div style="padding:15px;background:#fff;"><div style="height:25px;background:#333;margin-bottom:10px;border-radius:3px;"></div><div style="height:15px;background:#ddd;margin-bottom:8px;border-radius:2px;"></div><div style="height:15px;background:#ddd;margin-bottom:8px;border-radius:2px;"></div><div style="height:15px;background:#ddd;width:60%;border-radius:2px;"></div></div>',
    config: {
      version: '1.0',
      components: [
        {
          id: genId(),
          type: ComponentType.TEXT,
          content: '<h1>页面标题</h1>',
          visible: true,
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
          style: { width: '100%' }
        },
        {
          id: genId(),
          type: ComponentType.TEXT,
          content: '<p>这里是正文内容区域。你可以在这里添加任何文字内容，支持 HTML 格式。</p><p>可以添加多个段落，调整字体大小、颜色等样式。</p>',
          visible: true,
          fontSize: '16px',
          color: '#666',
          lineHeight: '1.8',
          style: { width: '100%' }
        }
      ],
      settings: {
        title: '简单文本页',
        description: '标题和正文',
      }
    }
  },
  {
    id: 'two-column',
    name: '左右两栏',
    description: '内容分两栏显示',
    preview: '<div style="display:flex;gap:8px;padding:10px;"><div style="flex:1;height:100px;background:#e3f2fd;border-radius:4px;"></div><div style="flex:1;height:100px;background:#fff3e0;border-radius:4px;"></div></div>',
    config: {
      version: '1.0',
      components: [
        {
          id: genId(),
          type: ComponentType.TEXT,
          content: '<h2>左侧标题</h2><p>这是左侧栏的内容。</p>',
          visible: true,
          fontSize: '16px',
          color: '#333',
          style: { width: '50%' }
        },
        {
          id: genId(),
          type: ComponentType.TEXT,
          content: '<h2>右侧标题</h2><p>这是右侧栏的内容。</p>',
          visible: true,
          fontSize: '16px',
          color: '#333',
          style: { width: '50%' }
        }
      ],
      settings: {
        title: '左右两栏',
        description: '两栏布局',
      }
    }
  },
  {
    id: 'three-cards',
    name: '三栏卡片',
    description: '三个并排的卡片',
    preview: '<div style="display:flex;gap:8px;padding:10px;"><div style="flex:1;height:100px;background:#fff;border:1px solid #e0e0e0;border-radius:4px;"></div><div style="flex:1;height:100px;background:#fff;border:1px solid #e0e0e0;border-radius:4px;"></div><div style="flex:1;height:100px;background:#fff;border:1px solid #e0e0e0;border-radius:4px;"></div></div>',
    config: {
      version: '1.0',
      components: [
        {
          id: genId(),
          type: ComponentType.CARD,
          title: '特性一',
          content: '这里是第一个特性的描述',
          visible: true,
          shadow: 'hover',
          style: { width: '33.33%' }
        },
        {
          id: genId(),
          type: ComponentType.CARD,
          title: '特性二',
          content: '这里是第二个特性的描述',
          visible: true,
          shadow: 'hover',
          style: { width: '33.33%' }
        },
        {
          id: genId(),
          type: ComponentType.CARD,
          title: '特性三',
          content: '这里是第三个特性的描述',
          visible: true,
          shadow: 'hover',
          style: { width: '33.33%' }
        }
      ],
      settings: {
        title: '三栏卡片',
        description: '特性展示',
      }
    }
  },
  {
    id: 'image-text',
    name: '图文混排',
    description: '图片 + 文字说明',
    preview: '<div style="padding:10px;"><div style="height:60px;background:#ddd;margin-bottom:10px;border-radius:4px;"></div><div style="height:15px;background:#333;margin-bottom:8px;border-radius:2px;"></div><div style="height:12px;background:#999;border-radius:2px;"></div></div>',
    config: {
      version: '1.0',
      components: [
        {
          id: genId(),
          type: ComponentType.IMAGE,
          src: 'https://via.placeholder.com/800x400',
          alt: '示例图片',
          visible: true,
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          style: { width: '100%' }
        },
        {
          id: genId(),
          type: ComponentType.TEXT,
          content: '<h2>图片标题</h2><p>这里是图片的说明文字。</p>',
          visible: true,
          fontSize: '16px',
          color: '#666',
          style: { width: '100%' }
        }
      ],
      settings: {
        title: '图文混排',
        description: '图片和文字',
      }
    }
  }
])

const handleSelectTemplate = (template: Template) => {
  emit('select', template.config)
  visible.value = false
}

const handleClose = () => {
  visible.value = false
}
</script>

<style scoped>
.templates-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.template-card {
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.template-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  transform: translateY(-2px);
}

.template-preview {
  height: 140px;
  background: #fafafa;
  overflow: hidden;
  border-bottom: 1px solid #e8e8e8;
}

.preview-content {
  width: 100%;
  height: 100%;
}

.template-info {
  padding: 16px;
  background: #fff;
}

.template-info h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.template-info p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}
</style>
