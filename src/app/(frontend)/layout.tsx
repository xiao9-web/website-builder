import type { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: '春昌 · 黄油与乳制品原料',
  description: '春昌面向食品加工与烘焙企业，提供黄油与乳制品原料的产品资料和采购沟通入口。',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><body>{children}</body></html>
}
