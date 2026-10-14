import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { getPayload, type PayloadRequest } from 'payload'
import sharp from 'sharp'
import config from '../src/payload.config'
import { getPublicCompany, getPublicProduct } from '../src/endpoints/public-content'
import { purchaseInquiry } from '../src/endpoints/inquiry'

const databaseURL = process.env.DATABASE_URL
if (!databaseURL?.startsWith('file:') || !path.basename(new URL(databaseURL).pathname).startsWith('verification-')) {
  throw new Error('后端验证必须使用独立的 data/verification-*.sqlite 数据库。')
}
const payload = await getPayload({ config })
const marker = '自动验证询盘（非客户）'
const readOnly = process.argv.includes('--persistence-read')
try {
  if (readOnly) {
    const persisted = await payload.find({ collection: 'inquiries', where: { company: { equals: marker } }, limit: 1 })
    assert.ok(persisted.totalDocs >= 1)
    assert.equal(persisted.docs[0].status, 'new')
    console.log('PASS: 新进程读取已持久化的验证询盘。')
  } else {
    const users = await payload.find({ collection: 'users', limit: 1 })
    assert.ok(users.docs[0], '先运行 bootstrap')
    const admin = { ...users.docs[0], collection: 'users' as const }
    const slug = `verify-${randomUUID()}`
    const product = await payload.create({ collection: 'products', user: admin, overrideAccess: false, data: {
      name: '自动验证产品（非在售）', slug, category: 'butter', summary: '自动验证发布流程。', specification: '草稿初值', _status: 'draft', isDemo: true,
    } })
    assert.equal(await getPublicProduct(slug), null)
    await payload.update({ collection: 'products', id: product.id, user: admin, overrideAccess: false, data: { _status: 'published', specification: '已发布值' } })
    assert.equal((await getPublicProduct(slug))?.specification, '已发布值')
    await payload.update({ collection: 'products', id: product.id, user: admin, overrideAccess: false, draft: true, data: { _status: 'draft', specification: '未发布修改' } })
    assert.equal((await getPublicProduct(slug))?.specification, '已发布值')
    await payload.update({ collection: 'products', id: product.id, user: admin, overrideAccess: false, data: { _status: 'draft' } })
    assert.equal(await getPublicProduct(slug), null)
    await assert.rejects(payload.findByID({ collection: 'products', id: product.id, overrideAccess: false }))
    await assert.rejects(payload.findVersions({ collection: 'products', overrideAccess: false }))
    await assert.rejects(payload.create({ collection: 'users', overrideAccess: false, data: { email: 'blocked@example.invalid', password: randomUUID() } }))
    await assert.rejects(payload.create({ collection: 'users', overrideAccess: true, data: { email: 'first-user-bypass@example.invalid', password: randomUUID() } }))
    await assert.rejects(payload.find({ collection: 'users', overrideAccess: false }))
    await assert.rejects(payload.findGlobal({ slug: 'company', overrideAccess: false, draft: true }))
    assert.ok(await getPublicCompany())
    await assert.rejects(payload.create({ collection: 'inquiries', overrideAccess: false, data: { company: marker, contactName: '验证', requirement: '不允许绕过表单入口', status: 'new' } }))
    await assert.rejects(payload.find({ collection: 'inquiries', overrideAccess: false }))

    const jpeg = await sharp({ create: { width: 16, height: 16, channels: 3, background: '#d8bb72' } }).jpeg().toBuffer()
    const file = { data: jpeg, mimetype: 'image/jpeg', name: 'verification.jpg', size: jpeg.length }
    const valid = await payload.create({ collection: 'media', user: admin, overrideAccess: false, data: { alt: '自动验证图片' }, file })
    assert.equal(valid.mimeType, 'image/webp')
    assert.match(valid.filename ?? '', /^[a-f0-9-]+\.webp$/)
    const previousCompany = await payload.findGlobal({ slug: 'company', draft: false })
    const previousSlides = previousCompany.heroSlides || []
    await payload.updateGlobal({ slug: 'company', user: admin, overrideAccess: false, data: {
      heroSlides: [{ image: valid.id, isConcept: true }], _status: 'published',
    } })
    assert.equal((await getPublicCompany())?.heroSlides?.[0]?.url, valid.url)
    assert.equal((await getPublicCompany())?.heroSlides?.[0]?.isConcept, true)
    await payload.updateGlobal({ slug: 'company', user: admin, overrideAccess: false, draft: true, data: {
      heroSlides: [], _status: 'draft',
    } })
    assert.equal((await getPublicCompany())?.heroSlides?.[0]?.url, valid.url)
    await payload.updateGlobal({ slug: 'company', user: admin, overrideAccess: false, data: {
      heroSlides: previousSlides, _status: 'published',
    } })
    await assert.rejects(payload.create({ collection: 'media', user: admin, overrideAccess: false, data: { alt: '伪造类型' }, file: { ...file, mimetype: 'image/png' } }))
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>')
    await assert.rejects(payload.create({ collection: 'media', user: admin, overrideAccess: false, data: { alt: '拒绝 SVG' }, file: { data: svg, mimetype: 'image/jpeg', name: 'fake.jpg', size: svg.length } }))
    await assert.rejects(payload.create({ collection: 'media', user: admin, overrideAccess: false, data: { alt: '超限文件' }, file: { ...file, size: 6 * 1024 * 1024 } }))

    async function send(body: unknown, contentType = 'application/json') {
      const req = Object.assign(new Request('http://127.0.0.1:3001/api/purchase-inquiry', { method: 'POST', headers: { 'content-type': contentType }, body: typeof body === 'string' ? body : JSON.stringify(body) }), { payload, context: {}, user: null }) as PayloadRequest
      return purchaseInquiry.handler(req)
    }
    assert.equal((await send({ company: marker, contactName: '验证联系人', email: 'verification@example.invalid', requirement: '自动验证询盘，非真实采购请求。' })).status, 201)
    assert.equal((await send({ company: marker, contactName: '验证', requirement: '缺少联系方式' })).status, 400)
    assert.equal((await send('x'.repeat(17000))).status, 413)
    assert.equal((await send({ company: marker, contactName: '验证', email: 'verification@example.invalid', requirement: '隐藏产品不可选', productSlug: slug })).status, 400)
    assert.equal((await send({ website: 'bot.example.invalid' })).status, 201)
    assert.equal((await send({})).status, 429)
    const stored = await payload.find({ collection: 'inquiries', where: { company: { equals: marker } }, depth: 0, limit: 1 })
    assert.ok(stored.totalDocs >= 1)
    assert.equal(stored.docs[0].status, 'new')
    await payload.delete({ collection: 'products', id: product.id, user: admin, overrideAccess: false })
    await payload.delete({ collection: 'media', id: valid.id, user: admin, overrideAccess: false })
    console.log('PASS: 草稿不可见、发布可见、修改草稿不影响已发布内容、取消发布后隐藏。')
    console.log('PASS: 匿名注册 / first-user 绕过 / 用户与询盘读取 / 公司草稿读取均拒绝。')
    console.log('PASS: 图片真实格式校验、重编码、伪造类型 / SVG / 超限拒绝。')
    console.log('PASS: 有效询盘持久化、联系方式校验、正文上限、隐藏产品校验、honeypot、限流。')
  }
} finally { await payload.destroy() }
