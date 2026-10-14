const menu = [
  { id: 'materials', title: '原料资料', level: 1, parent: null, desc: '原料与应用的资料入口' },
  { id: 'butter', title: '黄油原料', level: 2, parent: 'materials', desc: '黄油原料资料' },
  { id: 'baking', title: '烘焙应用', level: 3, parent: 'butter', desc: '烘焙应用资料' },
  { id: 'dairy', title: '其他乳制品', level: 2, parent: 'materials', desc: '乳制品资料' },
  { id: 'company', title: '企业信息', level: 1, parent: null, desc: '企业与合作信息' },
  { id: 'about', title: '关于我们', level: 2, parent: 'company', desc: '公司介绍资料' },
  { id: 'contact', title: '合作资料', level: 3, parent: 'about', desc: '采购沟通资料' },
]
const articles = [
  { id: 'guide', menu: 'materials', title: '原料资料如何阅读', excerpt: '带封面图的文章示例；正式内容由管理员核实后发布。', image: 'assets/butter-bright.webp' },
  { id: 'butter-guide', menu: 'butter', title: '黄油原料说明示例', excerpt: '展示二级菜单下的独立文章列表。', image: null },
  { id: 'baking-guide', menu: 'baking', title: '烘焙应用资料示例', excerpt: '展示三级菜单下可附带图片的文章。', image: 'assets/butter-dark.webp' },
  { id: 'company-guide', menu: 'company', title: '企业信息说明', excerpt: '这篇文章没有图片，文字排版仍完整。', image: null },
  { id: 'about-guide', menu: 'about', title: '公司介绍示例', excerpt: '管理端填写真实公司介绍后再发布。', image: null },
  { id: 'contact-guide', menu: 'contact', title: '采购合作资料示例', excerpt: '展示第三级菜单也可拥有文章。', image: null },
]
let selectedRoot = 'materials'
let selectedChild = 'butter'
let currentMenu = 'materials'
let currentSlide = 0
const menuPanel = document.getElementById('menu-panel')
const menuToggle = document.getElementById('menu-toggle')
const menuColumns = document.getElementById('menu-columns')
const views = ['home-view', 'list-view', 'article-view']
const byId = id => menu.find(item => item.id === id)
const children = parent => menu.filter(item => item.parent === parent)

