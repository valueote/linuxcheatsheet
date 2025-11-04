// Minimal cross-page View Transitions using the native API

declare global {
  interface Document {
    startViewTransition?: (updateCallback: () => void) => {
      ready: Promise<void>
      finished: Promise<void>
    }
  }
}

function isModifierKey(e: MouseEvent) {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
}

function isInternal(a: HTMLAnchorElement) {
  return a.origin === location.origin && !a.hasAttribute('download') && !a.target
}

// Remember which command card was opened so we can animate back to it
let lastDetailHref: string | null = null

async function load(url: string) {
  const res = await fetch(url, { headers: { 'X-Requested-With': 'view-transition' } })
  if (!res.ok) throw new Error('Failed to fetch: ' + url)
  const html = await res.text()
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const nextMain = doc.querySelector('main')
  if (!nextMain) throw new Error('No <main> in target document')
  return { doc, nextMain }
}

async function navigate(url: string, replace = false, originEl?: HTMLElement | null, fromHref?: string | null) {
  try {
    const { doc, nextMain } = await load(url)
    // Try to find the target element in the next document to bind as the shared element
    let nextTarget = doc.querySelector('[data-vt-target="card"]') as HTMLElement | null
    const currentMain = document.querySelector('main')
    if (!currentMain) {
      location.href = url
      return
    }

    const swap = () => {
      currentMain.replaceWith(nextMain)
      document.title = doc.title
      // Only mutate history on normal navigations. During popstate we keep the entry and its state intact
      if (!replace) history.pushState({}, '', url)
      // Scroll handling:
      // - On normal navigation, scroll to top
      // - On popstate, try restoring saved scroll from history.state
      if (!replace) {
        window.scrollTo({ top: 0 })
      } else {
        const s = history.state as any
        const y = s && typeof s.scrollY === 'number' ? s.scrollY : null
        if (y !== null) {
          requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: y })))
        }
      }
      document.dispatchEvent(new CustomEvent('vt:page-swapped'))
    }

    if (document.startViewTransition) {
      // When going back to the list (replace=true), try to target the specific card
      if (replace && !nextTarget && fromHref) {
        const path = new URL(fromHref, location.origin).pathname
        nextTarget = (doc.querySelector(`a[href="${path}"]`) || doc.querySelector(`a[href$="${path}"]`)) as HTMLElement | null
      }
      // Bind shared element only for the active card and the target wrapper to avoid zoomed blur
      if (originEl) {
        originEl.style.setProperty('view-transition-name', 'card-active')
        originEl.classList.add('vt-no-blur')
      }
      if (nextTarget) nextTarget.style.setProperty('view-transition-name', 'card-active')

      const vt = document.startViewTransition(swap)
      vt.finished.finally(() => {
        if (originEl) {
          originEl.style.removeProperty('view-transition-name')
          originEl.classList.remove('vt-no-blur')
        }
        if (nextTarget) nextTarget.style.removeProperty('view-transition-name')
      })
    } else {
      swap()
    }
  } catch (e) {
    // Fallback to full navigation
    location.href = url
  }
}

// Intercept same-origin <a> clicks
document.addEventListener('click', (e) => {
  if ((e as Event).defaultPrevented) return
  const target = e.target as HTMLElement | null
  if (!target) return
  const a = target.closest('a') as HTMLAnchorElement | null
  if (!a) return
  if (e.button !== 0 || isModifierKey(e)) return
  if (!isInternal(a)) return

  e.preventDefault()
  // Save current scroll position into history.state before leaving the page
  try {
    const prev = history.state && typeof history.state === 'object' ? history.state : {}
    history.replaceState({ ...prev, scrollY: window.scrollY }, '', location.href)
  } catch {}
  try {
    const path = new URL(a.href).pathname
    lastDetailHref = path.startsWith('/commands/') ? path : lastDetailHref
  } catch {}
  navigate(a.href, false, a)
})

// Back/forward support
window.addEventListener('popstate', () => {
  const origin = document.querySelector('[data-vt-target="card"]') as HTMLElement | null
  navigate(location.href, true, origin, lastDetailHref)
})
