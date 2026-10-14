import { randomUUID } from 'node:crypto'
import sharp from 'sharp'
import { APIError, type CollectionConfig } from 'payload'
import { administrator } from './access'

const maxFileBytes = 5 * 1024 * 1024
const mimeByFormat = { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' } as const

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: '图片', plural: '图片素材' },
  admin: { useAsTitle: 'alt', group: '官网内容' },
  access: { create: administrator, read: () => true, update: administrator, delete: administrator },
  upload: {
    staticDir: process.env.MEDIA_DIR,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    pasteURL: false,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 320, height: 240, fit: 'inside', withoutEnlargement: true },
      { name: 'card', width: 900, height: 700, fit: 'inside', withoutEnlargement: true },
    ],
  },
  hooks: {
    beforeOperation: [async ({ args, operation, req }) => {
      if ((operation !== 'create' && operation !== 'update') || !req.file) return args
      if (req.user?.collection !== 'users' && req.context.bootstrap !== true) {
        throw new APIError('请登录管理员账号后上传图片。', 403)
      }
      const file = req.file
      if (file.size > maxFileBytes || file.data.length > maxFileBytes) throw new APIError('图片不能超过 5 MB。', 413)
      try {
        const image = sharp(file.data, { limitInputPixels: 24_000_000, animated: false })
        const metadata = await image.metadata()
        const format = metadata.format as keyof typeof mimeByFormat
        if (!Object.hasOwn(mimeByFormat, format) || mimeByFormat[format] !== file.mimetype || (metadata.pages ?? 1) !== 1) {
          throw new Error('unsupported image format')
        }
        const normalized = await image.rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer()
        req.file = { ...file, data: normalized, mimetype: 'image/webp', name: `${randomUUID()}.webp`, size: normalized.length }
      } catch {
        throw new APIError('仅接受内容有效的 JPEG、PNG 或 WebP 图片。', 400)
      }
      return args
    }],
  },
  fields: [{ name: 'alt', type: 'text', label: '图片说明', required: true, maxLength: 200 }],
}
