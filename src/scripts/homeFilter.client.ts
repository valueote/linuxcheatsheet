const form = document.querySelector('form[role="search"]') as HTMLFormElement | null
const input = form?.querySelector('input[name="q"]') as HTMLInputElement | null
const tagBtn = document.getElementById('tag-filter-btn') as HTMLButtonElement | null
const tagMenu = document.getElementById('tag-menu') as HTMLDivElement | null
const tagLabel = document.getElementById('tag-filter-label') as HTMLSpanElement | null
const grid = document.getElementById('cards') as HTMLElement | null

if (form && input && grid) {
  const cards = Array.from(grid.querySelectorAll<HTMLAnchorElement>('a[href^="/commands/"]'))
  const items = cards.map((el) => ({
    el,
    text: `${(el.textContent || '').toLowerCase()} ${el.getAttribute('href') || ''}`,
    tags: (el.getAttribute('data-tags') || '').split(',').filter(Boolean)
  }))

  let nores = document.getElementById('no-results') as HTMLElement | null
  if (!nores) {
    nores = document.createElement('p')
    nores.id = 'no-results'
    nores.className = 'mt-8 text-center text-fg-muted'
    nores.textContent = '未找到匹配的命令'
    nores.style.display = 'none'
    grid.after(nores)
  }

  function apply(q: string, tag: string) {
    const needle = q.trim().toLowerCase()
    const t = (tag || '').trim()
    let shown = 0
    for (const { el, text, tags } of items) {
      const okText = !needle || text.includes(needle)
      const okTag = !t || tags.includes(t)
      const ok = okText && okTag
      el.classList.toggle('hidden', !ok)
      if (ok) shown++
    }
    if (nores) nores.style.display = shown ? 'none' : ''
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    // Enter: if only one visible, navigate to it
    const visible = items.filter(({ el }) => !el.classList.contains('hidden'))
    if (visible.length === 1) {
      visible[0].el.click()
    }
  })

  input.addEventListener('input', () => apply(input.value, tagBtn?.dataset.value || ''))

  // Tag dropdown interactions
  function openMenu() {
    if (!tagMenu || !tagBtn) return
    // Ensure menu width matches the button
    tagMenu.style.minWidth = `${tagBtn.offsetWidth}px`
    tagMenu.classList.remove('hidden')
    tagBtn.setAttribute('aria-expanded', 'true')
  }
  function closeMenu() {
    if (!tagMenu || !tagBtn) return
    tagMenu.classList.add('hidden')
    tagBtn.setAttribute('aria-expanded', 'false')
  }
  function toggleMenu() {
    if (!tagMenu) return
    tagMenu.classList.contains('hidden') ? openMenu() : closeMenu()
  }

  tagBtn?.addEventListener('click', (e) => { e.preventDefault(); toggleMenu() })

  document.addEventListener('pointerdown', (e) => {
    const t = e.target as HTMLElement
    if (!t) return
    if (t.closest('#tag-menu') || t.closest('#tag-filter-btn')) return
    closeMenu()
  })

  tagMenu?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('[data-tag]') as HTMLButtonElement | null
    if (!btn) return
    const value = btn.getAttribute('data-tag') || ''
    if (tagBtn) tagBtn.dataset.value = value
    if (tagLabel) tagLabel.textContent = value || '全部标签'
    // update aria-checked
    tagMenu.querySelectorAll('[role="menuitemradio"]').forEach((el) => el.setAttribute('aria-checked', String((el as HTMLElement).getAttribute('data-tag') === value)))
    apply(input.value, value)
    closeMenu()
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!tagMenu?.classList.contains('hidden')) closeMenu()
    }
  })
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = ''
      apply('')
    }
  })

  // Initialize from URL ?q=
  const params = new URLSearchParams(location.search)
  const initialQ = params.get('q') || ''
  const initialTag = params.get('tag') || ''
  if (initialQ) input.value = initialQ
  if (tagBtn) tagBtn.dataset.value = initialTag
  if (tagLabel) tagLabel.textContent = initialTag || '全部标签'
  // update menu aria-checked initial state
  tagMenu?.querySelectorAll('[role="menuitemradio"]').forEach((el) => el.setAttribute('aria-checked', String((el as HTMLElement).getAttribute('data-tag') === (initialTag || ''))))
  apply(input.value, initialTag)
}
