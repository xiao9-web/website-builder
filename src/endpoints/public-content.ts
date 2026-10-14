import { getPayload } from 'payload'
import config from '../payload.config'
import type { Article, Company, Media, Menu, Product, Video } from '../payload-types'

export type PublicImage = Pick<Media, 'id' | 'url' | 'alt' | 'width' | 'height'>
export type PublicProduct = Pick<Product, 'id' | 'name' | 'slug' | 'category' | 'summary' | 'specification' | 'packaging' | 'applications' | 'displayOrder' | 'isDemo'> & { image: PublicImage | null }
export type PublicVideo = { title: string; description: string | null; url: string; poster: PublicImage | null }
export type PublicMenu = { id: number; title: string; slug: string; parentId: number | null; displayOrder: number }
export type PublicArticleSummary = Pick<Article, 'title' | 'slug' | 'summary' | 'isDemo'> & { cover: PublicImage | null }
export type PublicArticle = PublicArticleSummary & { content: Article['content']; menuId: number }
export type PublicCompany = Pick<Company, 'brandName' | 'companyName' | 'headline' | 'intro' | 'businessScope' | 'advantages' | 'phone' | 'email' | 'address'> & { heroImage: PublicImage | null; heroSlides: (PublicImage & { isConcept: boolean })[]; homeVideo: PublicVideo | null }

function publicImage(value: number | Media | null | undefined): PublicImage | null {
  if (!value || typeof value === 'number') return null
  return { id: value.id, url: value.url, alt: value.alt, width: value.width, height: value.height }
}
function publicProduct(product: Product): PublicProduct {
  return { id: product.id, name: product.name, slug: product.slug, category: product.category, summary: product.summary,
    specification: product.specification, packaging: product.packaging, applications: product.applications,
    displayOrder: product.displayOrder, isDemo: product.isDemo, image: publicImage(product.image) }
}
function publicVideo(value: number | Video | null | undefined): PublicVideo | null {
  if (!value || typeof value === 'number' || value._status !== 'published' || !value.url || value.mimeType !== 'video/mp4') return null
  return { title: value.title, description: value.description || null, url: value.url, poster: publicImage(value.poster) }
}
export async function getPublicCompany(): Promise<PublicCompany | null> {
  const payload = await getPayload({ config })
  const company = await payload.findGlobal({ slug: 'company', draft: false, depth: 1, overrideAccess: true })
  if (company._status !== 'published') return null
  return { brandName: company.brandName, companyName: company.companyName, headline: company.headline, intro: company.intro,
    businessScope: company.businessScope, advantages: company.advantages, phone: company.phone, email: company.email,
    address: company.address, heroImage: publicImage(company.heroImage), homeVideo: publicVideo(company.homeVideo),
    heroSlides: (company.heroSlides || []).flatMap(slide => {
      const image = publicImage(slide.image)
      return image ? [{ ...image, isConcept: Boolean(slide.isConcept) }] : []
    }) }
}
export async function getPublicMenus(): Promise<PublicMenu[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({ collection: 'menus', draft: false, depth: 0, overrideAccess: false,
    limit: 1000, pagination: false, sort: 'displayOrder', where: { _status: { equals: 'published' } } })
  const byId = new Map<number, Menu>(result.docs.map(item => [item.id, item]))
  const visible = (item: Menu, seen = new Set<number>()): boolean => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    if (!item.parent) return true
    const parent = byId.get(typeof item.parent === 'number' ? item.parent : item.parent.id)
    return Boolean(parent && visible(parent, seen))
  }
  return result.docs.filter(item => visible(item)).map(item => ({
    id: item.id, title: item.title, slug: item.slug,
    parentId: item.parent ? typeof item.parent === 'number' ? item.parent : item.parent.id : null,
    displayOrder: item.displayOrder || 0,
  }))
}
function publicArticleSummary(article: Article): PublicArticleSummary {
  return { title: article.title, slug: article.slug, summary: article.summary, isDemo: article.isDemo, cover: publicImage(article.cover) }
}
export async function getPublicArticlesForMenu(menuId: number): Promise<PublicArticleSummary[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({ collection: 'articles', draft: false, depth: 1, overrideAccess: false,
    limit: 100, sort: '-createdAt', where: { and: [{ menu: { equals: menuId } }, { _status: { equals: 'published' } }] } })
  return result.docs.map(publicArticleSummary)
}
export async function getPublicArticle(slug: string): Promise<PublicArticle | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({ collection: 'articles', draft: false, depth: 2, overrideAccess: false,
    limit: 1, where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] } })
  const article = result.docs[0]
  if (!article) return null
  const menuId = typeof article.menu === 'number' ? article.menu : article.menu.id
  if (!(await getPublicMenus()).some(item => item.id === menuId)) return null
  return { ...publicArticleSummary(article), content: article.content, menuId }
}
export async function getPublicProducts(): Promise<PublicProduct[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({ collection: 'products', draft: false, depth: 1, overrideAccess: false,
    limit: 100, sort: 'displayOrder', where: { _status: { equals: 'published' } } })
  return result.docs.map(publicProduct)
}
export async function getPublicProduct(slug: string): Promise<PublicProduct | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({ collection: 'products', draft: false, depth: 1, overrideAccess: false,
    limit: 1, where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] } })
  return result.docs[0] ? publicProduct(result.docs[0]) : null
}
