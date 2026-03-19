<script setup lang="ts">
import { Image } from '@unpic/vue'
import { onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  // Card reveal
  gsap.from('.about-card', {
    opacity: 0,
    y: 32,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 80%'
    }
  })

  // Deco reveal
  gsap.from('.about-deco', {
    opacity: 0,
    scale: 0.85,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 75%'
    },
    delay: 0.2
  })
})
</script>

<template>
  <section class="about-section w-full bg-secondary py-20 md:py-28">
    <div class="max-w-7xl mx-auto px-6">
      

      <!-- Paper card + floating decos -->
      <div class="relative w-full max-w-md mx-auto">
        <!-- Notebook card -->
        <div class="about-card relative w-full rounded-xl overflow-hidden border border-border shadow-lg bg-background">
          <!-- Staggered paper effect -->
          <div class="absolute inset-0 bg-muted rotate-3 rounded-xl -z-10" />
          <div class="absolute inset-0 bg-secondary -rotate-3 rounded-xl -z-10" />

          <!-- Ruled lines -->
          <div class="absolute inset-0 z-0 pointer-events-none px-6 pt-16">
            <div
              v-for="i in 18" :key="i"
              class="w-full border-b border-border"
              :style="{ height: '2rem' }"
            />
          </div>

          <!-- Content overlay -->
          <div class="relative z-10 px-8 pt-8 pb-8">
            <h3 class="text-center mb-4 font-heading">
              <span class="block text-base text-muted-foreground">Apa Itu</span>
              <span class="block font-bold text-primary text-3xl md:text-4xl leading-none mt-1">REDUKA</span>
            </h3>
            <p class="text-sm leading-[2rem] text-foreground text-justify">
              Reduka adalah platform pembelajaran inovatif yang berfokus membantu siswa yang mengalami putus sekolah agar dapat kembali melanjutkan pendidikan hingga ke jenjang perguruan tinggi. Melalui penyediaan materi pembelajaran, bimbingan, dan pendampingan yang terarah dan berkelanjutan, Reduka berupaya membuka kembali akses pendidikan serta menciptakan peluang masa depan yang lebih cerah bagi siswa yang sebelumnya terpinggirkan dari sistem pendidikan formal.
            </p>
          </div>
        </div>

        <!-- Floating Decorations -->
        <Image
          src="/images/landingPage/about/pen.png"
          alt="pen"
          class="about-deco size-20 absolute top-1/2 -left-16 -translate-y-1/2 animate-[float3_5s_ease-in-out_infinite]"
        />
        <Image
          src="/images/landingPage/about/globe.png"
          alt="globe"
          class="about-deco size-36 absolute -bottom-8 -right-12 animate-[float1_6s_ease-in-out_infinite]"
        />
        <Image
          src="/images/landingPage/about/formula_1.png"
          alt="formula"
          class="about-deco size-44 -rotate-[70deg] absolute -top-10 -right-10 animate-[float2_7s_ease-in-out_infinite]"
        />
        <Image
          src="/images/landingPage/about/formula_2.png"
          alt="formula 2"
          class="about-deco size-28 absolute -bottom-6 -left-10 animate-[float4_5s_ease-in-out_infinite]"
        />

      </div>
    </div>
  </section>
</template>
