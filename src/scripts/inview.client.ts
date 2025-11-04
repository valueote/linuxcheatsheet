const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (!reduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        (e.target as HTMLElement).classList.add('show')
        io.unobserve(e.target)
      }
    }
  }, { rootMargin: '0px 0px -10% 0px' })

  const observe = () => document.querySelectorAll<HTMLElement>('.reveal:not(.vt-observed)')
    .forEach((el) => { el.classList.add('vt-observed'); io.observe(el) })

  observe()
  document.addEventListener('vt:page-swapped', observe)
}
