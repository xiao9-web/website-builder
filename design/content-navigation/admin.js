const sections = { menus: 'tab-menus', articles: 'tab-articles', homepage: 'tab-homepage' }
function showTab(name) {
  Object.entries(sections).forEach(([key, id]) => { document.getElementById(id).hidden = key !== name })
  document.querySelectorAll('[data-admin-tab]').forEach(button => button.classList.toggle('active', button.dataset.adminTab === name))
  window.scrollTo(0, 0)
}
function toast(text) {
  document.querySelector('.prototype-toast')?.remove()
  const node = document.createElement('div')
  node.className = 'prototype-toast'
  node.setAttribute('role', 'status')
  node.textContent = text
  document.body.append(node)
  setTimeout(() => node.remove(), 3500)
}
document.addEventListener('click', event => {
  const tab = event.target.closest('[data-admin-tab]')
  if (tab) { showTab(tab.dataset.adminTab); return }
  const editMenu = event.target.closest('[data-edit-menu]')
  if (editMenu) { document.getElementById('menu-name').value = editMenu.dataset.editMenu; document.getElementById('menu-parent').value = editMenu.dataset.parent; document.getElementById('menu-slug').value = editMenu.dataset.editMenu === '原料资料' ? 'materials' : ''; document.getElementById('menu-editor').scrollIntoView({ behavior: 'smooth' }); return }
  const addChild = event.target.closest('[data-add-child]')
  if (addChild) { document.getElementById('menu-name').value = ''; document.getElementById('menu-slug').value = ''; document.getElementById('menu-parent').value = addChild.dataset.addChild; document.getElementById('menu-editor').scrollIntoView({ behavior: 'smooth' }); document.getElementById('menu-name').focus(); return }
  if (event.target.closest('#new-root')) { document.getElementById('menu-name').value = ''; document.getElementById('menu-slug').value = ''; document.getElementById('menu-parent').value = ''; document.getElementById('menu-name').focus(); return }
  const menuArticles = event.target.closest('[data-show-articles]')
  if (menuArticles) { showTab('articles'); document.getElementById('article-menu').value = menuArticles.dataset.showArticles; return }
  const editArticle = event.target.closest('[data-edit-article]')
  if (editArticle) { document.getElementById('article-title').value = editArticle.dataset.editArticle; document.getElementById('article-menu').value = editArticle.dataset.articleMenu; document.getElementById('cover-hint').textContent = editArticle.dataset.articleCover ? '当前示例有封面图；真实上传功能在第 3 步接入。' : '当前示例无封面图；可以只发布文字文章。'; document.getElementById('article-title').focus(); return }
  if (event.target.closest('#new-article')) { document.getElementById('article-title').value = ''; document.getElementById('article-title').focus(); return }
  if (event.target.closest('[data-draft]')) { toast('设计原型：草稿操作已演示，数据没有保存。'); return }
  if (event.target.closest('[data-mock]')) { toast('设计原型：正式后台会提供此操作。'); return }
})
document.querySelectorAll('form').forEach(form => form.addEventListener('submit', event => { event.preventDefault(); toast('设计原型：发布操作已演示，数据没有保存。') }))
