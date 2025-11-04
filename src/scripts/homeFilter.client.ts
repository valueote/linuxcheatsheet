const form = document.querySelector('form[role="search"]') as HTMLFormElement | null
const input = form?.querySelector('input[name="q"]') as HTMLInputElement | null
const tagSelect = document.getElementById('tag-filter') as HTMLSelectElement | null
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

  input.addEventListener('input', () => apply(input.value, tagSelect?.value || ''))
  tagSelect?.addEventListener('change', () => apply(input.value, tagSelect?.value || ''))
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
  if (initialTag && tagSelect) tagSelect.value = initialTag
  apply(input.value, tagSelect?.value || '')
}
