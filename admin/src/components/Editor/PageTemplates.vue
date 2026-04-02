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
import { getComponentDefaultProps } from '@/components/Editor/componentLibrary'

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

const templates = ref<Template[]>([
  {
    id: 'blank',
    name: '空白页面',
    description: '从零开始创建页面',
    preview: '<div style="height:100px;background:#f5f7fa;display:flex;align-items:center;justify-content:center;color:#999;">空白画布</div>',
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
    id: 'hero-features',
    name: 'Hero + 特性展示',
    description: '首页大图 + 三栏特性介绍',
    preview: '<div style="height:100px;background:linear-gradient(135deg,#667eea,#764ba2);"></div><div style="display:flex;gap:10px;padding:10px;"><div style="flex:1;height:60px;background:#f0f0f0;"></div><div style="flex:1;height:60px;background:#f0f0f0;"></div><div style="flex:1;height:60px;background:#f0f0f0;"></div></div>',
    config: {
      version: '1.0',
      components: [
        {
          ...getComponentDefaultProps(ComponentType.HERO_BANNER),
          slides: [{
            id: '1',
            backgroundImage: '',
            backgroundColor: '#667eea',
            title: '欢迎来到我们的网站',
            subtitle: '专业 · 创新 · 值得信赖',
            titleColor: '#ffffff',
            subtitleColor: 'rgba(255,255,255,0.85)',
            overlay: true,
            overlayOpacity: 0.3,
            buttons: [
              { id: 'btn1', text: '了解更多', url: '#', target: '_self', style: 'primary' },
            ],
          }],
        },
        {
          ...getComponentDefaultProps(ComponentType.SECTION_TITLE),
          title: '我们的优势',
          subtitle: '为什么选择我们',
        },
        {
          ...getComponentDefaultProps(ComponentType.CARD),
          title: '专业团队',
          content: '拥有多年行业经验的专业团队',
          style: { width: '33.33%' }
        },
        {
          ...getComponentDefaultProps(ComponentType.CARD),
          title: '优质服务',
          content: '7x24小时全天候服务支持',
          style: { width: '33.33%' }
        },
        {
          ...getComponentDefaultProps(ComponentType.CARD),
          title: '技术领先',
          content: '采用最新技术栈和最佳实践',
          style: { width: '33.33%' }
        },
      ],
      settings: {
        title: '首页',
        description: 'Hero横幅 + 特性展示',
      }
    }
  },
  {
    id: 'two-column',
    name: '左右分栏布局',
    description: '经典的左右两栏内容布局',
    preview: '<div style="display:flex;gap:10px;height:100px;"><div style="flex:1;background:#e3f2fd;"></div><div style="flex:1;background:#fff3e0;"></div></div>',
    config: {
      version: '1.0',
      components: [
        {
          ...getComponentDefaultProps(ComponentType.SECTION_TITLE),
          title: '左右分栏示例',
        },
        {
          ...getComponentDefaultProps(ComponentType.TEXT),
          content: '<h3>左侧内容</h3><p>这里是左侧栏的内容区域，可以放置文字、图片等元素。</p>',
          style: { width: '50%' }
        },
        {
          ...getComponentDefaultProps(ComponentType.TEXT),
          content: '<h3>右侧内容</h3><p>这里是右侧栏的内容区域，可以放置文字、图片等元素。</p>',
          style: { width: '50%' }
        },
      ],
      settings: {
        title: '左右分栏页面',
        description: '经典两栏布局',
      }
    }
  },
  {
    id: 'article-page',
    name: '文章列表页',
    description: '带导航的文章列表展示',
    preview: '<div style="height:30px;background:#409eff;margin-bottom:10px;"></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;"><div style="height:50px;background:#f0f0f0;"></div><div style="height:50px;background:#f0f0f0;"></div><div style="height:50px;background:#f0f0f0;"></div></div>',
    config: {
      version: '1.0',
      components: [
        {
          ...getComponentDefaultProps(ComponentType.ARTICLE_NAV),
          title: '文章分类',
          navStyle: 'tabs',
        },
        {
          ...getComponentDefaultProps(ComponentType.ARTICLE_LIST),
          layout: 'card',
          columns: 3,
          sectionTitle: '最新文章',
        },
      ],
      settings: {
        title: '文章列表',
        description: '文章列表页面',
      }
    }
  },
  {
    id: 'video-intro',
    name: '视频介绍页',
    description: '视频展示 + 文字说明',
    preview: '<div style="height:80px;background:#000;margin-bottom:10px;display:flex;align-items:center;justify-content:center;color:#fff;">🎬</div><div style="height:40px;background:#f5f5f5;"></div>',
    config: {
      version: '1.0',
      components: [
        {
          ...getComponentDefaultProps(ComponentType.SECTION_TITLE),
          title: '产品介绍视频',
        },
        {
          ...getComponentDefaultProps(ComponentType.VIDEO_BLOCK),
          videoType: 'embed',
          embedUrl: '',
          caption: '观看视频了解更多',
        },
        {
          ...getComponentDefaultProps(ComponentType.TEXT),
          content: '<p style="text-align:center;margin-top:20px;">在这里添加视频说明文字</p>',
        },
      ],
      settings: {
        title: '视频介绍',
        description: '视频展示页面',
      }
    }
  },
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
  height: 180px;
  background: #fff;
  overflow: hidden;
}

.preview-content {
  width: 100%;
  height: 100%;
}

.template-info {
  padding: 16px;
  background: #fafafa;
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
