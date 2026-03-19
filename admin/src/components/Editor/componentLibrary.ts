import { ComponentLibrary, ComponentType, PropertyConfig, Component } from '@/types/components';

/**
 * 组件库配置
 * 包含所有支持的组件类型、默认属性和属性面板配置
 */
export const componentLibrary: ComponentLibrary = {
  components: [
    {
      type: ComponentType.TEXT,
      name: '文本组件',
      description: '用于显示文本内容的组件',
      icon: '📝',
      defaultProps: {
        id: '',
        type: ComponentType.TEXT,
        content: '这是一段文本',
        fontSize: '16px',
        fontWeight: 'normal',
        color: '#000000',
        lineHeight: '1.6',
        textAlign: 'left',
        visible: true,
        className: '',
        style: {},
      } as Component,
      propertyConfig: {
        content: { type: 'textarea', label: '文本内容', required: true },
        fontSize: { type: 'text', label: '字体大小', required: false, default: '16px' },
        fontWeight: {
          type: 'select',
          label: '字体粗细',
          required: false,
          default: 'normal',
          options: [
            { label: '正常', value: 'normal' },
            { label: '加粗', value: 'bold' },
            { label: '更细', value: 'lighter' },
            { label: '更粗', value: 'bolder' },
          ],
        },
        color: { type: 'color', label: '文本颜色', required: false, default: '#000000' },
        lineHeight: { type: 'text', label: '行高', required: false, default: '1.6' },
        textAlign: {
          type: 'select',
          label: '对齐方式',
          required: false,
          default: 'left',
          options: [
            { label: '左对齐', value: 'left' },
            { label: '居中对齐', value: 'center' },
            { label: '右对齐', value: 'right' },
          ],
        },
      },
    },
    {
      type: ComponentType.IMAGE,
      name: '图片组件',
      description: '用于显示图片的组件',
      icon: '🖼️',
      defaultProps: {
        id: '',
        type: ComponentType.IMAGE,
        src: '',
        alt: '',
        width: '100%',
        height: 'auto',
        objectFit: 'contain',
        visible: true,
        className: '',
        style: {},
      } as Component,
      propertyConfig: {
        src: { type: 'text', label: '图片地址', required: true },
        alt: { type: 'text', label: '替代文本', required: false },
        width: { type: 'text', label: '宽度', required: false, default: '100%' },
        height: { type: 'text', label: '高度', required: false, default: 'auto' },
        objectFit: {
          type: 'select',
          label: '适应方式',
          required: false,
          default: 'contain',
          options: [
            { label: '填充', value: 'fill' },
            { label: '包含', value: 'contain' },
            { label: '覆盖', value: 'cover' },
            { label: '原图', value: 'none' },
            { label: '缩放', value: 'scale-down' },
          ],
        },
      },
    },
    {
      type: ComponentType.BUTTON,
      name: '按钮组件',
      description: '用于创建交互按钮的组件',
      icon: '🔘',
      defaultProps: {
        id: '',
        type: ComponentType.BUTTON,
        text: '点击这里',
        btnType: 'primary',
        size: 'default',
        icon: '',
        url: '',
        target: '_self',
        visible: true,
        className: '',
        style: {},
      } as Component,
      propertyConfig: {
        text: { type: 'text', label: '按钮文字', required: true },
        btnType: {
          type: 'select',
          label: '按钮类型',
          required: false,
          default: 'primary',
          options: [
            { label: '主要', value: 'primary' },
            { label: '成功', value: 'success' },
            { label: '警告', value: 'warning' },
            { label: '危险', value: 'danger' },
            { label: '信息', value: 'info' },
            { label: '文本', value: 'text' },
          ],
        },
        size: {
          type: 'select',
          label: '按钮大小',
          required: false,
          default: 'default',
          options: [
            { label: '默认', value: 'default' },
            { label: '中型', value: 'medium' },
            { label: '小型', value: 'small' },
            { label: '大型', value: 'large' },
          ],
        },
        icon: { type: 'text', label: '图标', required: false },
        url: { type: 'text', label: '链接地址', required: false },
        target: {
          type: 'select',
          label: '打开方式',
          required: false,
          default: '_self',
          options: [
            { label: '当前窗口', value: '_self' },
            { label: '新窗口', value: '_blank' },
          ],
        },
      },
    },
    {
      type: ComponentType.CARD,
      name: '卡片组件',
      description: '用于显示卡片式内容的组件',
      icon: '📇',
      defaultProps: {
        id: '',
        type: ComponentType.CARD,
        title: '卡片标题',
        content: '这是卡片内容',
        headerImage: '',
        footer: '',
        shadow: 'always',
        visible: true,
        className: '',
        style: {},
      } as Component,
      propertyConfig: {
        title: { type: 'text', label: '标题', required: false },
        content: { type: 'textarea', label: '内容', required: false },
        headerImage: { type: 'text', label: '头部图片', required: false },
        footer: { type: 'text', label: '底部内容', required: false },
        shadow: {
          type: 'select',
          label: '阴影',
          required: false,
          default: 'always',
          options: [
            { label: '总是显示', value: 'always' },
            { label: '悬停显示', value: 'hover' },
            { label: '从不显示', value: 'never' },
          ],
        },
      },
    },
    {
      type: ComponentType.CAROUSEL,
      name: '轮播图组件',
      description: '用于显示轮播图的组件',
      icon: '🎠',
      defaultProps: {
        id: '',
        type: ComponentType.CAROUSEL,
        images: [
          {
            id: '1',
            src: '',
            alt: '图片1',
            url: '',
            target: '_self',
          },
        ],
        autoplay: true,
        interval: 3000,
        indicator: 'outside',
        arrow: 'hover',
        visible: true,
        className: '',
        style: {},
      } as Component,
      propertyConfig: {
        autoplay: { type: 'boolean', label: '自动播放', required: false, default: true },
        interval: { type: 'number', label: '播放间隔', required: false, default: 3000 },
        indicator: {
          type: 'select',
          label: '指示器',
          required: false,
          default: 'outside',
          options: [
            { label: '无', value: 'none' },
            { label: '外部', value: 'outside' },
            { label: '内部', value: 'inside' },
          ],
        },
        arrow: {
          type: 'select',
          label: '箭头',
          required: false,
          default: 'hover',
          options: [
            { label: '从不显示', value: 'never' },
            { label: '悬停显示', value: 'hover' },
            { label: '总是显示', value: 'always' },
          ],
        },
      },
    },
    {
      type: ComponentType.NAVIGATION,
      name: '导航组件',
      description: '用于创建导航菜单的组件',
      icon: '🧭',
      defaultProps: {
        id: '',
        type: ComponentType.NAVIGATION,
        logo: {
          src: '',
          alt: 'Logo',
          url: '/',
        },
        menuItems: [
          {
            id: '1',
            name: '首页',
            url: '/',
            target: '_self',
            children: [],
          },
        ],
        backgroundColor: '#ffffff',
        textColor: '#000000',
        visible: true,
        className: '',
        style: {},
      } as Component,
      propertyConfig: {
        logo: {
          type: 'object',
          label: 'Logo',
          required: false,
          default: {
            src: '',
            alt: 'Logo',
            url: '/',
          },
        },
        backgroundColor: { type: 'color', label: '背景颜色', required: false, default: '#ffffff' },
        textColor: { type: 'color', label: '文字颜色', required: false, default: '#000000' },
      },
    },
    {
      type: ComponentType.FORM,
      name: '表单组件',
      description: '用于创建表单的组件',
      icon: '📋',
      defaultProps: {
        id: '',
        type: ComponentType.FORM,
        fields: [
          {
            id: '1',
            name: '姓名',
            type: 'text',
            placeholder: '请输入姓名',
            required: true,
            options: [],
          },
        ],
        submitText: '提交',
        successMessage: '提交成功！',
        errorMessage: '提交失败，请重试',
        visible: true,
        className: '',
        style: {},
      } as Component,
      propertyConfig: {
        fields: { type: 'array', label: '表单字段', required: true },
        submitText: { type: 'text', label: '提交按钮文字', required: false, default: '提交' },
        successMessage: { type: 'text', label: '成功消息', required: false, default: '提交成功！' },
        errorMessage: { type: 'text', label: '失败消息', required: false, default: '提交失败，请重试' },
      },
    },
  ],
};

