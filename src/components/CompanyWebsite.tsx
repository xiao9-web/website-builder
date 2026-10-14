'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { PublicMenu, PublicVideo } from '@/endpoints/public-content'
import { ContentNavigation } from './ContentNavigation'
import { HomeVideo } from './HomeVideo'

type MediaView = { url: string; alt: string; isConcept?: boolean }
export type CompanyView = {
  brandName: string
  companyName: string | null
  headline: string
  intro: string
  businessScope: string
  advantages: { title: string; description?: string | null }[]
  phone: string | null
  email: string | null
  address: string | null
  heroImage: MediaView | null
  heroSlides: MediaView[]
  homeVideo: PublicVideo | null
}
export type ProductView = {
  name: string
  slug: string
  category: 'butter' | 'dairy'
  summary: string
  specification: string | null
  packaging: string | null
  applications: { label: string }[]
  image: MediaView | null
  isDemo: boolean
}

const categoryName = { butter: '黄油原料', dairy: '乳制品原料' }
const conceptSlide: MediaView = { url: '/assets/butter-bright.webp', alt: '黄油与可颂的 AI 原料概念摄影', isConcept: true }
const conceptAboutImage: MediaView = { url: '/assets/butter-dark.webp', alt: '黄油原料 AI 概念摄影', isConcept: true }
const applicationPrompts = [
  { title: '烘焙生产', description: '围绕烘焙应用，讨论原料与风味需求。' },
  { title: '食品加工', description: '结合产品方向，确认应用与采购信息。' },
  { title: '企业采购', description: '整理所需产品资料与采购计划。' },
]

