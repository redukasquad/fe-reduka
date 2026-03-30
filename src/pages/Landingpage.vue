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

  ctx = gsap.context(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".section")

    sections.forEach((section) => {

      // ✨ Animate section only (Fix conflict)
      gsap.from(section, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
        }
      })

      // 🌊 Parallax
      const parallax = section.querySelectorAll(".parallax")

      if (parallax.length) {
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
      }
    })

    ScrollTrigger.refresh()
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <div class="bg-background flex flex-col pt-20">
      <div class="section"><HeroSection /></div>
      <div class="section"><AboutSection /></div>
      <div class="section"><StorySection /></div>
      <div class="section"><FeaturesSection /></div>
      <div class="section"><TestimonialsSection /></div>
      <div class="section"><CtaSection /></div>
  </div>
</template>
