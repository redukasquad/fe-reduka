<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

const stories = [
  {
    year: '2020',
    image: '/images/story/1.jpeg',
    title: 'Awal Mula Komunitas',
    description: 'REDUKA lahir dari keprihatinan mendalam terhadap tingginya angka putus sekolah di Indonesia. Dimulai dari satu kelas kecil, satu per satu siswa mulai percaya bahwa belajar bisa dimulai kapan saja.',
    stat: '50 Siswa Pertama',
    accent: '#6366f1',
  },
  {
    year: '2021',
    image: '/images/story/2.jpeg',
    title: 'Pertumbuhan Pesat',
    description: 'Ribuan siswa bergabung dalam waktu singkat. Mentor dari berbagai latar belakang profesional hadir secara sukarela untuk berbagi ilmu dan pengalaman nyata.',
    stat: '1.000+ Siswa · 100+ Mentor',
    accent: '#8b5cf6',
  },
  {
    year: '2022',
    image: '/images/story/3.jpeg',
    title: 'Program Terstruktur',
    description: 'Kurikulum SD hingga SMA diluncurkan secara resmi. Sistem hybrid online-offline diterapkan agar siswa di daerah terpencil pun bisa mengakses pendidikan berkualitas.',
    stat: '5.000+ Siswa Aktif',
    accent: '#06b6d4',
  },
  {
    year: '2023',
    image: '/images/story/4.jpeg',
    title: 'Success Stories',
    description: 'Ratusan alumni berhasil melanjutkan ke Perguruan Tinggi Negeri. Banyak yang meraih beasiswa penuh dan menjadi inspirasi bagi siswa generasi berikutnya.',
    stat: '500+ Alumni · 100+ PTN',
    accent: '#10b981',
  },
  {
    year: '2024',
    image: '/images/story/5.jpeg',
    title: 'Visi Masa Depan',
    description: 'REDUKA terus berkembang dengan target menjangkau 50.000 siswa di seluruh pelosok Indonesia. Teknologi dan komunitas berjalan beriringan untuk masa depan yang lebih cerah.',
    stat: 'Target: 50.000 Siswa',
    accent: '#f59e0b',
  },
]

const sectionRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()

// ── Three.js floating particles ──────────────────────────────────────────────
let renderer: THREE.WebGLRenderer | null = null
let animFrameId = 0

function initThree(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)

  // Particles
  const count = 120
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6
    sizes[i] = Math.random() * 3 + 1
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const mat = new THREE.PointsMaterial({
    color: 0x6366f1,
    size: 0.06,
    transparent: true,
    opacity: 0.35,
    sizeAttenuation: true,
  })
  const points = new THREE.Points(geo, mat)
  scene.add(points)

  let t = 0
  const tick = () => {
    animFrameId = requestAnimationFrame(tick)
    t += 0.003
    points.rotation.y = t * 0.12
    points.rotation.x = Math.sin(t * 0.3) * 0.08
    renderer!.render(scene, camera)
  }
  tick()

  const onResize = () => {
    if (!canvas || !renderer) return
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  }
  window.addEventListener('resize', onResize)
  return () => window.removeEventListener('resize', onResize)
}

// ── GSAP timeline animations ─────────────────────────────────────────────────
function initGsap() {
  // Section fade in
  gsap.fromTo(sectionRef.value!, { opacity: 0 }, {
    opacity: 1, duration: 0.6,
    scrollTrigger: { trigger: sectionRef.value, start: 'top 90%' }
  })

  // Progress line draw
  gsap.fromTo('.story-progress-line', { scaleY: 0 }, {
    scaleY: 1,
    transformOrigin: 'top center',
    ease: 'none',
    scrollTrigger: {
      trigger: '.story-track',
      start: 'top 60%',
      end: 'bottom 60%',
      scrub: 1,
    }
  })

  // Each story item
  document.querySelectorAll<HTMLElement>('.story-card').forEach((card, i) => {
    const imgEl = card.querySelector<HTMLElement>('.story-img-wrap')
    const textEl = card.querySelector<HTMLElement>('.story-text-wrap')
    const dotEl = card.querySelector<HTMLElement>('.story-dot')
    const isEven = i % 2 === 0

    // Image: comes from left (even) or right (odd) with 3D tilt
    gsap.fromTo(imgEl, {
      opacity: 0,
      x: isEven ? -60 : 60,
      rotateY: isEven ? 18 : -18,
      scale: 0.88,
      transformPerspective: 900,
    }, {
      opacity: 1, x: 0, rotateY: 0, scale: 1,
      duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 82%' }
    })

    // Text: comes from opposite side
    gsap.fromTo(textEl, {
      opacity: 0,
      x: isEven ? 50 : -50,
      y: 20,
    }, {
      opacity: 1, x: 0, y: 0,
      duration: 0.85, ease: 'power3.out',
      delay: 0.12,
      scrollTrigger: { trigger: card, start: 'top 82%' }
    })

    // Dot pop
    gsap.fromTo(dotEl, { scale: 0, opacity: 0 }, {
      scale: 1, opacity: 1,
      duration: 0.4, ease: 'back.out(2)',
      scrollTrigger: { trigger: card, start: 'top 80%' }
    })

    // Subtle parallax on image while scrolling
    gsap.to(imgEl, {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      }
    })
  })
}

