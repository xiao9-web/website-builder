import { getPublicCompany, getPublicMenus, getPublicProducts } from '@/endpoints/public-content'
import { CompanyWebsite, type CompanyView, type ProductView } from '@/components/CompanyWebsite'

export const dynamic = 'force-dynamic'

export default async function Homepage() {
  const [company, products, menus] = await Promise.all([getPublicCompany(), getPublicProducts(), getPublicMenus()])
  if (!company) {
    return <main className="error-state"><h1>网站内容正在准备</h1><p>公司介绍与产品资料确认后将在此发布。</p><a className="secondary" href="/admin">进入内容管理 ↗</a></main>
  }
  const image = (value: unknown): { url: string; alt: string } | null => {
    if (!value || typeof value !== 'object' || !('url' in value) || typeof value.url !== 'string') return null
    return { url: value.url, alt: 'alt' in value && typeof value.alt === 'string' ? value.alt : '产品图片' }
  }
  const content: CompanyView = {
    brandName: company.brandName,
    companyName: company.companyName || null,
    headline: company.headline,
    intro: company.intro,
    businessScope: company.businessScope || '',
    advantages: company.advantages || [],
    phone: company.phone || null,
    email: company.email || null,
    address: company.address || null,
    heroImage: image(company.heroImage),
    heroSlides: company.heroSlides.flatMap(slide => {
      const value = image(slide)
      return value ? [{ ...value, isConcept: slide.isConcept }] : []
    }),
    homeVideo: company.homeVideo,
  }
  const catalog: ProductView[] = products.map(product => ({
    name: product.name,
    slug: product.slug,
    category: product.category,
    summary: product.summary,
    specification: product.specification || null,
    packaging: product.packaging || null,
    applications: product.applications || [],
    image: image(product.image),
    isDemo: Boolean(product.isDemo),
  }))
  return <CompanyWebsite company={content} products={catalog} menus={menus} demoMode={process.env.DEMO_MODE === 'true'} />
}
