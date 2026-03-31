import type { PageLayoutConfig } from '@/types/components'
import { ComponentType } from '@/types/components'

// 产品展示页模板
export const productTemplate: PageLayoutConfig = {
  version: '1.0',
  settings: {
    title: '产品展示',
    description: '产品列表展示页',
    backgroundGradient: {
      enabled: true,
      colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
      direction: '135deg',
      animated: true,
    },
    maxWidth: '1200px',
  },
  components: [
    // 页面标题
    {
      id: 'product-title',
      type: ComponentType.SECTION_TITLE,
      title: '我们的产品',
      subtitle: '创新科技，服务生活',
      align: 'center',
      divider: true,
      titleSize: 'lg',
      titleColor: '#ffffff',
      subtitleColor: 'rgba(255, 255, 255, 0.85)',
      visible: true,
      style: {
        marginTop: '60px',
        marginBottom: '60px',
      },
    },

    // 产品卡片（3列）
    {
      id: 'product-row',
      type: ComponentType.ROW,
      gap: '30px',
      align: 'stretch',
      justify: 'start',
      visible: true,
      style: {
        marginBottom: '40px',
      },
      children: [
        {
          id: 'product-1',
          type: ComponentType.COLUMN,
          flex: '1',
          visible: true,
          children: [
            {
              id: 'product-card-1',
              type: ComponentType.CARD,
              title: '产品 A',
              content: '功能强大的企业级解决方案。',
              shadow: 'hover',
              visible: true,
              style: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
              },
            },
          ],
        },
      ],
    },
  ],
}
