import Lenis from 'lenis'

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({ duration: 1.2, easing: (t: number) => 1 - Math.pow(1 - t, 3) })
  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}

