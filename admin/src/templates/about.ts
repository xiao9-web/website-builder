import type { PageLayoutConfig } from '@/types/components'
import { ComponentType } from '@/types/components'

// 关于我们页面模板
export const aboutTemplate: PageLayoutConfig = {
  version: '1.0',
  settings: {
    title: '关于我们',
    description: '公司介绍页面',
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
      id: 'about-title',
      type: ComponentType.SECTION_TITLE,
      title: '关于我们',
      subtitle: '了解我们的故事与使命',
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

    // 公司介绍卡片
    {
      id: 'company-intro',
      type: ComponentType.CARD,
      title: '我们的使命',
      content: '致力于为用户提供最优质的产品和服务，用技术改变生活。',
      shadow: 'always',
      visible: true,
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '40px',
        marginBottom: '40px',
        fontSize: '18px',
        lineHeight: '1.8',
      },
    },

    // 团队介绍标题
    {
      id: 'team-title',
      type: ComponentType.SECTION_TITLE,
      title: '核心团队',
      subtitle: '专业、热情、创新',
      align: 'center',
      divider: true,
      titleSize: 'md',
      titleColor: '#ffffff',
      subtitleColor: 'rgba(255, 255, 255, 0.85)',
      visible: true,
      style: {
        marginTop: '60px',
        marginBottom: '40px',
      },
    },

    // 团队成员卡片（3列）
    {
      id: 'team-row',
      type: ComponentType.ROW,
      gap: '30px',
      align: 'stretch',
      justify: 'start',
      visible: true,
      style: {
        marginBottom: '60px',
      },
      children: [
        {
          id: 'team-member-1',
          type: ComponentType.COLUMN,
          flex: '1',
          visible: true,
          children: [
            {
              id: 'member-card-1',
              type: ComponentType.CARD,
              title: '张三',
              content: 'CEO & 创始人\n\n拥有10年互联网行业经验，致力于打造用户喜爱的产品。',
              shadow: 'hover',
              visible: true,
              style: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                padding: '30px',
                textAlign: 'center',
              },
            },
          ],
        },
        {
          id: 'team-member-2',
          type: ComponentType.COLUMN,
          flex: '1',
          visible: true,
          children: [
            {
              id: 'member-card-2',
              type: ComponentType.CARD,
              title: '李四',
              content: 'CTO & 联合创始人\n\n技术专家，专注于系统架构和技术创新。',
              shadow: 'hover',
              visible: true,
              style: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                padding: '30px',
                textAlign: 'center',
              },
            },
          ],
        },
        {
          id: 'team-member-3',
          type: ComponentType.COLUMN,
          flex: '1',
          visible: true,
          children: [
            {
              id: 'member-card-3',
              type: ComponentType.CARD,
              title: '王五',
              content: '设计总监\n\n资深设计师，追求极致的用户体验。',
              shadow: 'hover',
              visible: true,
              style: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                padding: '30px',
                textAlign: 'center',
              },
            },
          ],
        },
      ],
    },
  ],
}
