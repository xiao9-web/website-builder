import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'

if (process.env.DEMO_MODE !== 'true') throw new Error('仅可在 DEMO_MODE=true 的本地试用环境运行。')
const payload = await getPayload({ config })
try {
  const admins = await payload.find({ collection: 'users', limit: 1 })
  if (!admins.docs[0]) throw new Error('请先运行 bootstrap 创建试用管理员。')
  const admin = { ...admins.docs[0], collection: 'users' as const }
  const current = await payload.findGlobal({ slug: 'company', draft: false })
  if (current.heroSlides?.length) {
    const slides = current.heroSlides.map(slide => ({
      image: typeof slide.image === 'number' ? slide.image : slide.image.id,
      isConcept: Boolean(slide.isConcept) || (typeof slide.image === 'object' && /AI.*概念图/.test(slide.image.alt)),
    }))
    if (slides.some((slide, index) => slide.isConcept !== Boolean(current.heroSlides?.[index]?.isConcept))) {
      await payload.updateGlobal({ slug: 'company', user: admin, overrideAccess: false, data: { heroSlides: slides, _status: 'published' } })
      console.log('已给现有试用概念图补充公开标识。')
    } else console.log('已有轮播图片，保留现有配置。')
  } else {
    const assets = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/assets')
    const slides = []
    for (const [filename, alt] of [
      ['butter-bright.webp', '黄油与可颂的 AI 原料概念图'],
      ['butter-dark.webp', '黄油原料静物 AI 概念图'],
    ] as const) {
      const data = await readFile(path.join(assets, filename))
      const media = await payload.create({ collection: 'media', user: admin, overrideAccess: false, data: { alt }, file: { data, mimetype: 'image/webp', name: filename, size: data.length } })
      slides.push({ image: media.id, isConcept: true })
    }
    await payload.updateGlobal({ slug: 'company', user: admin, overrideAccess: false, data: { heroSlides: slides, _status: 'published' } })
    console.log('两张 AI 概念轮播图已加入本地试用后台。')
  }
} finally { await payload.destroy() }