let cleanupThree: (() => void) | undefined

onMounted(() => {
  if (canvasRef.value) {
    cleanupThree = initThree(canvasRef.value) ?? undefined
  }
  // slight delay so DOM is fully painted
  setTimeout(initGsap, 80)
})

onUnmounted(() => {
  cancelAnimationFrame(animFrameId)
  renderer?.dispose()
  cleanupThree?.()
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <section
    ref="sectionRef"
    class="w-full bg-background py-20 md:py-32 relative overflow-hidden"
  >
    <!-- Three.js canvas background -->
    <canvas
      ref="canvasRef"
      class="absolute inset-0 w-full h-full pointer-events-none opacity-40"
    />

    <!-- Subtle radial glow -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

      <!-- Section header -->
      <div class="text-center mb-16 md:mb-24 space-y-3">
        <span class="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 rounded-full px-4 py-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Perjalanan Kami
        </span>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground font-heading leading-tight">
          Dari Nol Menuju<br class="hidden sm:block" />
          <span class="text-primary"> Ribuan Harapan</span>
        </h2>
        <p class="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Setiap tahun adalah babak baru. Setiap siswa adalah cerita yang layak untuk diceritakan.
        </p>
      </div>

      <!-- Timeline track -->
      <div class="story-track relative">

        <!-- Center vertical line (desktop) / left line (mobile) -->
        <div class="
          absolute top-0 bottom-0 w-px bg-border/60
          left-4 sm:left-6
          md:left-1/2 md:-translate-x-px
        ">
          <!-- Animated progress fill -->
          <div class="story-progress-line absolute inset-0 bg-linear-to-b from-primary via-violet-500 to-primary/30 origin-top" />
        </div>

        <!-- Story items -->
        <div class="space-y-20 md:space-y-28">
          <div
            v-for="(story, i) in stories"
            :key="story.year"
            class="story-card relative"
          >
            <!--
              Layout:
              - Mobile: single column, content to the right of the left line
              - Desktop: alternating left/right
            -->
            <div
              class="flex items-center gap-4 md:gap-0"
              :class="i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"
            >

              <!-- ── Image side (desktop only) ──────────────────── -->
              <div
                class="story-img-wrap hidden md:flex flex-1 items-center"
                :class="i % 2 === 0 ? 'md:justify-end md:pr-12' : 'md:justify-start md:pl-12'"
                style="perspective: 900px;"
              >
                <div
                  class="relative rounded-2xl overflow-hidden shadow-xl border border-border/60 group"
                  style="width: 280px; height: 200px;"
                >
                  <div
                    class="absolute top-3 left-3 z-10 text-xs font-extrabold text-white px-3 py-1 rounded-full shadow-lg"
                    :style="{ background: story.accent }"
                  >
                    {{ story.year }}
                  </div>
                  <img
                    :src="story.image"
                    :alt="story.title"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </div>

              <!-- ── Center dot ─────────────────────────────────── -->
              <div class="
                story-dot relative z-20 shrink-0
                ml-0 mr-4
                md:mx-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2
              ">
                <div
                  class="w-5 h-5 rounded-full border-4 border-background shadow-lg"
                  :style="{ background: story.accent, outline: `3px solid ${story.accent}44`, outlineOffset: '2px' }"
                />
                <!-- Pulse ring -->
                <div
                  class="absolute inset-0 rounded-full animate-ping opacity-30"
                  :style="{ background: story.accent }"
                />
              </div>

              <!-- ── Text side ──────────────────────────────────── -->
              <div
                class="story-text-wrap flex-1 md:flex-none"
                :class="[
                  i % 2 === 0
                    ? 'md:w-[calc(50%-2.5rem)] md:pl-12'
                    : 'md:w-[calc(50%-2.5rem)] md:pr-12 md:text-right',
                  'pl-2 md:pl-0'
                ]"
              >
                <!-- Mobile: show year here -->
                <span
                  class="md:hidden inline-block text-[10px] font-extrabold text-white px-2.5 py-0.5 rounded-full mb-2"
                  :style="{ background: story.accent }"
                >
                  {{ story.year }}
                </span>

                <!-- Card -->
                <div class="bg-card border border-border/60 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-border transition-all duration-300 group">
                  <h3 class="text-base sm:text-lg font-bold text-foreground font-heading mb-2 group-hover:text-primary transition-colors">
                    {{ story.title }}
                  </h3>
                  <p class="text-sm text-muted-foreground leading-relaxed">
                    {{ story.description }}
                  </p>

                  <!-- Mobile image — shown below description, hidden on desktop -->
                  <div class="md:hidden mt-4 relative rounded-xl overflow-hidden border border-border/50" style="height: 140px;">
                    <img
                      :src="story.image"
                      :alt="story.title"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div class="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
                  </div>

                  <div class="mt-4 pt-3 border-t border-border/60 flex items-center gap-2" :class="i % 2 !== 0 ? 'md:justify-end' : ''">
                    <div class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: story.accent }" />
                    <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {{ story.stat }}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- End cap -->
        <div class="
          relative z-20 flex justify-center mt-16
          pl-4 sm:pl-6 md:pl-0
        ">
          <div class="flex flex-col items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <span class="text-xs text-muted-foreground font-medium tracking-wide">Perjalanan berlanjut…</span>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
