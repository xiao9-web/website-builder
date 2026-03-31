import type { PageLayoutConfig } from '@/types/components'
import { ComponentType } from '@/types/components'

// 博客列表模板 - 带渐变背景的现代博客风格
export const blogListTemplate: PageLayoutConfig = {
  version: '1.0',
  settings: {
    title: '读书笔记',
    description: '分享读书心得与思考',
    backgroundGradient: {
      enabled: true,
      colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
      direction: '135deg',
      animated: true,
    },
    maxWidth: '1200px',
  },
  components: [
    // 主标题
    {
      id: 'title-1',
      type: ComponentType.TEXT,
      content: '最新文章',
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
      visible: true,
      style: {
        marginTop: '60px',
        marginBottom: '40px',
      },
    },

    // 文章列表（3列卡片）
    {
      id: 'article-list-1',
      type: ComponentType.ARTICLE_LIST,
      layout: 'card',
      columns: 3,
      showCover: true,
      showAuthor: false,
      showDate: true,
      showSummary: true,
      showTags: false,
      pageSize: 6,
      sortBy: 'newest',
      visible: true,
      style: {
        marginBottom: '60px',
      },
    },

    // 底部两栏布局
    {
      id: 'row-bottom',
      type: ComponentType.ROW,
      gap: '40px',
      align: 'start',
      justify: 'start',
      visible: true,
      style: {
        marginBottom: '60px',
      },
      children: [
        // 左侧：分类导航
        {
          id: 'col-categories',
          type: ComponentType.COLUMN,
          flex: '1',
          visible: true,
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          children: [
            {
              id: 'category-title',
              type: ComponentType.TEXT,
              content: '分类导航',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333333',
              visible: true,
              style: {
                marginBottom: '16px',
              },
            },
            {
              id: 'article-nav-1',
              type: ComponentType.ARTICLE_NAV,
              navStyle: 'sidebar',
              showCount: true,
              sticky: false,
              showAllOption: true,
              title: '',
              visible: true,
            },
          ],
        },

        // 右侧：热门文章
        {
          id: 'col-popular',
          type: ComponentType.COLUMN,
          flex: '1',
          visible: true,
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          children: [
            {
              id: 'popular-title',
              type: ComponentType.TEXT,
              content: '热门文章',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333333',
              visible: true,
              style: {
                marginBottom: '16px',
              },
            },
            {
              id: 'popular-list',
              type: ComponentType.ARTICLE_LIST,
              layout: 'list',
              columns: 1,
              showCover: false,
              showAuthor: false,
              showDate: false,
              showSummary: false,
              showTags: false,
              pageSize: 5,
              sortBy: 'popular',
              visible: true,
            },
          ],
        },
      ],
    },
  ],
}
