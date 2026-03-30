<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from "vue"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import HeroSection from '../components/landing/HeroSection.vue'
import AboutSection from '../components/landing/AboutSection.vue'
import StorySection from '../components/landing/StorySection.vue'
import FeaturesSection from '../components/landing/FeaturesSection.vue'
import TestimonialsSection from '../components/landing/TestimonialsSection.vue'
import CtaSection from '../components/landing/CtaSection.vue'

gsap.registerPlugin(ScrollTrigger)

let ctx: gsap.Context

onMounted(async () => {
  await nextTick()

  window.scrollTo(0, 0)

  ctx = gsap.context(() => {

    const sections = gsap.utils.toArray<HTMLElement>(".section")

    sections.forEach((section) => {

      const elements = section.children

      gsap.from(elements, {
        opacity: 0,
        y: 60,
        filter: "blur(10px)",
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        }
      })

      const parallax = section.querySelectorAll(".parallax")

      gsap.to(parallax, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        }
      })

    })

    ScrollTrigger.refresh()

  })

})

onUnmounted(() => {
  ctx?.revert()
  ScrollTrigger.killAll()
})
</script>

<template>
  <div class="bg-background flex flex-col pt-16">

    <div class="section">
      <HeroSection />
    </div>

    <div class="section">
      <AboutSection />
    </div>

    <div class="section">
      <StorySection />
    </div>

    <div class="section">
      <FeaturesSection />
    </div>

    <div class="section">
      <TestimonialsSection />
    </div>

    <div class="section">
      <CtaSection />
    </div>

  </div>
</template>