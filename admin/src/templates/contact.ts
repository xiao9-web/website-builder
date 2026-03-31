import type { PageLayoutConfig } from '@/types/components'
import { ComponentType } from '@/types/components'

// 联系我们页面模板
export const contactTemplate: PageLayoutConfig = {
  version: '1.0',
  settings: {
    title: '联系我们',
    description: '联系方式和表单',
    backgroundGradient: {
      enabled: true,
      colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
      direction: '135deg',
      animated: true,
    },
    maxWidth: '900px',
  },
  components: [
    // 页面标题
    {
      id: 'contact-title',
      type: ComponentType.SECTION_TITLE,
      title: '联系我们',
      subtitle: '我们期待与您交流',
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

    // 联系信息卡片
    {
      id: 'contact-info',
      type: ComponentType.CARD,
      title: '联系方式',
      content: '📧 邮箱：contact@example.com\n📱 电话：400-123-4567\n📍 地址：北京市朝阳区xxx大厦',
      shadow: 'always',
      visible: true,
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '40px',
        marginBottom: '40px',
        fontSize: '16px',
        lineHeight: '2',
      },
    },

    // 留言表单
    {
      id: 'contact-form',
      type: ComponentType.FORM,
      fields: [
        {
          id: 'name',
          name: '姓名',
          type: 'text',
          placeholder: '请输入您的姓名',
          required: true,
          options: [],
        },
        {
          id: 'email',
          name: '邮箱',
          type: 'email',
          placeholder: '请输入您的邮箱',
          required: true,
          options: [],
        },
        {
          id: 'message',
          name: '留言内容',
          type: 'textarea',
          placeholder: '请输入您的留言',
          required: true,
          options: [],
        },
      ],
      submitText: '提交留言',
      successMessage: '感谢您的留言，我们会尽快回复！',
      errorMessage: '提交失败，请稍后重试',
      visible: true,
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '40px',
        marginBottom: '60px',
      },
    },
  ],
}
