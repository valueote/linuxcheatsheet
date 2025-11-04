const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const hasIO = 'IntersectionObserver' in window

function showAll() {
  document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
    el.classList.remove('hide')
    el.classList.add('show')
  })
}

function applyHide() {
  document.querySelectorAll<HTMLElement>('.reveal:not(.vt-observed)').forEach((el) => el.classList.add('hide'))
}

if (!reduced && hasIO) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        const el = e.target as HTMLElement
        el.classList.remove('hide')
        el.classList.add('show')
        io.unobserve(e.target)
      }
    }
  }, { rootMargin: '0px 0px -10% 0px' })

  const observe = () => document.querySelectorAll<HTMLElement>('.reveal:not(.vt-observed)')
    .forEach((el) => { el.classList.add('vt-observed'); io.observe(el) })

  applyHide()
  observe()
  document.addEventListener('vt:page-swapped', observe)
} else {
  // Graceful fallback when reduced motion is enabled or IO is unavailable
  showAll()
  document.addEventListener('vt:page-swapped', showAll)
}
