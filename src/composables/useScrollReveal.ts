import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveal() {
  const revealFromBottom = (
    selector: string | HTMLElement,
    options?: { delay?: number; stagger?: number; trigger?: string | HTMLElement }
  ) => {
    return gsap.from(selector, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
      delay: options?.delay || 0,
      stagger: options?.stagger || 0.1,
      scrollTrigger: {
        trigger: (options?.trigger || selector) as gsap.DOMTarget,
        start: 'top 85%',
      }
    })
  }

  const revealFromSide = (
    selector: string | HTMLElement,
    direction: 'left' | 'right',
    options?: { delay?: number; trigger?: string | HTMLElement }
  ) => {
    return gsap.from(selector, {
      opacity: 0,
      x: direction === 'left' ? -32 : 32,
      duration: 0.6,
      ease: 'power2.out',
      delay: options?.delay || 0,
      scrollTrigger: {
        trigger: (options?.trigger || selector) as gsap.DOMTarget,
        start: 'top 85%',
      }
    })
  }

  const staggerIn = (
    selector: string,
    options?: { delay?: number; stagger?: number; trigger?: string | HTMLElement }
  ) => {
    return gsap.from(selector, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: options?.stagger || 0.1,
      ease: 'power2.out',
      delay: options?.delay || 0,
      scrollTrigger: {
        trigger: (options?.trigger || selector) as gsap.DOMTarget,
        start: 'top 85%',
      }
    })
  }

  const scaleLineY = (
    selector: string,
    options?: { trigger?: string | HTMLElement }
  ) => {
    return gsap.from(selector, {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 1.2,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: (options?.trigger || selector) as gsap.DOMTarget,
        start: 'top 70%',
      }
    })
  }

  return { revealFromBottom, revealFromSide, staggerIn, scaleLineY, gsap }
}
