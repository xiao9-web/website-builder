import { APIError, type CollectionConfig } from 'payload'
import { administrator, publishedOrAdministrator } from './access'

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const Menus: CollectionConfig = {
  slug: 'menus',
  labels: { singular: '内容菜单', plural: '内容菜单' },
  admin: { useAsTitle: 'title', group: '官网内容', defaultColumns: ['title', 'parent', 'displayOrder', '_status'] },
  access: { create: administrator, read: publishedOrAdministrator, update: administrator, delete: administrator, readVersions: administrator },
  versions: { drafts: { validate: true }, maxPerDoc: 20 },
  hooks: {
    beforeChange: [async ({ data, originalDoc, req }) => {
      const ownId = originalDoc?.id ? Number(originalDoc.id) : null
      const selectedParent = Object.hasOwn(data, 'parent') ? data.parent : originalDoc?.parent
      const parentId = selectedParent ? Number(typeof selectedParent === 'object' ? selectedParent.id : selectedParent) || null : null
      if (ownId !== null && parentId === ownId) throw new APIError('菜单不能作为自己的上级。', 400)
      const all = await req.payload.find({ collection: 'menus', depth: 0, limit: 1000, pagination: false, draft: true, overrideAccess: true, req })
      const parentOf = new Map<number, number | null>(all.docs.map(item => [item.id, typeof item.parent === 'number' ? item.parent : null]))
      if (ownId && !parentOf.has(ownId)) parentOf.set(ownId, null)
      if (parentId && !parentOf.has(parentId)) throw new APIError('上级菜单不存在。', 400)
      const depth = (id: number | null, seen = new Set<number>()): number => {
        if (!id) return 0
        if (seen.has(id)) throw new APIError('菜单不能移动到自己的后代。', 400)
        seen.add(id)
        return 1 + depth(parentOf.get(id) ?? null, seen)
      }
      if (ownId) parentOf.set(ownId, parentId)
      const candidateDepth = 1 + depth(parentId)
      if (candidateDepth > 3) throw new APIError('菜单最多三级。', 400)
      if (ownId) {
        for (const id of parentOf.keys()) {
          if (id === ownId) continue
          let current: number | null = id
          const seen = new Set<number>()
          while (current && !seen.has(current)) {
            if (current === ownId && depth(id) > 3) throw new APIError('移动后下级菜单会超过三级。', 400)
            seen.add(current)
            current = parentOf.get(current) ?? null
          }
        }
      }
      return data
    }],
    beforeDelete: [async ({ id, req }) => {
      const [children, articles] = await Promise.all([
        req.payload.count({ collection: 'menus', where: { parent: { equals: id } }, overrideAccess: true, req }),
        req.payload.count({ collection: 'articles', where: { menu: { equals: id } }, overrideAccess: true, req }),
      ])
      if (children.totalDocs || articles.totalDocs) throw new APIError('此菜单仍有下级或文章，请先迁移或删除相关内容。', 400)
    }],
  },
  fields: [
    { name: 'title', type: 'text', label: '菜单名称', required: true, maxLength: 80 },
    { name: 'slug', type: 'text', label: '网址标识', required: true, unique: true, index: true, maxLength: 80,
      validate: (value: unknown) => typeof value === 'string' && slugPattern.test(value) ? true : '请使用小写字母、数字和短横线。' },
    { name: 'parent', type: 'relationship', relationTo: 'menus', label: '上级菜单', admin: { description: '留空为一级菜单。最多三级；不能选自身或自己的后代。' } },
    { name: 'displayOrder', type: 'number', label: '显示顺序', defaultValue: 0, min: 0, max: 10000 },
  ],
}
