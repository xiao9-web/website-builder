import type { CollectionConfig } from 'payload'
import { administrator, publishedOrAdministrator } from './access'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: '产品', plural: '产品管理' },
  admin: { useAsTitle: 'name', group: '官网内容', defaultColumns: ['name', 'category', '_status', 'isDemo'] },
  access: { create: administrator, read: publishedOrAdministrator, update: administrator, delete: administrator, readVersions: administrator },
  versions: { drafts: { validate: true }, maxPerDoc: 20 },
  fields: [
    { name: 'name', type: 'text', label: '产品名称', required: true, maxLength: 120 },
    { name: 'slug', type: 'text', label: '网址标识', required: true, unique: true, index: true, maxLength: 100,
      validate: (value: unknown) => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? true : '请使用小写字母、数字和短横线。' },
    { name: 'category', type: 'select', label: '产品分类', required: true, options: [
      { label: '黄油', value: 'butter' }, { label: '其他乳制品', value: 'dairy' },
    ] },
    { name: 'summary', type: 'textarea', label: '产品简介', required: true, maxLength: 1500 },
    { name: 'specification', type: 'text', label: '规格', maxLength: 200, admin: { description: '只填写已核实的产品规格。' } },
    { name: 'packaging', type: 'text', label: '包装', maxLength: 200 },
    { name: 'applications', type: 'array', label: '应用场景', maxRows: 12, fields: [
      { name: 'label', type: 'text', label: '场景名称', required: true, maxLength: 80 },
    ] },
    { name: 'image', type: 'upload', relationTo: 'media', label: '产品图片' },
    { name: 'displayOrder', type: 'number', label: '显示顺序', defaultValue: 0, min: 0, max: 10000 },
    { name: 'isDemo', type: 'checkbox', label: '示例产品', defaultValue: false,
      admin: { description: '勾选后前台明确标为示例，请在交付前用真实资料替换。' } },
  ],
}
