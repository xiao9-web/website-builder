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
  },
  {
    id: 'homepage-corporate',
    name: '企业官网首页',
    description: 'Hero标题 + 三大特性 + 关于我们',
    preview: '<div style="background:#667eea;height:50px;margin-bottom:8px;"></div><div style="display:flex;gap:6px;margin-bottom:8px;"><div style="flex:1;height:40px;background:#fff;border:1px solid #e0e0e0;border-radius:3px;"></div><div style="flex:1;height:40px;background:#fff;border:1px solid #e0e0e0;border-radius:3px;"></div><div style="flex:1;height:40px;background:#fff;border:1px solid #e0e0e0;border-radius:3px;"></div></div><div style="height:30px;background:#f5f5f5;border-radius:3px;"></div>',
    config: {
      version: '1.0',
      components: [
        {
          id: genId(),
          type: ComponentType.TEXT,
          content: '<div style="text-align:center;padding:60px 20px;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;border-radius:8px;"><h1 style="font-size:48px;margin:0 0 20px;font-weight:700;">欢迎来到我们公司</h1><p style="font-size:20px;margin:0 0 30px;opacity:0.9;">专业 · 创新 · 值得信赖</p><button style="background:white;color:#667eea;border:none;padding:12px 32px;font-size:16px;border-radius:6px;cursor:pointer;font-weight:600;">了解更多</button></div>',
          visible: true,
          fontSize: '16px',
          style: { width: '100%' }
        },
        {
          id: genId(),
          type: ComponentType.TEXT,
          content: '<h2 style="text-align:center;font-size:32px;margin:60px 0 40px;color:#333;">我们的优势</h2>',
          visible: true,
          fontSize: '32px',
          textAlign: 'center',
          style: { width: '100%' }
        },
        {
          id: genId(),
          type: ComponentType.CARD,
          title: '🚀 专业团队',
          content: '拥有10年以上行业经验的专业团队，为您提供最优质的服务',
          visible: true,
          shadow: 'hover',
          style: { width: '33.33%' }
        },
        {
          id: genId(),
          type: ComponentType.CARD,
          title: '⚡ 快速响应',
          content: '7x24小时全天候服务支持，第一时间响应您的需求',
          visible: true,
          shadow: 'hover',
          style: { width: '33.33%' }
        },
        {
          id: genId(),
          type: ComponentType.CARD,
          title: '💎 品质保证',
          content: '严格的质量控制体系，确保每一个项目都达到最高标准',
          visible: true,
          shadow: 'hover',
          style: { width: '33.33%' }
        },
        {
          id: genId(),
          type: ComponentType.TEXT,
          content: '<div style="background:#f8f9fa;padding:40px;border-radius:8px;margin-top:60px;"><h2 style="font-size:28px;margin:0 0 20px;color:#333;">关于我们</h2><p style="font-size:16px;line-height:1.8;color:#666;margin:0;">我们是一家专注于提供优质服务的公司，致力于为客户创造价值。凭借多年的行业经验和专业的团队，我们已经成功服务了数百家企业客户，获得了广泛的认可和好评。</p></div>',
          visible: true,
          fontSize: '16px',
          style: { width: '100%' }
        }
      ],
      settings: {
        title: '企业官网首页',
        description: '专业的企业展示页面',
      }
    }
  },
  {
    id: 'homepage-product',
    name: '产品展示首页',
    description: '产品介绍 + 核心功能 + 截图展示',
    preview: '<div style="padding:8px;"><div style="height:45px;background:#4facfe;margin-bottom:8px;border-radius:3px;"></div><div style="display:flex;gap:6px;margin-bottom:8px;"><div style="flex:1;height:35px;background:#e3f2fd;border-radius:3px;"></div><div style="flex:1;height:35px;background:#e3f2fd;border-radius:3px;"></div></div><div style="height:50px;background:#f0f0f0;border-radius:3px;"></div></div>',
    config: {
      version: '1.0',
      components: [
        {
          id: genId(),
          type: ComponentType.TEXT,
          content: '<div style="text-align:center;padding:80px 20px;"><h1 style="font-size:56px;margin:0 0 24px;font-weight:700;background:linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">强大的产品功能</h1><p style="font-size:20px;color:#666;margin:0;max-width:600px;margin:0 auto;">帮助您的业务快速增长，提升工作效率，节省时间成本</p></div>',
          visible: true,
          fontSize: '16px',
          style: { width: '100%' }
        },
        {
          id: genId(),
          type: ComponentType.TEXT,
          content: '<h3 style="font-size:24px;margin:0 0 16px;color:#333;">📊 数据分析</h3><p style="font-size:16px;line-height:1.8;color:#666;margin:0;">实时数据分析和可视化，让您随时掌握业务动态，做出明智决策。</p>',
          visible: true,
          fontSize: '16px',
          style: { width: '50%' }
        },
        {
          id: genId(),
          type: ComponentType.TEXT,
          content: '<h3 style="font-size:24px;margin:0 0 16px;color:#333;">🔒 安全可靠</h3><p style="font-size:16px;line-height:1.8;color:#666;margin:0;">企业级安全保障，数据加密存储，让您的信息安全无忧。</p>',
          visible: true,
          fontSize: '16px',
          style: { width: '50%' }
        },
        {
          id: genId(),
          type: ComponentType.TEXT,
          content: '<h3 style="font-size:24px;margin:0 0 16px;color:#333;">⚙️ 灵活配置</h3><p style="font-size:16px;line-height:1.8;color:#666;margin:0;">高度可定制化，根据您的业务需求灵活配置各项功能。</p>',
          visible: true,
          fontSize: '16px',
          style: { width: '50%' }
        },
        {
          id: genId(),
          type: ComponentType.TEXT,
          content: '<h3 style="font-size:24px;margin:0 0 16px;color:#333;">🌐 多端同步</h3><p style="font-size:16px;line-height:1.8;color:#666;margin:0;">支持Web、移动端、桌面端，数据实时同步，随时随地办公。</p>',
          visible: true,
          fontSize: '16px',
          style: { width: '50%' }
        },
        {
          id: genId(),
          type: ComponentType.IMAGE,
          src: 'https://via.placeholder.com/1200x600/4facfe/ffffff?text=Product+Screenshot',
          alt: '产品截图',
          visible: true,
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          style: { width: '100%' }
        }
      ],
      settings: {
        title: '产品展示首页',
        description: 'SaaS产品展示页面',
      }
    }
  },
  {
    id: 'homepage-minimal',
    name: '简约首页',
    description: '极简风格，突出核心信息',
    preview: '<div style="display:flex;align-items:center;justify-content:center;height:120px;background:#fff;"><div style="text-align:center;"><div style="height:30px;width:150px;background:#333;margin:0 auto 10px;border-radius:3px;"></div><div style="height:15px;width:200px;background:#999;margin:0 auto 15px;border-radius:2px;"></div><div style="height:25px;width:100px;background:#409eff;margin:0 auto;border-radius:4px;"></div></div></div>',
    config: {
      version: '1.0',
      components: [
        {
          id: genId(),
          type: ComponentType.TEXT,
          content: '<div style="text-align:center;padding:120px 20px;min-height:500px;display:flex;flex-direction:column;justify-content:center;"><h1 style="font-size:64px;margin:0 0 24px;font-weight:700;color:#1a1a1a;letter-spacing:-1px;">让工作更简单</h1><p style="font-size:24px;color:#666;margin:0 0 48px;font-weight:300;">专注于真正重要的事情</p><div><button style="background:#1a1a1a;color:white;border:none;padding:16px 48px;font-size:18px;border-radius:8px;cursor:pointer;font-weight:600;margin-right:16px;">开始使用</button><button style="background:transparent;color:#1a1a1a;border:2px solid #1a1a1a;padding:14px 48px;font-size:18px;border-radius:8px;cursor:pointer;font-weight:600;">了解更多</button></div></div>',
          visible: true,
          fontSize: '16px',
          style: { width: '100%' }
        }
      ],
      settings: {
        title: '简约首页',
        description: '极简风格首页',
      }
    }
  },
  {
    id: 'homepage-blog',
    name: '博客首页',
    description: '标题 + 最新文章列表',
    preview: '<div style="padding:10px;"><div style="height:40px;background:#333;margin-bottom:12px;border-radius:3px;"></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;"><div style="height:50px;background:#f5f5f5;border:1px solid #e0e0e0;border-radius:3px;"></div><div style="height:50px;background:#f5f5f5;border:1px solid #e0e0e0;border-radius:3px;"></div><div style="height:50px;background:#f5f5f5;border:1px solid #e0e0e0;border-radius:3px;"></div></div></div>',
    config: {
      version: '1.0',
      components: [
        {
          id: genId(),
          type: ComponentType.TEXT,
          content: '<div style="text-align:center;padding:60px 20px;border-bottom:1px solid #e8e8e8;"><h1 style="font-size:48px;margin:0 0 16px;font-weight:700;color:#1a1a1a;">我的博客</h1><p style="font-size:18px;color:#666;margin:0;">分享技术、思考与生活</p></div>',
          visible: true,
          fontSize: '16px',
          style: { width: '100%' }
        },
        {
          id: genId(),
          type: ComponentType.TEXT,
          content: '<h2 style="font-size:28px;margin:40px 0 30px;color:#333;">最新文章</h2>',
          visible: true,
          fontSize: '28px',
          style: { width: '100%' }
        },
        {
          id: genId(),
          type: ComponentType.ARTICLE_LIST,
          layout: 'card',
          columns: 3,
          showCover: true,
          showAuthor: true,
          showDate: true,
          showSummary: true,
          showTags: false,
          pageSize: 6,
          sortBy: 'newest',
          visible: true,
          style: { width: '100%' }
        }
      ],
      settings: {
        title: '博客首页',
        description: '个人博客首页',
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
