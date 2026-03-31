import type { PageLayoutConfig } from '@/types/components'
import { ComponentType } from '@/types/components'

// 个人博客首页模板 - 现代渐变风格
export const homepageTemplate: PageLayoutConfig = {
  version: '1.0',
  settings: {
    title: '首页',
    description: '个人博客 - 记录生活，分享思考',
    backgroundGradient: {
      enabled: true,
      colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
      direction: '135deg',
      animated: true,
    },
    maxWidth: '1200px',
  },
  components: [
    // Hero 区域 - 个人介绍
    {
      id: 'hero-intro',
      type: ComponentType.CARD,
      title: '',
      content: '',
      shadow: 'never',
      visible: true,
      style: {
        backgroundColor: 'transparent',
        border: 'none',
        textAlign: 'center',
        padding: '80px 20px',
      },
      children: [
        {
          id: 'hero-title',
          type: ComponentType.TEXT,
          content: '欢迎来到我的博客',
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'center',
          visible: true,
          style: {
            marginBottom: '20px',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          },
        },
        {
          id: 'hero-subtitle',
          type: ComponentType.TEXT,
          content: '记录生活 · 分享思考 · 探索世界',
          fontSize: '20px',
          fontWeight: 'normal',
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
          visible: true,
          style: {
            marginBottom: '40px',
          },
        },
      ],
    },

    // 最新文章区域
    {
      id: 'section-latest',
      type: ComponentType.SECTION_TITLE,
      title: '最新文章',
      subtitle: '分享最近的思考与发现',
      align: 'center',
      divider: true,
      titleSize: 'lg',
      titleColor: '#ffffff',
      subtitleColor: 'rgba(255, 255, 255, 0.85)',
      visible: true,
      style: {
        marginTop: '40px',
        marginBottom: '40px',
      },
    },

    {
      id: 'article-list-latest',
      type: ComponentType.ARTICLE_LIST,
      layout: 'card',
      columns: 3,
      showCover: true,
      showAuthor: false,
      showDate: true,
      showSummary: true,
      showTags: true,
      pageSize: 6,
      sortBy: 'newest',
      visible: true,
      style: {
        marginBottom: '60px',
      },
    },

    // 分类导航
    {
      id: 'section-categories',
      type: ComponentType.SECTION_TITLE,
      title: '文章分类',
      subtitle: '按主题浏览内容',
      align: 'center',
      divider: true,
      titleSize: 'md',
      titleColor: '#ffffff',
      subtitleColor: 'rgba(255, 255, 255, 0.85)',
      visible: true,
      style: {
        marginBottom: '30px',
      },
    },

    {
      id: 'article-nav-main',
      type: ComponentType.ARTICLE_NAV,
      navStyle: 'tabs',
      showCount: true,
      sticky: false,
      showAllOption: false,
      title: '',
      visible: true,
      style: {
        marginBottom: '60px',
      },
    },
  ],
}
