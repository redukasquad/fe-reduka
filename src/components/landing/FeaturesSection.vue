<script setup lang="ts">
import { Image } from '@unpic/vue'
import { computed, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Icon } from '@iconify/vue'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: '/images/landingPage/about/globe.png',
    title: 'Belajar Kapan Saja',
    desc: 'Akses materi 24/7 dari mana pun kamu berada dengan sistem digital yang fleksibel.',
    blobBg: 'bg-primary/10', iconBg: 'bg-primary/15', statColor: 'text-primary', stat: '24/7',
  },
  {
    icon: '/images/landingPage/about/pen.png',
    title: 'Mentor Berpengalaman',
    desc: 'Didampingi 500+ mentor profesional yang berdedikasi membantu masa depanmu.',
    blobBg: 'bg-accent/30', iconBg: 'bg-accent/20', statColor: 'text-accent-foreground', stat: '500+',
  },
  {
    icon: '/images/landingPage/envi_img/1.png',
    title: 'Kurikulum Terstruktur',
    desc: 'Dari SD hingga SMA, materi disusun sistematis sesuai standar pendidikan nasional.',
    blobBg: 'bg-ring/20', iconBg: 'bg-ring/15', statColor: 'text-ring', stat: '12+',
  },
  {
    icon: '/images/landingPage/envi_img/2.png',
    title: '100% Gratis',
    desc: 'Tidak ada biaya tersembunyi. Akses pendidikan berkualitas untuk seluruh lapisan.',
    blobBg: 'bg-destructive/10', iconBg: 'bg-destructive/10', statColor: 'text-destructive', stat: 'Gratis',
  },
]

// ── Chart ─────────────────────────────────────────────────────
const RAW = [
  { year: '2020', siswa: 50,    alumni: 0   },
  { year: '2021', siswa: 1000,  alumni: 80  },
  { year: '2022', siswa: 5000,  alumni: 320 },
  { year: '2023', siswa: 8000,  alumni: 500 },
  { year: '2024', siswa: 10000, alumni: 820 },
]

// Fixed pixel height of the chart area — referenced in both template & JS
const CHART_PX = 320
const MAX_VAL  = Math.max(...RAW.map(d => d.siswa))
const Y_TICKS  = [0, 2500, 5000, 7500, 10000]

const toPx = (v: number) => Math.max(v > 0 ? 3 : 0, Math.round((v / MAX_VAL) * CHART_PX))

const bars = RAW.map(d => ({
  ...d,
  siswaH:  toPx(d.siswa),
  alumniH: toPx(d.alumni),
}))

const fmt = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}rb` : `${v}`

const latestStats = computed(() => {
  const last  = RAW[RAW.length - 1] as typeof RAW[0]
  const first = RAW[0] as typeof RAW[0]
  return {
    siswa:  fmt(last.siswa)  + '+',
    alumni: fmt(last.alumni) + '+',
    growth: `+${Math.round((last.siswa / first.siswa - 1) * 100).toLocaleString('id-ID')}%`,
  }
})

// ── GSAP ──────────────────────────────────────────────────────
let animated = false

const runBars = () => {
  if (animated) return
  animated = true

  bars.forEach((d, i) => {
    const delay = i * 0.13

    gsap.fromTo(`#bar-s-${i}`,
      { height: 0, opacity: 0 },
      { height: d.siswaH, opacity: 1, duration: 0.7, delay, ease: 'power3.out' }
    )

    if (d.alumniH > 0) {
      gsap.fromTo(`#bar-a-${i}`,
        { height: 0, opacity: 0 },
        { height: d.alumniH, opacity: 1, duration: 0.55, delay: delay + 0.1, ease: 'power2.out' }
      )
    }

    gsap.fromTo(`#lbl-${i}`,
      { opacity: 0, y: 5 },
      { opacity: 1, y: 0, duration: 0.3, delay: delay + 0.55, ease: 'power2.out' }
    )
  })

  gsap.fromTo('.y-lbl',
    { opacity: 0, x: -5 },
    { opacity: 1, x: 0, stagger: 0.05, duration: 0.3, delay: 0.25, ease: 'power2.out' }
  )
}

onMounted(() => {
  gsap.fromTo('.feat-card',
    { opacity: 0, y: 26 },
    {
      opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out',
      scrollTrigger: { trigger: '.feats-grid', start: 'top 85%' },
    }
  )

  gsap.fromTo('.chart-block',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
      scrollTrigger: {
        trigger: '.chart-block',
        start: 'top 83%',
        onEnter: () => setTimeout(runBars, 180),
      },
    }
  )
})
</script>

