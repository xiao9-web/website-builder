import { lexicalEditor, UploadFeature } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'
import { administrator, publishedOrAdministrator } from './access'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: '文章', plural: '文章管理' },
  admin: { useAsTitle: 'title', group: '官网内容', defaultColumns: ['title', 'menu', '_status', 'updatedAt'] },
  access: { create: administrator, read: publishedOrAdministrator, update: administrator, delete: administrator, readVersions: administrator },
  versions: { drafts: { validate: true }, maxPerDoc: 20 },
  fields: [
    { name: 'title', type: 'text', label: '文章标题', required: true, maxLength: 160 },
    { name: 'slug', type: 'text', label: '网址标识', required: true, unique: true, index: true, maxLength: 100,
      validate: (value: unknown) => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? true : '请使用小写字母、数字和短横线。' },
    { name: 'menu', type: 'relationship', relationTo: 'menus', label: '所属菜单', required: true },
    { name: 'summary', type: 'textarea', label: '摘要', maxLength: 500 },
    { name: 'cover', type: 'upload', relationTo: 'media', label: '封面图片（可选）' },
    { name: 'content', type: 'richText', label: '正文', required: true, editor: lexicalEditor({
      features: ({ rootFeatures }) => [
        ...rootFeatures.filter(feature => feature.key !== 'upload'),
        UploadFeature({ enabledCollections: ['media'] }),
      ],
    }) },
    { name: 'isDemo', type: 'checkbox', label: '示例文章', defaultValue: false,
      admin: { description: '演示内容应勾选，前台会标明不是实际产品或公司资料。' } },
  ],
}
