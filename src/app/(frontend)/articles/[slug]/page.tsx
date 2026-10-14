import { RichText } from '@payloadcms/richtext-lexical/react'
import { notFound } from 'next/navigation'
import { ContentShell } from '@/components/ContentShell'
import { getPublicArticle, getPublicCompany, getPublicMenus } from '@/endpoints/public-content'

export const dynamic = 'force-dynamic'

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [company, menus, article] = await Promise.all([getPublicCompany(), getPublicMenus(), getPublicArticle(slug)])
  if (!company || !article) notFound()
  const menu = menus.find(item => item.id === article.menuId)
  if (!menu) notFound()
  const path = []
  let current: typeof menu | undefined = menu
  while (current) { path.unshift(current); current = menus.find(item => item.id === current?.parentId) }
  return <ContentShell brand={company.brandName} menus={menus}>
    <nav className="content-breadcrumbs" aria-label="当前位置"><a href="/">首页</a>{path.map(item => <span key={item.id}><span aria-hidden="true"> › </span><a href={`/content/${item.slug}`}>{item.title}</a></span>)}<span aria-hidden="true"> › </span><span>{article.title}</span></nav>
    <article className="content-article"><p className="section-kicker">{article.isDemo ? '演示文章 · 待替换真实资料' : menu.title}</p><h1>{article.title}</h1>{article.summary && <p className="content-article-lede">{article.summary}</p>}{article.cover && <img className="content-article-cover" src={article.cover.url || ''} alt={article.cover.alt || article.title} />}<div className="content-article-body"><RichText data={article.content} /></div><a className="button button-outline" href={`/content/${menu.slug}`}>返回本级文章 ↗</a></article>
  </ContentShell>
}