<template>
  <section class="features-section w-full bg-secondary py-20 md:py-28">
    <div class="max-w-7xl mx-auto px-6 space-y-14">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div class="space-y-2">
          <span class="text-xs font-semibold tracking-widest uppercase text-primary">Fitur Unggulan</span>
          <h2 class="text-3xl md:text-4xl font-bold text-foreground font-heading">Kenapa REDUKA?</h2>
        </div>
        <p class="text-sm text-muted-foreground max-w-xs">
          Platform pembelajaran inklusif untuk semua kalangan, tanpa terkecuali.
        </p>
      </div>

      <div class="feats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          v-for="(f, i) in features" :key="i"
          class="feat-card relative bg-background border border-border rounded-xl
                 p-6 overflow-hidden cursor-default group transition-all duration-200"
        >
          <div :class="['absolute -top-8 -right-8 size-28 rounded-full blur-2xl pointer-events-none',
                        'opacity-60 group-hover:opacity-100 transition-opacity duration-300', f.blobBg]" />

          <div :class="['relative size-12 rounded-xl flex items-center justify-center mb-5',
                        f.iconBg, 'group-hover:scale-105 transition-transform duration-200']">
            <Image :src="f.icon" :alt="f.title" class="size-7 object-contain" />
          </div>

          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="text-base font-semibold text-foreground font-heading leading-snug">{{ f.title }}</h3>
            <span :class="['text-xs font-bold shrink-0 mt-0.5 px-2 py-0.5 rounded-full',
                           'bg-secondary border border-border', f.statColor]">
              {{ f.stat }}
            </span>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">{{ f.desc }}</p>
        </div>
      </div>

      <div class="chart-block bg-background border border-border rounded-2xl p-6 md:p-8">

        <!-- Block header -->
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div class="space-y-1">
            <span class="text-xs font-semibold tracking-widest uppercase text-primary flex items-center gap-1.5">
              <Icon icon="lucide:bar-chart-3" class="size-3.5" /> Analytics
            </span>
            <h3 class="text-xl font-bold text-foreground font-heading">Pertumbuhan Pengguna 2020–2024</h3>
            <p class="text-sm text-muted-foreground">
              Perkembangan siswa aktif dan alumni dari tahun ke tahun.
            </p>
          </div>

          <!-- Quick stat badges -->
          <div class="flex flex-wrap gap-2">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
              <Icon icon="lucide:users" class="size-4 text-primary" />
              <span class="text-sm font-semibold text-primary">{{ latestStats.siswa }}</span>
              <span class="text-xs text-muted-foreground hidden sm:inline">Siswa</span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ring/10 border border-ring/20">
              <Icon icon="lucide:trophy" class="size-4 text-ring" />
              <span class="text-sm font-semibold text-ring">{{ latestStats.alumni }}</span>
              <span class="text-xs text-muted-foreground hidden sm:inline">Alumni</span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/20 border border-accent/30">
              <Icon icon="lucide:trending-up" class="size-4 text-accent-foreground" />
              <span class="text-sm font-semibold text-accent-foreground">{{ latestStats.growth }}</span>
              <span class="text-xs text-muted-foreground hidden sm:inline">Growth</span>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="flex items-center gap-5 mb-5">
          <div class="flex items-center gap-2">
            <span class="block w-4 h-3 rounded-sm bg-primary" />
            <span class="text-xs text-muted-foreground">Siswa Aktif</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="block w-4 h-3 rounded-sm bg-ring/60" />
            <span class="text-xs text-muted-foreground">Alumni Lulus</span>
          </div>
        </div>

        <!-- Bar chart -->
        <div class="flex gap-2">

          <!-- Y-axis labels — height harus sama persis dengan CHART_PX -->
          <div
            class="flex flex-col-reverse justify-between text-right pr-2 shrink-0 w-8"
            :style="{ height: `${CHART_PX}px` }"
          >
            <span v-for="t in Y_TICKS" :key="t"
              class="y-lbl text-[10px] text-muted-foreground leading-none opacity-0">
              {{ fmt(t) }}
            </span>
          </div>

          <!-- Main chart area -->
          <div class="flex-1 min-w-0 overflow-x-auto max-w-full">

            <!-- Grid lines behind bars -->
            <div class="relative" :style="{ height: `${CHART_PX}px` }">
              <!-- Grid lines (absolute, positioned from bottom) -->
              <div class="absolute inset-0 pointer-events-none">
                <div v-for="t in Y_TICKS.slice(1)" :key="t"
                  class="absolute inset-x-0 border-t border-dashed border-border/40"
                  :style="{ bottom: `${(t / MAX_VAL) * CHART_PX}px` }" />
              </div>

              <!-- Bars — flex row, items-end so bars grow upward -->
              <div class="relative z-10 flex items-end justify-around h-full gap-2 px-2">
                <div v-for="(d, i) in bars" :key="d.year"
                  class="flex items-end justify-center gap-1 flex-1">

                  <!-- Siswa bar -->
                  <div
                    :id="`bar-s-${i}`"
                    class="w-3 md:w-8 lg:w-12 rounded-t-xl bg-primary shrink-0
                           transition-[filter] duration-150 hover:brightness-110 cursor-pointer"
                    style="height: 0; opacity: 0"
                    :title="`Siswa ${d.year}: ${fmt(d.siswa)}`"
                  />

                  <!-- Alumni bar -->
                  <div
                    :id="`bar-a-${i}`"
                    class="w-2 md:w-8 lg:w-12 rounded-t-xl bg-ring/60 shrink-0
                           transition-[filter] duration-150 hover:brightness-110 cursor-pointer"
                    style="height: 0; opacity: 0"
                    :title="`Alumni ${d.year}: ${fmt(d.alumni)}`"
                  />
                </div>
              </div>
            </div>

            <!-- X-axis -->
            <div class="border-t border-border" />

            <!-- X labels -->
            <div class="flex justify-around mt-2 px-2">
              <div v-for="(d, i) in bars" :key="d.year"
                :id="`lbl-${i}`"
                class="flex-1 text-center text-xs text-muted-foreground opacity-0">
                {{ d.year }}
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <p class="text-xs text-muted-foreground mt-5 text-right flex items-center justify-end gap-1">
          <Icon icon="lucide:file-text" class="size-3" />
          Data internal REDUKA Community Academy · Diperbarui 2024
        </p>
      </div>

    </div>
  </section>
</template>

<style scoped>
.feat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 32px -12px rgb(0 0 0 / 0.1);
}
</style>