function toast(message) {
  document.querySelector('.prototype-toast')?.remove()
  const node = document.createElement('div')
  node.className = 'prototype-toast'
  node.setAttribute('role', 'status')
  node.textContent = message
  document.body.append(node)
  setTimeout(() => node.remove(), 3600)
}
function openMenu(open = true) {
  menuPanel.hidden = !open
  menuToggle.setAttribute('aria-expanded', String(open))
  if (open) renderMenu()
}
function itemMarkup(item, active) {
  const hasChildren = children(item.id).length > 0
  return `<div class="menu-item ${active ? 'active' : ''}"><button type="button" class="branch" data-select="${item.id}" aria-label="${hasChildren ? '展开' : '选中'}${item.title}"><strong>${item.title}<span>${hasChildren ? '›' : ''}</span></strong><small>${item.desc}</small></button><button type="button" class="view-articles" data-list="${item.id}">查看本级文章 ↗</button></div>`
}
function renderMenu() {
  const roots = children(null)
  const level2 = children(selectedRoot)
  const level3 = children(selectedChild)
  menuColumns.innerHTML = [roots, level2, level3].map((items, index) => `<div class="menu-column"><h3>第${['一', '二', '三'][index]}级菜单</h3>${items.length ? items.map(item => itemMarkup(item, item.id === selectedRoot || item.id === selectedChild)).join('') : '<p class="menu-empty">没有下级菜单；本级仍可维护文章。</p>'}</div>`).join('')
}
function pathFor(id) {
  const path = []
  let current = byId(id)
  while (current) { path.unshift(current); current = current.parent ? byId(current.parent) : null }
  return path
}
function showView(id) {
  views.forEach(view => { document.getElementById(view).hidden = view !== id })
  openMenu(false)
  document.getElementById('mobile-menu').setAttribute('aria-expanded', 'false')
  document.querySelector('.top-nav').classList.remove('open')
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}
function breadcrumbs(id, last) {
  return `<button type="button" data-home>首页</button><span>›</span>${pathFor(id).map((item, index, all) => index === all.length - 1 && !last ? `<span>${item.title}</span>` : `<button type="button" data-list="${item.id}">${item.title}</button><span>›</span>`).join('')}${last ? `<span>${last}</span>` : ''}`
}
function showList(id) {
  const item = byId(id)
  if (!item) return
  currentMenu = id
  document.getElementById('list-breadcrumbs').innerHTML = breadcrumbs(id)
  document.getElementById('list-title').textContent = item.title
  document.getElementById('list-description').textContent = `这里仅列出「${item.title}」本级发布的文章，下级文章在各自菜单查看。`
  const local = articles.filter(article => article.menu === id)
  document.getElementById('article-grid').innerHTML = local.length ? local.map(article => `<button type="button" class="article-card ${article.image ? '' : 'text-only'}" data-article="${article.id}">${article.image ? `<img src="${article.image}" alt="黄油原料 AI 概念图，仅作设计示例" />` : ''}<div><small>${article.image ? '带图片文章' : '纯文字文章'} · 设计示例</small><h2>${article.title}</h2><p>${article.excerpt}</p></div></button>`).join('') : '<p>本级暂时没有已发布文章，可浏览下级菜单。</p>'
  const submenus = children(id)
  document.getElementById('children-panel').innerHTML = submenus.length ? `<h2>继续浏览下级菜单</h2>${submenus.map(child => `<button type="button" data-list="${child.id}">${child.title} ↗</button>`).join('')}` : ''
  showView('list-view')
}
function showArticle(id) {
  const article = articles.find(item => item.id === id)
  if (!article) return
  currentMenu = article.menu
  document.getElementById('article-breadcrumbs').innerHTML = breadcrumbs(article.menu, article.title)
  document.getElementById('article-title').textContent = article.title
  document.getElementById('article-lede').textContent = article.excerpt
  document.getElementById('article-image').innerHTML = article.image ? `<img src="${article.image}" alt="黄油原料 AI 概念图，仅作设计示例" />` : ''
  showView('article-view')
}
document.addEventListener('click', event => {
  const choice = event.target.closest('[data-direction-choice]')
  if (choice) {
    const direction = choice.dataset.directionChoice
    document.body.dataset.direction = direction
    document.querySelectorAll('[data-direction-choice]').forEach(button => button.setAttribute('aria-pressed', String(button === choice)))
    document.getElementById('direction-name').textContent = { a: 'A · 逐级下拉', b: 'B · 横向内容菜单', c: 'C · 内容页侧栏' }[direction]
    document.getElementById('direction-desc').textContent = { a: '紧凑传统下拉，三级逐步展开。', b: '三级同时可见；点击每级的「查看文章」进入该级列表。', c: '阅读时侧边浏览层级；首页只突出一级入口。' }[direction]
    openMenu(true)
    return
  }
  const select = event.target.closest('[data-select]')
  if (select) {
    const item = byId(select.dataset.select)
    if (item.level === 1) { selectedRoot = item.id; selectedChild = children(item.id)[0]?.id || '' }
    if (item.level === 2) selectedChild = item.id
    renderMenu()
    return
  }
  const list = event.target.closest('[data-list]')
  if (list) { showList(list.dataset.list); return }
  const article = event.target.closest('[data-article]')
  if (article) { showArticle(article.dataset.article); return }
  if (event.target.closest('[data-home]') || event.target.closest('#brand-home')) { event.preventDefault(); showView('home-view'); return }
  if (event.target.closest('[data-open-menu]')) { openMenu(true); return }
  if (event.target.closest('[data-products], [data-contact]')) { event.preventDefault(); toast('现有产品与采购咨询流程保持不变；本页只演示新增内容导航。'); return }
})
menuToggle.addEventListener('click', () => openMenu(menuPanel.hidden))
document.getElementById('menu-close').addEventListener('click', () => openMenu(false))
document.getElementById('mobile-menu').addEventListener('click', event => { const open = !document.querySelector('.top-nav').classList.contains('open'); document.querySelector('.top-nav').classList.toggle('open', open); event.currentTarget.setAttribute('aria-expanded', String(open)) })
document.getElementById('back-to-list').addEventListener('click', () => showList(currentMenu))
const slideImages = ['assets/butter-bright.webp', 'assets/butter-dark.webp']
function changeSlide(delta) { currentSlide = (currentSlide + delta + 2) % 2; document.getElementById('hero-image').src = slideImages[currentSlide]; document.getElementById('slide-count').textContent = `${currentSlide + 1} / 2` }
document.getElementById('slide-prev').addEventListener('click', () => changeSlide(-1))
document.getElementById('slide-next').addEventListener('click', () => changeSlide(1))
document.getElementById('video-play').addEventListener('click', () => {
  const video = document.createElement('video')
  video.controls = true
  video.playsInline = true
  video.preload = 'none'
  video.setAttribute('aria-label', '三秒设计样片，非真实公司宣传片')
  document.getElementById('video-frame').replaceChildren(video)
  video.src = 'assets/demo.mp4'
  video.play().catch(() => toast('浏览器阻止播放，请在播放器上再次点击播放。'))
})
renderMenu()
