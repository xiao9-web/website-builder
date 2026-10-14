import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { APIError, type CollectionConfig } from 'payload'
import { administrator, publishedOrAdministrator } from './access'

const maxVideoBytes = 30 * 1024 * 1024

function isMp4(data: Buffer): boolean {
  let offset = 0
  let hasMovie = false
  let hasMedia = false
  while (offset + 8 <= data.length) {
    const size = data.readUInt32BE(offset)
    const type = data.toString('ascii', offset + 4, offset + 8)
    if (!size || size < 8 || offset + size > data.length) return false
    if (offset === 0 && type !== 'ftyp') return false
    if (type === 'moov' || type === 'moof') hasMovie = true
    if (type === 'mdat') hasMedia = true
    offset += size
  }
  return offset === data.length && hasMovie && hasMedia
}

export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: { singular: '首页视频', plural: '视频素材' },
  admin: { useAsTitle: 'title', group: '官网内容', defaultColumns: ['title', '_status', 'filename'] },
  access: { create: administrator, read: publishedOrAdministrator, update: administrator, delete: administrator, readVersions: administrator },
  versions: { drafts: { validate: true }, maxPerDoc: 10 },
  upload: { staticDir: path.join(process.env.MEDIA_DIR || '', 'videos'), mimeTypes: ['video/mp4'], pasteURL: false },
  hooks: { beforeOperation: [({ args, operation, req }) => {
    if ((operation !== 'create' && operation !== 'update') || !req.file) return args
    const file = req.file
    if (req.user?.collection !== 'users') throw new APIError('请登录管理员账号后上传视频。', 403)
    if (file.size > maxVideoBytes || file.data.length > maxVideoBytes) throw new APIError('视频不能超过 30 MB。', 413)
    if (file.mimetype !== 'video/mp4' || !isMp4(file.data)) {
      throw new APIError('仅接受内容有效的 MP4 视频。', 400)
    }
    req.file = { ...file, name: `${randomUUID()}.mp4` }
    return args
  }] },
  fields: [
    { name: 'title', type: 'text', label: '视频标题', required: true, maxLength: 120 },
    { name: 'description', type: 'textarea', label: '视频说明', maxLength: 500 },
    { name: 'poster', type: 'upload', relationTo: 'media', label: '视频封面图' },
  ],
}
