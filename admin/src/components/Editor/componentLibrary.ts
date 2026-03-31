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

    // ─── 企业官网专属组件 ──────────────────────────────────────────

    {
      type: ComponentType.HERO_BANNER,
      name: 'Hero 大图',
      description: '首页全屏大图轮播，支持标题、副标题和 CTA 按钮',
      icon: '🖼️',
      defaultProps: {
        id: '',
        type: ComponentType.HERO_BANNER,
        slides: [
          {
            id: '1',
            backgroundImage: '',
            backgroundColor: '#1a1a2e',
            title: '欢迎来到我们的企业官网',
            subtitle: '专业 · 创新 · 值得信赖',
            titleColor: '#ffffff',
            subtitleColor: 'rgba(255,255,255,0.85)',
            overlay: true,
            overlayOpacity: 0.4,
            buttons: [
              { id: 'btn1', text: '了解更多', url: '/about', target: '_self', style: 'primary' },
              { id: 'btn2', text: '联系我们', url: '/contact', target: '_self', style: 'outline' },
            ],
          },
        ],
        height: '60vh',
        autoPlay: true,
        interval: 5000,
        indicator: 'dot',
        transition: 'slide',
        visible: true,
        className: '',
        style: {},
      } as Component,
      propertyConfig: {
        height: {
          type: 'select', label: '轮播高度', required: false, default: '60vh',
          options: [
            { label: '400px', value: '400px' },
            { label: '500px', value: '500px' },
            { label: '60% 视口', value: '60vh' },
            { label: '70% 视口', value: '70vh' },
            { label: '80% 视口', value: '80vh' },
            { label: '全屏', value: '100vh' },
          ],
        },
        autoPlay: { type: 'boolean', label: '自动播放', required: false, default: true },
        interval: { type: 'number', label: '播放间隔(ms)', required: false, default: 5000 },
        indicator: {
          type: 'select', label: '指示器样式', required: false, default: 'dot',
          options: [
            { label: '圆点', value: 'dot' },
            { label: '短线', value: 'line' },
            { label: '不显示', value: 'none' },
          ],
        },
        transition: {
          type: 'select', label: '切换动效', required: false, default: 'slide',
          options: [
            { label: '平移', value: 'slide' },
            { label: '淡入淡出', value: 'fade' },
          ],
        },
      } as PropertyConfig,
    },

    {
      type: ComponentType.SECTION_TITLE,
      name: '分区标题',
      description: '内容区块的分区标题，支持主标题、副标题和装饰线',
      icon: '📌',
      defaultProps: {
        id: '',
        type: ComponentType.SECTION_TITLE,
        title: '产品与服务',
        subtitle: '我们提供专业的解决方案，满足您的各类需求',
        align: 'center',
        divider: true,
        titleSize: 'md',
        moreLink: '',
        moreLinkText: '查看更多',
        titleColor: '#1a1a2e',
        subtitleColor: '#666666',
        visible: true,
        className: '',
        style: {},
      } as Component,
      propertyConfig: {
        title: { type: 'text', label: '主标题', required: true },
        subtitle: { type: 'textarea', label: '副标题', required: false },
        align: {
          type: 'select', label: '对齐方式', required: false, default: 'center',
          options: [
            { label: '左对齐', value: 'left' },
            { label: '居中', value: 'center' },
            { label: '右对齐', value: 'right' },
          ],
        },
        divider: { type: 'boolean', label: '显示装饰线', required: false, default: true },
        titleSize: {
          type: 'select', label: '标题字号', required: false, default: 'md',
          options: [
            { label: '小 (24px)', value: 'sm' },
            { label: '中 (32px)', value: 'md' },
            { label: '大 (40px)', value: 'lg' },
          ],
        },
        moreLink: { type: 'text', label: '"查看更多"链接', required: false },
        moreLinkText: { type: 'text', label: '"查看更多"文字', required: false, default: '查看更多' },
        titleColor: { type: 'color', label: '标题颜色', required: false, default: '#1a1a2e' },
        subtitleColor: { type: 'color', label: '副标题颜色', required: false, default: '#666666' },
      } as PropertyConfig,
    },

    {
      type: ComponentType.VIDEO_BLOCK,
      name: '视频组件',
      description: '支持本地视频或第三方嵌入链接（YouTube、Bilibili 等）',
      icon: '🎬',
      defaultProps: {
        id: '',
        type: ComponentType.VIDEO_BLOCK,
        videoType: 'embed',
        videoSrc: '',
        embedUrl: '',
        poster: '',
        autoPlay: false,
        controls: true,
        aspectRatio: '16:9',
        caption: '',
        maxWidth: '100%',
        visible: true,
        className: '',
        style: {},
      } as Component,
      propertyConfig: {
        videoType: {
          type: 'select', label: '视频来源', required: true, default: 'embed',
          options: [
            { label: '本地视频', value: 'local' },
            { label: '第三方嵌入', value: 'embed' },
          ],
        },
        videoSrc: { type: 'text', label: '本地视频地址', required: false },
        embedUrl: { type: 'text', label: '嵌入链接 (YouTube/Bilibili)', required: false },
        poster: { type: 'text', label: '封面图地址', required: false },
        autoPlay: { type: 'boolean', label: '静音自动播放', required: false, default: false },
        controls: { type: 'boolean', label: '显示控制栏', required: false, default: true },
        aspectRatio: {
          type: 'select', label: '宽高比', required: false, default: '16:9',
          options: [
            { label: '16:9（宽屏）', value: '16:9' },
            { label: '4:3（传统）', value: '4:3' },
            { label: '1:1（方形）', value: '1:1' },
          ],
        },
        caption: { type: 'text', label: '视频说明文字', required: false },
        maxWidth: { type: 'text', label: '最大宽度', required: false, default: '100%' },
      } as PropertyConfig,
    },

    {
      type: ComponentType.ARTICLE_LIST,
      name: '文章列表',
      description: '动态展示文章列表，支持卡片、列表、杂志三种布局',
      icon: '📰',
      defaultProps: {
        id: '',
        type: ComponentType.ARTICLE_LIST,
        layout: 'card',
        columns: 3,
        showCover: true,
        showAuthor: true,
        showDate: true,
        showSummary: true,
        showTags: false,
        pageSize: 9,
        categoryId: undefined,
        sortBy: 'newest',
        sectionTitle: '',
        visible: true,
        className: '',
        style: {},
      } as Component,
      propertyConfig: {
        sectionTitle: { type: 'text', label: '区块标题（留空不显示）', required: false },
        layout: {
          type: 'select', label: '列表布局', required: true, default: 'card',
          options: [
            { label: '卡片式', value: 'card' },
            { label: '列表式', value: 'list' },
            { label: '杂志式', value: 'magazine' },
          ],
        },
        columns: {
          type: 'select', label: '列数（卡片式）', required: false, default: 3,
          options: [
            { label: '1 列', value: 1 },
            { label: '2 列', value: 2 },
            { label: '3 列', value: 3 },
          ],
        },
        showCover: { type: 'boolean', label: '显示封面图', required: false, default: true },
        showAuthor: { type: 'boolean', label: '显示作者', required: false, default: true },
        showDate: { type: 'boolean', label: '显示日期', required: false, default: true },
        showSummary: { type: 'boolean', label: '显示摘要', required: false, default: true },
        showTags: { type: 'boolean', label: '显示标签', required: false, default: false },
        pageSize: { type: 'number', label: '每页文章数', required: false, default: 9 },
        sortBy: {
          type: 'select', label: '排序方式', required: false, default: 'newest',
          options: [
            { label: '最新发布', value: 'newest' },
            { label: '最多浏览', value: 'popular' },
            { label: '最近更新', value: 'updated' },
          ],
        },
      } as PropertyConfig,
    },

    {
      type: ComponentType.ARTICLE_NAV,
      name: '文章导航',
      description: '文章分类导航，支持标签页和侧边栏两种样式',
      icon: '🗂️',
      defaultProps: {
        id: '',
        type: ComponentType.ARTICLE_NAV,
        navStyle: 'tabs',
        showCount: true,
        sticky: false,
        showAllOption: true,
        title: '文章分类',
        visible: true,
        className: '',
        style: {},
      } as Component,
      propertyConfig: {
        title: { type: 'text', label: '导航标题', required: false, default: '文章分类' },
        navStyle: {
          type: 'select', label: '导航样式', required: false, default: 'tabs',
          options: [
            { label: '标签页', value: 'tabs' },
            { label: '侧边栏', value: 'sidebar' },
          ],
        },
        showCount: { type: 'boolean', label: '显示文章数量', required: false, default: true },
        sticky: { type: 'boolean', label: '固定定位（滚动时保持可见）', required: false, default: false },
        showAllOption: { type: 'boolean', label: '显示"全部"选项', required: false, default: true },
      } as PropertyConfig,
    },

    {
      type: ComponentType.TABLE_OF_CONTENTS,
      name: '页面目录',
      description: '自动从文章标题提取目录，支持滚动高亮和阅读进度',
      icon: '📋',
      defaultProps: {
        id: '',
        type: ComponentType.TABLE_OF_CONTENTS,
        title: '目录',
        maxDepth: 2,
        position: 'top',
        collapsible: true,
        showProgress: false,
        visible: true,
        className: '',
        style: {},
      } as Component,
      propertyConfig: {
        title: { type: 'text', label: '目录标题', required: false, default: '目录' },
        maxDepth: {
          type: 'select', label: '提取标题层级', required: false, default: 2,
          options: [
            { label: '仅 H2', value: 2 },
            { label: 'H2 + H3', value: 3 },
          ],
        },
        position: {
          type: 'select', label: '展示位置', required: false, default: 'top',
          options: [
            { label: '文章顶部内嵌', value: 'top' },
            { label: '右侧悬浮固定', value: 'right-sticky' },
          ],
        },
        collapsible: { type: 'boolean', label: '可折叠', required: false, default: true },
        showProgress: { type: 'boolean', label: '显示阅读进度条', required: false, default: false },
      } as PropertyConfig,
    },

    {
      type: ComponentType.ROW,
      name: '行容器',
      description: '水平排列的容器，可以放置多个列组件',
      icon: '⬌',
      defaultProps: {
        id: '',
        type: ComponentType.ROW,
        children: [],
        gap: '20px',
        align: 'stretch',
        justify: 'start',
        visible: true,
        className: '',
        style: {},
      } as Component,
      propertyConfig: {
        gap: { type: 'text', label: '列间距', required: false, default: '20px' },
        align: {
          type: 'select', label: '垂直对齐', required: false, default: 'stretch',
          options: [
            { label: '顶部对齐', value: 'start' },
            { label: '居中对齐', value: 'center' },
            { label: '底部对齐', value: 'end' },
            { label: '拉伸填充', value: 'stretch' },
          ],
        },
        justify: {
          type: 'select', label: '水平对齐', required: false, default: 'start',
          options: [
            { label: '左对齐', value: 'start' },
            { label: '居中', value: 'center' },
            { label: '右对齐', value: 'end' },
            { label: '两端对齐', value: 'space-between' },
            { label: '均匀分布', value: 'space-around' },
          ],
        },
      } as PropertyConfig,
    },

    {
      type: ComponentType.COLUMN,
      name: '列容器',
      description: '行容器中的列，可以设置宽度比例',
      icon: '▯',
      defaultProps: {
        id: '',
        type: ComponentType.COLUMN,
        children: [],
        width: 'auto',
        flex: '1',
        padding: '0',
        visible: true,
        className: '',
        style: {},
      } as Component,
      propertyConfig: {
        width: { type: 'text', label: '固定宽度', required: false, default: 'auto' },
        flex: { type: 'text', label: '弹性比例', required: false, default: '1' },
        padding: { type: 'text', label: '内边距', required: false, default: '0' },
      } as PropertyConfig,
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
  defaultProps.id = `component-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
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

  const comp = component as unknown as Record<string, unknown>;
  Object.keys(propertyConfig).forEach(key => {
    const config = propertyConfig[key];
    if (config.required && (!(key in component) || comp[key] === '' || comp[key] === null || comp[key] === undefined)) {
      errors.push(`${config.label} 是必填项`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
