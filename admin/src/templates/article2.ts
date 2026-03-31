import type { PageLayoutConfig } from '@/types/components'
import { ComponentType } from '@/types/components'

// 文章页模板2 - 左侧边栏布局
export const articleTemplate2: PageLayoutConfig = {
  version: '1.0',
  settings: {
    title: '文章页（左侧边栏）',
    description: '带左侧导航的文章页',
    backgroundGradient: {
      enabled: true,
      colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
      direction: '135deg',
      animated: true,
    },
    maxWidth: '1200px',
  },
  components: [
    // 两栏布局
    {
      id: 'row-main',
      type: ComponentType.ROW,
      gap: '30px',
      align: 'start',
      justify: 'start',
      visible: true,
      style: {
        marginTop: '40px',
        marginBottom: '40px',
      },
      children: [
        // 左侧边栏
        {
          id: 'col-sidebar',
          type: ComponentType.COLUMN,
          width: '280px',
          flex: '0',
          visible: true,
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          children: [
            {
              id: 'sidebar-title',
              type: ComponentType.TEXT,
              content: '文章目录',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333333',
              visible: true,
              style: {
                marginBottom: '16px',
              },
            },
            {
              id: 'toc-sidebar',
              type: ComponentType.TABLE_OF_CONTENTS,
              title: '',
              maxDepth: 3,
              position: 'top',
              collapsible: false,
              showProgress: true,
              visible: true,
            },
          ],
        },

        // 右侧主内容
        {
          id: 'col-content',
          type: ComponentType.COLUMN,
          flex: '1',
          visible: true,
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '12px',
            padding: '60px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          children: [
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
            },
          ],
        },
      ],
    },
  ],
}
