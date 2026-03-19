<script setup lang="ts">
import { Image } from '@unpic/vue'
import { onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stories = [
  {
    year: '2020', image: '/images/story/1.jpeg',
    title: 'Awal Mula Komunitas',
    description: 'REDUKA lahir dari keprihatinan terhadap angka putus sekolah. Dimulai satu per satu.',
    stat: '50 Siswa Pertama'
  },
  {
    year: '2021', image: '/images/story/2.jpeg',
    title: 'Pertumbuhan Pesat',
    description: 'Ribuan siswa bergabung. Mentor dari berbagai latar belakang profesional hadir.',
    stat: '1.000+ Siswa · 100+ Mentor'
  },
  {
    year: '2022', image: '/images/story/3.jpeg',
    title: 'Program Terstruktur',
    description: 'Kurikulum SD–SMA diluncurkan. Sistem hybrid online-offline diterapkan.',
    stat: '5.000+ Siswa Aktif'
  },
  {
    year: '2023', image: '/images/story/4.jpeg',
    title: 'Success Stories',
    description: 'Ratusan alumni lanjut ke PTN, banyak meraih beasiswa penuh.',
    stat: '500+ Alumni · 100+ PTN'
  },
  {
    year: '2024', image: '/images/story/5.jpeg',
    title: 'Visi Masa Depan',
    description: 'Menjangkau 50.000 siswa di seluruh Indonesia.',
    stat: 'Target: 50.000 Siswa'
  },
]

onMounted(() => {
  // Line reveal
  gsap.from('.story-timeline-line', {
    scaleY: 0,
    transformOrigin: 'top',
    duration: 1.2,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '.story-section',
      start: 'top 65%'
    }
  })

  // Stagger reveal items
  document.querySelectorAll('.story-item').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      x: i % 2 === 0 ? -28 : 28,
      duration: 0.55,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%'
      }
    })
  })
})
</script>

<template>
  <section class="story-section w-full bg-background py-20 md:py-28 relative overflow-hidden">
    <div class="max-w-5xl mx-auto px-6">


      <!-- Timeline -->
      <div class="relative">
        <!-- Center line -->
        <div class="story-timeline-line absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-border" />

        <div class="space-y-16">
          <div
            v-for="(story, i) in stories" :key="story.year"
            :class="[
              'story-item relative flex items-center gap-6 md:gap-10',
              i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            ]"
          >
            <!-- Image side -->
            <div class="flex-1 flex" :class="i % 2 === 0 ? 'justify-end' : 'justify-start'">
              <div class="w-48 md:w-56 rounded-lg overflow-hidden border border-border shadow-sm bg-muted/20">
                <Image
                  :src="story.image"
                  :alt="story.title"
                  width="224" height="160"
                  class="w-full h-40 object-cover"
                />
              </div>
            </div>

            <!-- Indicator dot -->
            <div class="relative z-10 flex-shrink-0">
              <div class="size-4 rounded-full bg-primary border-2 border-background shadow-sm" />
            </div>

            <!-- Content side -->
            <div class="flex-1" :class="i % 2 === 0 ? 'text-left' : 'text-right'">
              <span class="inline-block text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-1 mb-2">
                {{ story.year }}
              </span>
              <h3 class="text-lg font-semibold text-foreground font-heading">
                {{ story.title }}
              </h3>
              <p class="text-sm text-muted-foreground mt-1 leading-relaxed">
                {{ story.description }}
              </p>
              <div class="border-t border-border mt-3 pt-2">
                <p class="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {{ story.stat }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
