'use client'

import { useEffect, useRef, useState } from 'react'
import type { PublicMenu } from '@/endpoints/public-content'

export function ContentNavigation({ menus }: { menus: PublicMenu[] }) {
  const roots = menus.filter(item => item.parentId === null)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const [rootId, setRootId] = useState(roots[0]?.id || 0)
  const children = (id: number) => menus.filter(item => item.parentId === id)
  const second = children(rootId)
  const [secondId, setSecondId] = useState(second[0]?.id || 0)
  const currentSecond = second.some(item => item.id === secondId) ? secondId : second[0]?.id || 0
  const columns = [roots, second, children(currentSecond)]

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus() } }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [])

  if (!roots.length) return null
  return <div className="content-nav">
    <button className="content-nav-toggle" ref={toggleRef} type="button" aria-expanded={open} aria-controls="content-nav-panel" onClick={() => setOpen(value => !value)}>内容导航 <span aria-hidden="true">⌄</span></button>
    {open && <div className="content-nav-panel" id="content-nav-panel" role="region" aria-label="三级内容菜单">
      <div className="content-nav-heading"><div><p>资料中心</p><h2>浏览企业内容</h2></div><button type="button" aria-label="关闭内容菜单" onClick={() => { setOpen(false); toggleRef.current?.focus() }}>×</button></div>
      <div className="content-nav-columns">{columns.map((items, level) => <div className="content-nav-column" key={level}><h3>第{['一', '二', '三'][level]}级菜单</h3>{items.length ? items.map(item => <div className="content-nav-item" key={item.id}>
        <a href={`/content/${item.slug}`} onClick={() => setOpen(false)}>{item.title}<small>查看本级文章 ↗</small></a>
        {level < 2 && children(item.id).length > 0 && <button type="button" aria-label={`展开${item.title}下级`} aria-pressed={level === 0 ? rootId === item.id : currentSecond === item.id} onClick={() => { if (level === 0) { setRootId(item.id); setSecondId(children(item.id)[0]?.id || 0) } else setSecondId(item.id) }}>›</button>}
      </div>) : <p className="content-nav-empty">此级暂无菜单</p>}</div>)}</div>
    </div>}
  </div>
}
