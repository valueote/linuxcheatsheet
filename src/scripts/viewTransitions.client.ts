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

async function load(url: string) {
  const res = await fetch(url, { headers: { 'X-Requested-With': 'view-transition' } })
  if (!res.ok) throw new Error('Failed to fetch: ' + url)
  const html = await res.text()
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const nextMain = doc.querySelector('main')
  if (!nextMain) throw new Error('No <main> in target document')
  return { doc, nextMain }
}

async function navigate(url: string, replace = false) {
  try {
    const { doc, nextMain } = await load(url)
    const currentMain = document.querySelector('main')
    if (!currentMain) {
      location.href = url
      return
    }

    const swap = () => {
      currentMain.replaceWith(nextMain)
      document.title = doc.title
      replace ? history.replaceState({}, '', url) : history.pushState({}, '', url)
      window.scrollTo({ top: 0 })
      document.dispatchEvent(new CustomEvent('vt:page-swapped'))
    }

    if (document.startViewTransition) {
      document.startViewTransition(swap)
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
  const target = e.target as HTMLElement | null
  if (!target) return
  const a = target.closest('a') as HTMLAnchorElement | null
  if (!a) return
  if (e.button !== 0 || isModifierKey(e)) return
  if (!isInternal(a)) return

  e.preventDefault()
  navigate(a.href)
})

// Back/forward support
window.addEventListener('popstate', () => navigate(location.href, true))

