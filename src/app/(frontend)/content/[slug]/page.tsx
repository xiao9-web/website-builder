import { notFound } from 'next/navigation'
import { ContentShell } from '@/components/ContentShell'
import { getPublicArticlesForMenu, getPublicCompany, getPublicMenus } from '@/endpoints/public-content'

export const dynamic = 'force-dynamic'

export default async function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [company, menus] = await Promise.all([getPublicCompany(), getPublicMenus()])
  const menu = menus.find(item => item.slug === slug)
  if (!company || !menu) notFound()
  const articles = await getPublicArticlesForMenu(menu.id)
  const path = []
  let current: typeof menu | undefined = menu
  while (current) { path.unshift(current); current = menus.find(item => item.id === current?.parentId) }
  const children = menus.filter(item => item.parentId === menu.id)
  return <ContentShell brand={company.brandName} menus={menus}>
    <nav className="content-breadcrumbs" aria-label="当前位置"><a href="/">首页</a>{path.map((item, index) => <span key={item.id}><span aria-hidden="true"> › </span>{index === path.length - 1 ? item.title : <a href={`/content/${item.slug}`}>{item.title}</a>}</span>)}</nav>
    <div className="content-page-heading"><p className="section-kicker">本级文章</p><h1>{menu.title}</h1><p>以下仅列出「{menu.title}」本级的已发布文章。</p></div>
    {articles.length > 0 ? <div className="content-article-grid">{articles.map(article => <a className={`content-article-card ${article.cover ? '' : 'without-image'}`} href={`/articles/${article.slug}`} key={article.slug}>{article.cover && <img src={article.cover.url || ''} alt={article.cover.alt || article.title} loading="lazy" />}<div>{article.isDemo && <small>演示文章 · 待替换真实资料</small>}<h2>{article.title}</h2>{article.summary && <p>{article.summary}</p>}<span>阅读文章 ↗</span></div></a>)}</div> : <div className="content-empty"><p>此级暂时没有已发布文章。</p>{children.length > 0 ? <p>可继续浏览下级菜单。</p> : <a href="/#contact">沟通采购需求 ↗</a>}</div>}
    {children.length > 0 && <div className="content-children"><h2>继续浏览下级菜单</h2>{children.map(item => <a href={`/content/${item.slug}`} key={item.id}>{item.title} ↗</a>)}</div>}
  </ContentShell>
}
