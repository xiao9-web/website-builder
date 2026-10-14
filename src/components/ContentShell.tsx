import type { ReactNode } from 'react'
import type { PublicMenu } from '@/endpoints/public-content'
import { ContentNavigation } from './ContentNavigation'

export function ContentShell({ brand, menus, children }: { brand: string; menus: PublicMenu[]; children: ReactNode }) {
  return <><header className="site-header wrap content-header"><a className="brand" href="/"><b>{brand}<span className="brand-dot" aria-hidden="true" /></b><span>黄油与乳制品原料</span></a><nav aria-label="网站导航"><a href="/">首页</a><a href="/#products">产品与应用</a><ContentNavigation menus={menus} /><a className="nav-contact" href="/#contact">采购咨询 <span aria-hidden="true">↗</span></a></nav></header><main className="content-main wrap">{children}</main><footer className="site-footer wrap"><a className="brand" href="/"><b>{brand}<span className="brand-dot" aria-hidden="true" /></b></a><span>黄油与乳制品原料 · 企业采购</span><a href="/#contact">采购咨询</a></footer></>
}
