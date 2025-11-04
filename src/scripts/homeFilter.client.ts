let globalBound = false

function mountFilter() {
  const form = document.querySelector('form[role="search"]') as HTMLFormElement | null
  const input = form?.querySelector('input[name="q"]') as HTMLInputElement | null
  const tagBtn = document.getElementById('tag-filter-btn') as HTMLButtonElement | null
  const tagMenu = document.getElementById('tag-menu') as HTMLDivElement | null
  const tagLabel = document.getElementById('tag-filter-label') as HTMLSpanElement | null
  const grid = document.getElementById('cards') as HTMLElement | null

  if (!form || !input || !grid) return
  if ((form as any).dataset.bound === '1') return
  (form as any).dataset.bound = '1'

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

  function updateHistory(q: string, tag: string) {
    const url = new URL(location.href)
    if (q) url.searchParams.set('q', q)
    else url.searchParams.delete('q')
    if (tag) url.searchParams.set('tag', tag)
    else url.searchParams.delete('tag')
    const prev = history.state && typeof history.state === 'object' ? history.state : {}
    // Preserve any existing custom keys (e.g., scrollY) and store filters
    const nextState = { ...prev, q, tag }
    history.replaceState(nextState, '', url.toString())
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const visible = items.filter(({ el }) => !el.classList.contains('hidden'))
    if (visible.length === 1) {
      visible[0].el.click()
    }
  })

  input.addEventListener('input', () => {
    const tag = tagBtn?.dataset.value || ''
    apply(input.value, tag)
    updateHistory(input.value, tag)
  })

  function getTagBtn() { return document.getElementById('tag-filter-btn') as HTMLButtonElement | null }
  function getTagMenu() { return document.getElementById('tag-menu') as HTMLDivElement | null }
  function getTagLabel() { return document.getElementById('tag-filter-label') as HTMLSpanElement | null }

  function openMenu() {
    const btn = getTagBtn(); const menu = getTagMenu(); if (!menu || !btn) return
    menu.style.minWidth = `${btn.offsetWidth}px`
    menu.classList.remove('hidden')
    btn.setAttribute('aria-expanded', 'true')
  }
  function closeMenu() {
    const btn = getTagBtn(); const menu = getTagMenu(); if (!menu || !btn) return
    menu.classList.add('hidden')
    btn.setAttribute('aria-expanded', 'false')
  }
  function toggleMenu() {
    const menu = getTagMenu(); if (!menu) return
    menu.classList.contains('hidden') ? openMenu() : closeMenu()
  }

  tagBtn?.addEventListener('click', (e) => { e.preventDefault(); toggleMenu() })

  if (!globalBound) {
    document.addEventListener('pointerdown', (e) => {
      const t = e.target as HTMLElement
      if (!t) return
      const menu = getTagMenu(); const btn = getTagBtn()
      if (t.closest('#tag-menu') || t.closest('#tag-filter-btn')) return
      if (menu && btn) closeMenu()
    })
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const menu = getTagMenu()
        if (menu && !menu.classList.contains('hidden')) closeMenu()
      }
    })
    globalBound = true
  }

  tagMenu?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('[data-tag]') as HTMLButtonElement | null
    if (!btn) return
    const value = btn.getAttribute('data-tag') || ''
    const realBtn = getTagBtn(); const label = getTagLabel(); const menu = getTagMenu()
    if (realBtn) realBtn.dataset.value = value
    if (label) label.textContent = value || '全部标签'
    menu?.querySelectorAll('[role="menuitemradio"]').forEach((el) => el.setAttribute('aria-checked', String((el as HTMLElement).getAttribute('data-tag') === value)))
    apply(input.value, value)
    updateHistory(input.value, value)
    closeMenu()
  })

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = ''
      apply('')
    }
  })

  const params = new URLSearchParams(location.search)
  // Prefer history.state if available (for SPA back/forward), else URL params
  const state = (history.state && typeof history.state === 'object') ? history.state as any : {}
  const initialQ = (state.q as string) ?? params.get('q') ?? ''
  const initialTag = (state.tag as string) ?? params.get('tag') ?? ''
  if (initialQ) input.value = initialQ
  if (tagBtn) tagBtn.dataset.value = initialTag
  const label = getTagLabel(); if (label) label.textContent = initialTag || '全部标签'
  getTagMenu()?.querySelectorAll('[role="menuitemradio"]').forEach((el) => el.setAttribute('aria-checked', String((el as HTMLElement).getAttribute('data-tag') === (initialTag || ''))))
  apply(input.value, initialTag)
  // Ensure URL + history reflect current state on mount
  updateHistory(input.value, initialTag)
}

mountFilter()
document.addEventListener('vt:page-swapped', mountFilter)
