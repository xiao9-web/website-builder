'use client'

export default function FrontendError({ reset }: { reset: () => void }) {
  return <main className="error-state" role="alert"><h1>页面暂时无法加载</h1><p>产品资料加载失败，请稍后重试或联系网站管理员。</p><button className="primary" onClick={reset}>重新加载</button></main>
}
