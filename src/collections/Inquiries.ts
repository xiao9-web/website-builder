import { APIError, type CollectionConfig } from 'payload'
import { administrator } from './access'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: '采购询盘', plural: '采购询盘' },
  admin: { useAsTitle: 'company', group: '客户联系', defaultColumns: ['company', 'contactName', 'status', 'createdAt'] },
  access: { create: administrator, read: administrator, update: administrator, delete: administrator },
  hooks: { beforeOperation: [({ args, operation, req }) => {
    if (operation === 'create' && req.user?.collection !== 'users' && req.context.publicInquiry !== true) {
      throw new APIError('请通过官网采购联系表单提交。', 403)
    }
    return args
  }] },
  fields: [
    { name: 'company', type: 'text', label: '采购企业', required: true, maxLength: 120 },
    { name: 'contactName', type: 'text', label: '联系人', required: true, maxLength: 60 },
    { name: 'phone', type: 'text', label: '联系电话', maxLength: 40 },
    { name: 'email', type: 'email', label: '联系邮箱', validate: (value: unknown) => !value || (typeof value === 'string' && value.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) ? true : '请填写有效的邮箱地址。' },
    { name: 'product', type: 'relationship', relationTo: 'products', label: '意向产品' },
    { name: 'requirement', type: 'textarea', label: '采购需求', required: true, maxLength: 2000 },
    { name: 'status', type: 'select', label: '处理状态', required: true, defaultValue: 'new', options: [
      { label: '待联系', value: 'new' }, { label: '已联系', value: 'contacted' }, { label: '已完成', value: 'closed' },
    ] },
  ],
}
