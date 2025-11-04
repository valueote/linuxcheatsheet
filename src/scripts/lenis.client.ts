import Lenis from 'lenis'

// Make scrolling feel snappier by shortening duration and slightly boosting wheel speed
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({
    duration: 0.55,
    // Mild ease-out without long tail
    easing: (t: number) => 1 - Math.pow(1 - t, 2.2),
    wheelMultiplier: 1.25
  })
  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}
