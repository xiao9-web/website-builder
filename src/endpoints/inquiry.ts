import { createHash } from 'node:crypto'
import type { Endpoint, PayloadRequest } from 'payload'

const maxBodyBytes = 16 * 1024
const windowMs = 15 * 60 * 1000
const attempts = new Map<string, { count: number; expires: number }>()
let globalWindow = { count: 0, expires: 0 }

function rateAllowed(req: PayloadRequest) {
  const now = Date.now()
  if (globalWindow.expires < now) globalWindow = { count: 0, expires: now + 60_000 }
  globalWindow.count += 1
  if (globalWindow.count > 60) return false
  // Only use a proxy-supplied IP when deployment explicitly trusts a proxy
  // that overwrites this header; otherwise use a shared bounded bucket.
  const ip = process.env.TRUST_PROXY_IP === 'true' ? req.headers.get('x-real-ip') || 'unknown' : 'local'
  const key = createHash('sha256').update(ip).digest('hex')
  for (const [storedKey, value] of attempts) if (value.expires < now) attempts.delete(storedKey)
  const bucket = attempts.get(key) ?? { count: 0, expires: now + windowMs }
  bucket.count += 1
  if (attempts.size >= 2000 && !attempts.has(key)) return false
  attempts.set(key, bucket)
  return bucket.count <= 5
}

async function boundedJSON(req: PayloadRequest): Promise<Record<string, unknown>> {
  const length = req.headers.get('content-length')
  if (length && (!/^\d+$/.test(length) || Number(length) > maxBodyBytes)) throw new Error('size')
  if (!req.body) throw new Error('invalid')
  const reader = req.body.getReader()
  let timedOut = false
  const timeout = setTimeout(() => { timedOut = true; void reader.cancel() }, 10_000)
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > maxBodyBytes) { await reader.cancel(); throw new Error('size') }
      chunks.push(value)
    }
  } finally { clearTimeout(timeout); reader.releaseLock() }
  if (timedOut) throw new Error('invalid')
  const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('invalid')
  return parsed as Record<string, unknown>
}

function text(value: unknown, max: number, required = false): string {
  if (value === undefined || value === null) {
    if (required) throw new Error('required')
    return ''
  }
  if (typeof value !== 'string') throw new Error('invalid')
  const cleaned = value.trim()
  if (cleaned.length > max || (required && cleaned.length === 0) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(cleaned)) throw new Error('invalid')
  return cleaned
}

const response = (status: number, error?: string) => Response.json(error ? { ok: false, error } : { ok: true }, {
  status, headers: { 'Cache-Control': 'no-store', ...(status === 429 ? { 'Retry-After': '900' } : {}) },
})

export const purchaseInquiry: Endpoint = {
  path: '/purchase-inquiry',
  method: 'post',
  handler: async (req) => {
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers.get('content-type') ?? '')) return response(415, '请使用 JSON 格式提交。')
    const origin = req.headers.get('origin')
    const permittedOrigin = new URL(process.env.SITE_URL || 'http://127.0.0.1:3001').origin
    if (origin && origin !== permittedOrigin) return response(403, '请从官网提交采购需求。')
    if (!rateAllowed(req)) return response(429, '提交过于频繁，请稍后再试。')
    let body: Record<string, unknown>
    try { body = await boundedJSON(req) } catch (error) {
      return error instanceof Error && error.message === 'size' ? response(413, '提交内容过长。') : response(400, '提交内容格式不正确。')
    }
    let company: string, contactName: string, phone: string, email: string, requirement: string, productSlug: string
    try {
      if (text(body.website, 200)) return response(201)
      company = text(body.company, 120, true)
      contactName = text(body.contactName, 60, true)
      phone = text(body.phone, 40)
      email = text(body.email, 200)
      requirement = text(body.requirement, 2000, true)
      productSlug = text(body.productSlug, 100)
      if ((!phone && !email) || (phone && !/^[+\d ()-]{6,40}$/.test(phone)) || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) throw new Error('contact')
      if (productSlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(productSlug)) throw new Error('product')
    } catch { return response(400, '请填写有效的企业、联系人、联系方式和采购需求。') }
    try {
      let product: number | undefined
      if (productSlug) {
        const result = await req.payload.find({ collection: 'products', overrideAccess: false, draft: false, depth: 0, limit: 1,
          where: { and: [{ slug: { equals: productSlug } }, { _status: { equals: 'published' } }] } })
        if (!result.docs.length) return response(400, '该产品暂不可选，请重新选择。')
        product = result.docs[0].id
      }
      await req.payload.create({ collection: 'inquiries', overrideAccess: true, context: { publicInquiry: true },
        data: { company, contactName, phone: phone || undefined, email: email || undefined, requirement, product, status: 'new' } })
      return response(201)
    } catch {
      req.payload.logger.error('采购需求保存失败，请检查服务及数据库状态。')
      return response(500, '暂时无法保存，请稍后重试。')
    }
  },
}
