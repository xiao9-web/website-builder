import type { PageLayoutConfig } from '@/types/components'
import { ComponentType } from '@/types/components'

// 文章页模板1 - 单栏布局，适合长文阅读
export const articleTemplate1: PageLayoutConfig = {
  version: '1.0',
  settings: {
    title: '文章详情',
    description: '单栏文章页模板 - 适合长文阅读',
    backgroundGradient: {
      enabled: true,
      colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
      direction: '135deg',
      animated: true,
    },
    maxWidth: '900px',
  },
  components: [
    // 文章内容容器
    {
      id: 'article-container',
      type: ComponentType.CARD,
      title: '',
      content: '',
      shadow: 'always',
      visible: true,
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '16px',
        padding: '60px',
        marginTop: '40px',
        marginBottom: '40px',
      },
    },

    // 目录组件
    {
      id: 'toc',
      type: ComponentType.TABLE_OF_CONTENTS,
      title: '目录',
      maxDepth: 3,
      position: 'top',
      collapsible: true,
      showProgress: true,
      visible: true,
      style: {
        marginBottom: '40px',
      },
    },

    // 文章正文占位
    {
      id: 'article-content',
      type: ComponentType.TEXT,
      content: '文章内容将在这里显示...',
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#333333',
      lineHeight: '1.8',
      textAlign: 'left',
      visible: true,
      style: {
        marginBottom: '40px',
      },
    },
  ],
}
