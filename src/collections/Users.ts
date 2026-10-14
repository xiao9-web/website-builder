import { APIError, type CollectionConfig } from 'payload'
import { administrator } from './access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: '管理员', plural: '管理员' },
  admin: { useAsTitle: 'email', group: '系统设置' },
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    cookies: { sameSite: 'Lax', secure: process.env.COOKIE_SECURE === 'true' },
  },
  access: {
    admin: administrator,
    create: administrator,
    read: administrator,
    update: administrator,
    delete: () => false,
    unlock: administrator,
  },
  hooks: {
    beforeOperation: [({ args, operation, req }) => {
      // Payload's empty-database first-user endpoint bypasses collection access.
      // Only the local bootstrap script can authorize anonymous initialization.
      if (operation === 'create' && !req.user && req.context.bootstrap !== true) {
        throw new APIError('管理员账号由本地初始化工具创建，不开放注册。', 403)
      }
      return args
    }],
  },
  fields: [{ name: 'name', type: 'text', label: '姓名', maxLength: 80 }],
}
