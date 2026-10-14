import type { GlobalConfig } from 'payload'
import { administrator } from '../collections/access'

export const Company: GlobalConfig = {
  slug: 'company',
  label: '公司与联系方式',
  admin: { group: '官网内容' },
  access: { read: administrator, update: administrator, readVersions: administrator },
  versions: { drafts: { validate: true }, max: 20 },
  fields: [
    { name: 'brandName', type: 'text', label: '品牌简称', required: true, maxLength: 80 },
    { name: 'companyName', type: 'text', label: '公司法定名称', maxLength: 160, admin: { description: '未核实前留空，请按营业执照填写。' } },
    { name: 'headline', type: 'text', label: '首页标题', required: true, maxLength: 160 },
    { name: 'intro', type: 'textarea', label: '公司简介', required: true, maxLength: 2000 },
    { name: 'businessScope', type: 'textarea', label: '主营业务', maxLength: 1000 },
    { name: 'advantages', type: 'array', label: '服务说明', maxRows: 6, fields: [
      { name: 'title', type: 'text', label: '标题', required: true, maxLength: 100 },
      { name: 'description', type: 'textarea', label: '说明', required: true, maxLength: 500 },
    ] },
    { name: 'phone', type: 'text', label: '商务联系电话', maxLength: 40 },
    { name: 'email', type: 'email', label: '商务联系邮箱', validate: (value: unknown) => !value || (typeof value === 'string' && value.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) ? true : '请填写有效的邮箱地址。' },
    { name: 'address', type: 'text', label: '公司地址', maxLength: 200 },
    { name: 'heroImage', type: 'upload', relationTo: 'media', label: '首页主图' },
    { name: 'heroSlides', type: 'array', label: '首页轮播图片', maxRows: 5, admin: { description: '按顺序展示，建议上传两到五张横向图片。只有一张时不显示轮播控制。' }, fields: [
      { name: 'image', type: 'upload', relationTo: 'media', label: '图片', required: true },
      { name: 'isConcept', type: 'checkbox', label: '标记为概念示意图', defaultValue: false, admin: { description: 'AI 生成或非真实产品照片时勾选，官网将标注“原料示意图”。图片说明仍应写明真实来源。' } },
    ] },
    { name: 'homeVideo', type: 'relationship', relationTo: 'videos', label: '首页视频（可选）', admin: { description: '先在“视频素材”上传并发布 MP4，再在此选择。首页首次打开仅显示封面，访客点击才加载视频。' } },
  ],
}