export function CompanyWebsite({ company, products, menus, demoMode }: { company: CompanyView; products: ProductView[]; menus: PublicMenu[]; demoMode: boolean }) {
  const [category, setCategory] = useState<'all' | ProductView['category']>('all')
  const [detail, setDetail] = useState<ProductView | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<ProductView | null>(null)
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<{ kind: 'success' | 'error'; message: string } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [heroHovered, setHeroHovered] = useState(false)
  const [heroFocused, setHeroFocused] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const contactInput = useRef<HTMLInputElement>(null)
  const requirementInput = useRef<HTMLTextAreaElement>(null)
  const catalog = products.filter(product => category === 'all' || product.category === category)
  const brand = company.brandName || '春昌'
  const suppliedSlides = company.heroSlides?.filter(slide => slide.url) || []
  const slides = suppliedSlides.length > 0 ? suppliedSlides : company.heroImage?.url ? [company.heroImage] : [conceptSlide]
  const aboutImage = suppliedSlides[1] || suppliedSlides[0] || conceptAboutImage
  const slideIndex = activeSlide % slides.length
  const showingConcept = Boolean(slides[slideIndex].isConcept)
  const playing = slides.length > 1 && !userPaused && !prefersReducedMotion && !heroHovered && !heroFocused && pageVisible

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setPrefersReducedMotion(motion.matches)
    const updateVisibility = () => setPageVisible(!document.hidden)
    updateMotion()
    updateVisibility()
    motion.addEventListener('change', updateMotion)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => {
      motion.removeEventListener('change', updateMotion)
      document.removeEventListener('visibilitychange', updateVisibility)
    }
  }, [])

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setActiveSlide(index => (index + 1) % slides.length), 6000)
    return () => window.clearInterval(timer)
  }, [playing, slides.length])

  function selectCategory(value: 'all' | ProductView['category']) {
    setCategory(value)
    setMenuOpen(false)
  }

  function changeSlide(direction: -1 | 1) {
    setActiveSlide(index => (index + direction + slides.length) % slides.length)
    setUserPaused(true)
  }

  function openProduct(product: ProductView) {
    setDetail(product)
    dialog.current?.showModal()
  }

  function focusContact(prompt?: string) {
    setResult(null)
    document.getElementById('contact')?.scrollIntoView({ behavior: prefersReducedMotion ? 'instant' : 'smooth' })
    if (prompt && requirementInput.current && !requirementInput.current.value.trim()) {
      requirementInput.current.value = `应用方向：${prompt}。请填写所需原料、规格与采购计划。`
    }
    contactInput.current?.focus({ preventScroll: true })
  }

  function inquireAboutProduct() {
    const product = detail
    setSelectedProduct(product)
    dialog.current?.close()
    focusContact(product ? `咨询产品：${product.name}` : undefined)
  }

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const form = event.currentTarget
    const values = new FormData(form)
    const field = (name: string) => String(values.get(name) || '').trim()
    if (!field('phone') && !field('email')) {
      setResult({ kind: 'error', message: '请填写联系电话或邮箱，便于回复您的采购需求。' })
      return
    }
    setPending(true)
    setResult(null)
    try {
      const response = await fetch('/api/purchase-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: field('company'), contactName: field('contactName'),
          phone: field('phone'), email: field('email'), requirement: field('requirement'),
          productSlug: selectedProduct?.slug, website: field('website'),
        }),
      })
      const data: unknown = await response.json()
      const accepted = data && typeof data === 'object' && 'ok' in data && data.ok === true
      if (!response.ok || !accepted) {
        const message = data && typeof data === 'object' && 'error' in data && typeof data.error === 'string' ? data.error : '提交未成功，请稍后重试。'
        setResult({ kind: 'error', message })
        return
      }
      form.reset()
      setSelectedProduct(null)
      setResult({ kind: 'success', message: '采购需求已收到，感谢您的关注。我们将通过您留下的联系方式进一步沟通。' })
    } catch {
      setResult({ kind: 'error', message: '暂时无法确认提交结果，请检查网络后重试，或使用公开联系方式与我们沟通。' })
    } finally {
      setPending(false)
    }
  }

  return <>
    {demoMode && <div className="demo-banner">试用环境 · 询盘会保存到试用后台；示例目录与原料示意图待真实资料替换。</div>}
    <main id="home">
      <header className="site-header wrap">
        <a className="brand" href="#home" aria-label={`${brand}首页`}><b>{brand}<span className="brand-dot" aria-hidden="true" /></b><span>黄油与乳制品原料</span></a>
        <button className="mobile-menu" type="button" aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen(open => !open)}>{menuOpen ? '关闭' : '菜单'}</button>
        <nav id="site-nav" className={menuOpen ? 'open' : ''} aria-label="网站导航"><a href="#home" onClick={() => setMenuOpen(false)}>首页</a><a href="#products" onClick={() => setMenuOpen(false)}>产品与应用</a><ContentNavigation menus={menus} /><a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>采购咨询 <span aria-hidden="true">↗</span></a></nav>
      </header>
      <section className="hero" aria-label="首页介绍" onMouseEnter={() => setHeroHovered(true)} onMouseLeave={() => setHeroHovered(false)} onFocusCapture={() => setHeroFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeroFocused(false) }}>
        <img className="hero-photo" src={slides[slideIndex].url} alt={slides[slideIndex].alt} fetchPriority="high" />
        <div className="hero-content wrap"><p className="hero-category">面向食品加工与烘焙采购</p><h1>{company.headline || '风味，从原料开始。'}</h1><p className="hero-summary">{company.intro}</p><div className="hero-actions"><a className="button button-green" href="#products">探索产品</a><a className="hero-contact" href="#contact">沟通采购需求</a></div></div>
        {showingConcept && <span className="image-caption">原料示意图</span>}
        {slides.length > 1 && <div className="carousel-controls" role="group" aria-label="首页图片轮播"><button type="button" aria-label="上一张图片" onClick={() => changeSlide(-1)}>←</button><span aria-live="off">{slideIndex + 1} / {slides.length}</span><button type="button" aria-label="下一张图片" onClick={() => changeSlide(1)}>→</button><button type="button" className="play-toggle" disabled={prefersReducedMotion} onClick={() => setUserPaused(paused => !paused)}>{prefersReducedMotion ? '已关闭自动轮播' : userPaused ? '播放轮播' : '暂停轮播'}</button></div>}
      </section>
      <div className="category-strip wrap"><span>您的原料采购，从这里开始</span><a href="#products" onClick={() => selectCategory('butter')}>黄油原料 <span aria-hidden="true">↗</span></a><a href="#products" onClick={() => selectCategory('dairy')}>乳制品原料 <span aria-hidden="true">↗</span></a><a href="#contact">企业采购沟通 <span aria-hidden="true">↗</span></a></div>
      <section id="products" className="section wrap"><div className="section-heading"><div><p className="section-kicker">产品与应用</p><h2>找到适合您产品的原料。</h2></div><p>食品加工、烘焙应用。<br />按原料类别，开启采购沟通。</p></div><div className="filters" role="group" aria-label="筛选原料类别">{(['all', 'butter', 'dairy'] as const).map(value => <button type="button" key={value} aria-pressed={category === value} onClick={() => selectCategory(value)}>{value === 'all' ? '全部原料' : categoryName[value]}</button>)}</div>
        {catalog.length > 0 ? <div className={`catalog ${catalog.length === 1 ? 'filtered' : ''}`}>{catalog.map(product => <article className="ingredient" key={product.slug}><div className={product.image ? 'product-photo' : 'dairy-art'}>{product.image ? <><img src={product.image.url} alt={product.image.alt} loading="lazy" />{product.isDemo && <span>产品示意图</span>}</> : <><span>{categoryName[product.category]}</span><b>原料 · 应用</b><div className="milk-lines" aria-hidden="true" /><p>产品图片待补充</p></>}</div><div className="product-copy"><div><p>{categoryName[product.category]}</p><h3>{product.name}</h3></div><button className="round-action" type="button" onClick={() => openProduct(product)} aria-label={`查看${product.name}详情`}>↗</button></div><p className="product-description">{product.summary}</p>{product.isDemo && <p className="product-demo-note">示例产品，待替换真实资料</p>}</article>)}</div> : <div className="empty-catalog"><p>产品资料正在整理，可提交采购需求，与我们进一步沟通。</p><a href="#contact">沟通采购需求 →</a></div>}
        <div className="catalog-note"><span>具体规格与供货信息，请联系确认。</span><a href="#contact">需要具体产品资料？联系采购</a></div>
      </section>
      <section className="applications"><div className="wrap"><div className="application-heading"><h2>原料，进入您的生产场景。</h2><p>以应用需求为起点，展开产品沟通。</p></div><div className="application-list">{applicationPrompts.map(item => <button type="button" key={item.title} onClick={() => focusContact(item.title)}><span>{item.title}</span><p>{item.description}</p><span className="application-arrow" aria-hidden="true">↗</span></button>)}</div></div></section>
      <section id="about" className="about-section wrap"><div className="about-photo"><img src={aboutImage.url} alt={aboutImage.alt} loading="lazy" />{aboutImage.isConcept && <span>原料示意图</span>}</div><div className="about-copy"><p className="section-kicker">关于{brand}</p><h2>把原料说清楚。<br />让采购更有方向。</h2><p>{company.businessScope}</p>{company.advantages.length > 0 && <div className="about-advantages">{company.advantages.map((item, index) => <p key={`${item.title}-${index}`}><strong>{item.title}</strong>{item.description && <span> · {item.description}</span>}</p>)}</div>}<a href="#contact" className="button button-outline">与我们沟通</a></div></section>
      {company.homeVideo && <HomeVideo video={company.homeVideo} />}
      <section id="contact" className="contact-section"><div className="wrap contact-layout"><div className="contact-copy"><p>采购合作</p><h2>下一份采购，<br />从一次沟通开始。</h2><p>告诉我们您的产品方向与采购需求。</p><div className="contact-mark" aria-hidden="true">{brand}<span>黄油与乳制品原料</span></div>{(company.phone || company.email || company.address) && <div className="contact-details">{company.phone && <a href={`tel:${company.phone}`}>{company.phone}</a>}{company.email && <a href={`mailto:${company.email}`}>{company.email}</a>}{company.address && <p>{company.address}</p>}</div>}</div>
        <form className="inquiry-form" onSubmit={submitInquiry} aria-busy={pending}><div className="form-heading"><h3>沟通您的采购需求</h3><p>联系方式仅用于本次采购沟通。</p></div>{selectedProduct && <div className="selected-product">咨询产品：{selectedProduct.name}<button type="button" onClick={() => setSelectedProduct(null)}>取消选择</button></div>}<div className="form-fields"><label>企业名称 *<input name="company" autoComplete="organization" maxLength={120} required placeholder="您的企业名称" ref={contactInput} /></label><label>联系人 *<input name="contactName" autoComplete="name" maxLength={60} required placeholder="您的称呼" /></label><label>联系电话<input name="phone" type="tel" autoComplete="tel" maxLength={40} pattern="[+0-9\s\(\)\-]{6,40}" placeholder="电话或邮箱至少填写一项" /></label><label>联系邮箱<input name="email" type="email" autoComplete="email" maxLength={200} placeholder="便于回复的联系邮箱" /></label><label className="wide">采购需求 *<textarea name="requirement" required maxLength={2000} ref={requirementInput} placeholder="所需原料、应用方向、采购计划" /></label></div><div className="form-honeypot" aria-hidden="true"><label>网站<input name="website" tabIndex={-1} autoComplete="off" /></label></div><button className="button button-green" type="submit" disabled={pending}>{pending ? '正在提交…' : '提交采购需求'}</button><p className={`form-status ${result?.kind === 'error' ? 'error' : ''}`} role="status" aria-live="polite">{result?.message || '请至少留下联系电话或邮箱。'}</p></form></div></section>
      <footer className="site-footer wrap"><a className="brand" href="#home"><b>{brand}<span className="brand-dot" aria-hidden="true" /></b></a><span>{company.companyName || '黄油与乳制品原料 · 企业采购'}</span><a href="#contact">采购咨询</a></footer>
    </main>
    <dialog className="detail-dialog" ref={dialog} aria-labelledby="product-detail-title"><div className="dialog-header"><span>原料产品</span><button type="button" className="dialog-close" aria-label="关闭产品详情" onClick={() => dialog.current?.close()}>×</button></div><h2 id="product-detail-title">{detail?.name}</h2><p className="detail-summary">{detail?.summary}</p><dl><div><dt>原料类型</dt><dd>{detail ? categoryName[detail.category] : ''}</dd></div>{detail && detail.applications.length > 0 && <div><dt>应用方向</dt><dd>{detail.applications.map(item => item.label).join('、')}</dd></div>}{detail?.specification && <div><dt>产品规格</dt><dd>{detail.specification}</dd></div>}{detail?.packaging && <div><dt>包装信息</dt><dd>{detail.packaging}</dd></div>}<div><dt>供货沟通</dt><dd>请联系确认适用规格与供货信息。</dd></div></dl>{detail?.isDemo && <p className="dialog-note">示例产品，待替换真实资料，不构成实际供货承诺。</p>}<button type="button" className="button button-green" onClick={inquireAboutProduct}>咨询该产品 ↗</button></dialog>
  </>
}
