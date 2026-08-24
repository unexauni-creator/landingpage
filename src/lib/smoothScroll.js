import Lenis from "lenis";

const EASE_PREMIUM = (t) => 1 - Math.pow(1 - t, 3);

let lenisInstance = null;
let rafId = null;

export function initSmoothScroll() {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.1,
    easing: EASE_PREMIUM,
    smoothWheel: true,
  });

  function raf(time) {
    lenisInstance.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  return lenisInstance;
}

export function destroySmoothScroll() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

export function scrollToTarget(target, opts = {}) {
  if (!lenisInstance) return;
  lenisInstance.scrollTo(target, { duration: 1.1, easing: EASE_PREMIUM, ...opts });
}
