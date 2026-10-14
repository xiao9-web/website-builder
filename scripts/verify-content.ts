import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'
import sharp from 'sharp'
import config from '../src/payload.config'
import { getPublicArticle, getPublicArticlesForMenu, getPublicCompany, getPublicMenus } from '../src/endpoints/public-content'

if (!process.env.DATABASE_URL?.includes('verification-content.sqlite')) throw new Error('内容验证必须使用隔离数据库。')
const payload = await getPayload({ config })
const users = await payload.find({ collection: 'users', limit: 1 })
const admin = { ...users.docs[0], collection: 'users' as const }
assert.ok(admin.id, '隔离库应从含试用管理员的本地库复制')
const content = { root: { type: 'root', children: [{ type: 'paragraph', version: 1, children: [{ type: 'text', text: '这是用于验收的演示文章。', version: 1 }] }], direction: null, format: '' as const, indent: 0, version: 1 } }
const marker = `check-${Date.now()}`

try {
  const root = await payload.create({ collection: 'menus', user: admin, overrideAccess: false, data: { title: '原料资料', slug: `${marker}-root`, _status: 'published' } })
  const child = await payload.create({ collection: 'menus', user: admin, overrideAccess: false, data: { title: '黄油原料', slug: `${marker}-child`, parent: root.id, _status: 'published' } })
  const third = await payload.create({ collection: 'menus', user: admin, overrideAccess: false, data: { title: '烘焙应用', slug: `${marker}-third`, parent: child.id, _status: 'published' } })
  const menus = await getPublicMenus()
  assert.equal(menus.find(item => item.id === third.id)?.parentId, child.id)
  await assert.rejects(payload.create({ collection: 'menus', user: admin, overrideAccess: false, data: { title: '不允许的第四级', slug: `${marker}-fourth`, parent: third.id, _status: 'published' } }))
  await assert.rejects(payload.update({ collection: 'menus', id: root.id, user: admin, overrideAccess: false, data: { parent: third.id } }))
  await assert.rejects(payload.update({ collection: 'menus', id: child.id, user: admin, overrideAccess: false, data: { parent: third.id } }))
  await assert.rejects(payload.create({ collection: 'menus', user: admin, overrideAccess: false, data: { title: '重复', slug: root.slug, _status: 'published' } }))

  const firstArticle = await payload.create({ collection: 'articles', user: admin, overrideAccess: false, data: { title: '原料资料如何阅读', slug: `${marker}-first`, menu: root.id, content, isDemo: true, _status: 'published' } })
  const imageData = await sharp({ create: { width: 800, height: 500, channels: 3, background: '#efd369' } }).jpeg().toBuffer()
  const cover = await payload.create({ collection: 'media', user: admin, overrideAccess: false, data: { alt: '自动生成的设计验收图片' }, file: { data: imageData, name: 'demo.jpg', mimetype: 'image/jpeg', size: imageData.length } })
  const contentWithImage = { root: { ...content.root, children: [...content.root.children, { type: 'upload', version: 1, format: '' as const, id: randomUUID(), relationTo: 'media', value: cover.id, fields: {} }] } }
  const thirdArticle = await payload.create({ collection: 'articles', user: admin, overrideAccess: false, data: { title: '烘焙应用资料示例', slug: `${marker}-third-article`, menu: third.id, cover: cover.id, content: contentWithImage, isDemo: true, _status: 'published' } })
  assert.equal((await getPublicArticlesForMenu(root.id)).some(item => item.slug === firstArticle.slug), true)
  assert.equal((await getPublicArticlesForMenu(root.id)).some(item => item.slug === thirdArticle.slug), false)
  assert.equal((await getPublicArticle(thirdArticle.slug))?.menuId, third.id)
  await assert.rejects(payload.delete({ collection: 'menus', id: root.id, user: admin, overrideAccess: false }))
  await assert.rejects(payload.delete({ collection: 'menus', id: third.id, user: admin, overrideAccess: false }))
  const draftArticle = await payload.create({ collection: 'articles', user: admin, overrideAccess: false, data: { title: '草稿', slug: `${marker}-draft`, menu: child.id, content, _status: 'draft' } })
  assert.equal(await getPublicArticle(draftArticle.slug), null)

  const sample = await readFile(path.resolve('scripts/fixtures/sample.mp4'))
  const file = { data: sample, name: 'sample.mp4', mimetype: 'video/mp4', size: sample.length }
  const video = await payload.create({ collection: 'videos', user: admin, overrideAccess: false, data: { title: '设计验收样片', _status: 'published' }, file })
  assert.equal(video.mimeType, 'video/mp4')
  const priorCompany = await payload.findGlobal({ slug: 'company', draft: false })
  await payload.updateGlobal({ slug: 'company', user: admin, overrideAccess: false, data: { homeVideo: video.id, _status: 'published' } })
  assert.equal((await getPublicCompany())?.homeVideo?.url, video.url)
  await assert.rejects(payload.create({ collection: 'videos', user: admin, overrideAccess: false, data: { title: '假 MP4' }, file: { ...file, data: Buffer.from('not a video'), size: 11 } }))
  const forged = Buffer.from(sample)
  forged.write('fake', forged.indexOf('moov') >= 0 ? forged.indexOf('moov') : 4, 'ascii')
  await assert.rejects(payload.create({ collection: 'videos', user: admin, overrideAccess: false, data: { title: '伪造 MP4' }, file: { ...file, data: forged } }))
  await assert.rejects(payload.create({ collection: 'videos', user: admin, overrideAccess: false, data: { title: '超出上限' }, file: { ...file, size: 31 * 1024 * 1024 } }))
  await payload.updateGlobal({ slug: 'company', user: admin, overrideAccess: false, data: { homeVideo: priorCompany.homeVideo && typeof priorCompany.homeVideo === 'object' ? priorCompany.homeVideo.id : priorCompany.homeVideo || null, _status: 'published' } })
  await payload.update({ collection: 'menus', id: root.id, user: admin, overrideAccess: false, data: { _status: 'draft' } })
  assert.equal((await getPublicMenus()).some(item => item.id === third.id), false)
  assert.equal(await getPublicArticle(thirdArticle.slug), null)
  await payload.update({ collection: 'menus', id: root.id, user: admin, overrideAccess: false, data: { _status: 'published' } })
  await payload.updateGlobal({ slug: 'company', user: admin, overrideAccess: false, data: { homeVideo: video.id, _status: 'published' } })
  console.log('PASS: 三级菜单、每级独立文章、草稿隔离、祖先下线隐藏、循环/第四级/重复标识/删除限制。')
  console.log('PASS: MP4 上传、首页关联、伪造格式与超限拒绝。')
} finally {
  await payload.destroy()
}
