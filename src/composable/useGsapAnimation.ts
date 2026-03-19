import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useGsapAnimation() {
  gsap.registerPlugin(ScrollTrigger)
  
  const fadeInUp = (element: string | HTMLElement, options?: gsap.TweenVars) => {
    const config: gsap.TweenVars = {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      ...options
    }

    if (options?.scrollTrigger !== null) {
      config.scrollTrigger = {
        trigger: element as any,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
        ...(options?.scrollTrigger as any)
      }
    } else {
      delete config.scrollTrigger
    }

    return gsap.from(element, config)
  }

  const staggerReveal = (elements: string | HTMLElement[], options?: gsap.TweenVars) => {
    const config: gsap.TweenVars = {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
      ...options
    }

    if (options?.scrollTrigger !== null) {
      config.scrollTrigger = {
        trigger: (elements instanceof Array ? elements[0] : elements) as any,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
        ...(options?.scrollTrigger as any)
      }
    } else {
      delete config.scrollTrigger
    }

    return gsap.from(elements, config)
  }

  const init3DFadeIn = (selector: string, options?: { delay?: number; trigger?: string | HTMLElement }) => {
    return gsap.from(selector, {
      opacity: 0,
      scale: 0,
      rotation: 180,
      duration: 1.5,
      stagger: 0.2,
      ease: 'elastic.out(1, 0.5)',
      delay: options?.delay || 0,
      scrollTrigger: options?.trigger ? {
        trigger: options.trigger,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      } : undefined
    })
  }

  const wordByWordReveal = (selector: string, options?: { delay?: number; trigger?: string | HTMLElement }) => {
    return gsap.from(selector, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      delay: options?.delay || 0,
      scrollTrigger: options?.trigger ? {
        trigger: options.trigger,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      } : undefined
    })
  }

  const timelineDrawAnimation = (selector: string, options?: { trigger?: string | HTMLElement }) => {
    return gsap.from(selector, {
      height: 0,
      duration: 2,
      ease: 'power2.inOut',
      scrollTrigger: options?.trigger ? {
        trigger: options.trigger,
        start: 'top 60%',
        toggleActions: 'play none none reverse'
      } : undefined
    })
  }

  const parallax = (element: string | HTMLElement, speed: number) => {
    return gsap.to(element, {
      y: (_index: number, _target: Element) => {
        const scrollHeight = document.documentElement.scrollHeight
        return -speed * (scrollHeight / 100)
      },
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })
  }

  return { fadeInUp, staggerReveal, init3DFadeIn, wordByWordReveal, timelineDrawAnimation, parallax, gsap, ScrollTrigger }
}
