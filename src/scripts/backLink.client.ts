function bind() {
  const el = document.getElementById('back-link') as HTMLAnchorElement | null
  if (!el || el.dataset.bound === '1') return
  el.dataset.bound = '1'
  el.addEventListener('click', (e) => {
    e.preventDefault()
    if (history.length > 1) {
      history.back()
    } else {
      location.href = '/'
    }
  })
}

bind()
document.addEventListener('vt:page-swapped', bind)