/**
 * 根据组件类型获取默认属性
 * @param type 组件类型
 * @returns 默认属性对象
 */
export function getComponentDefaultProps(type: ComponentType): Component {
  const component = componentLibrary.components.find(c => c.type === type);
  if (!component) {
    throw new Error(`Unsupported component type: ${type}`);
  }

  const defaultProps = JSON.parse(JSON.stringify(component.defaultProps));
  defaultProps.id = `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  defaultProps.name = `${component.name} ${defaultProps.id.slice(-4)}`;

  return defaultProps;
}

/**
 * 根据组件类型获取属性面板配置
 * @param type 组件类型
 * @returns 属性面板配置对象
 */
export function getComponentPropertyConfig(type: ComponentType): PropertyConfig {
  const component = componentLibrary.components.find(c => c.type === type);
  return component?.propertyConfig || {};
}

/**
 * 根据组件类型获取组件名称
 * @param type 组件类型
 * @returns 组件名称
 */
export function getComponentName(type: ComponentType): string {
  const component = componentLibrary.components.find(c => c.type === type);
  return component?.name || type;
}

/**
 * 验证组件属性的有效性
 * @param component 组件对象
 * @returns 验证结果
 */
export function validateComponentProps(component: Component): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const propertyConfig = getComponentPropertyConfig(component.type);

  Object.keys(propertyConfig).forEach(key => {
    const config = propertyConfig[key];
    if (config.required && !(key in component) || component[key] === '' || component[key] === null || component[key] === undefined) {
      errors.push(`${config.label} 是必填项`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
