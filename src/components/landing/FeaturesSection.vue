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
    desc: 'Didampingi 500+ mentor yang berpengalaman dalam UTBK membantu masa depanmu.',
    blobBg: 'bg-accent/30', iconBg: 'bg-accent/20', statColor: 'text-accent-foreground', stat: '500+',
  },
  {
    icon: '/images/landingPage/envi_img/1.png',
    title: 'Kurikulum Terstruktur',
    desc: 'Setiap materi dalam subtes disusun sistematis sesuai standar pendidikan nasional.',
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
// TODO: ganti RAW dengan data dari API saat endpoint analytics tersedia,
// lalu set IS_DUMMY_DATA = false.
const IS_DUMMY_DATA = true

const RAW = [
  { year: '2020', siswa: 50,    alumni: 48   },
  { year: '2021', siswa: 100,  alumni: 97  },
  { year: '2022', siswa: 146,  alumni: 139 },
  { year: '2023', siswa: 263,  alumni: 254 },
  { year: '2024', siswa: 496, alumni: 491 },
  { year: '2025', siswa: 790, alumni: 782 },
]

// Tinggi area data (px) + ruang ekstra di atas untuk label nilai bar.
const CHART_PX    = 320
const LABEL_SPACE = 20
const PLOT_PX     = CHART_PX + LABEL_SPACE

// Skala Y dihitung otomatis dari data (4 interval dengan step "bulat"),
// sehingga tick dan tinggi bar selalu sinkron saat data berubah.
const niceStep = (rawStep: number) => {
  const mag = 10 ** Math.floor(Math.log10(rawStep))
  const f = rawStep / mag
  const nice = [1, 2, 2.5, 5, 10].find(n => f <= n) ?? 10
  return nice * mag
}
const DATA_MAX = Math.max(...RAW.map(d => Math.max(d.siswa, d.alumni)))
const STEP     = niceStep(DATA_MAX / 4)
const AXIS_MAX = STEP * 4
const Y_TICKS  = [0, 1, 2, 3, 4].map(i => i * STEP)

const toPx = (v: number) => Math.max(v > 0 ? 3 : 0, Math.round((v / AXIS_MAX) * CHART_PX))
const yPos = (v: number) => (v / AXIS_MAX) * CHART_PX

const bars = RAW.map(d => ({
  ...d,
  siswaH:  toPx(d.siswa),
  alumniH: toPx(d.alumni),
}))

// Format Indonesia: titik = ribuan, koma = desimal (mis. 2,5rb).
const nf = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 })
const fmt = (v: number) => (v >= 1000 ? `${nf.format(v / 1000)}rb` : nf.format(v))
const fmtFull = (v: number) => new Intl.NumberFormat('id-ID').format(v)

const latestStats = computed(() => {
  const last = RAW[RAW.length - 1] as typeof RAW[0]
  const prev = RAW[RAW.length - 2] as typeof RAW[0]
  return {
    siswa:  fmt(RAW.reduce((sum, d) => sum + d.alumni, 0)) + '+',
    alumni: fmt(RAW.reduce((sum, d) => sum + d.alumni, 0)) + '+',
    // YoY (tahun terakhir vs sebelumnya) — lebih representatif daripada
    // membandingkan dengan basis 2020 yang hanya 50 siswa (+19.900%).
    growth: `+${Math.round((last.siswa / prev.siswa - 1) * 100)}%`,
  }
})

const chartLabel = computed(() =>
  'Grafik batang pertumbuhan siswa aktif dan alumni. ' +
  RAW.map(d => `${d.year}: ${fmtFull(d.siswa)} siswa, ${fmtFull(d.alumni)} alumni`).join('; ') + '.'
)

// ── GSAP ──────────────────────────────────────────────────────
let animated = false

const showFinalState = () => {
  bars.forEach((d, i) => {
    gsap.set(`#bar-s-${i}`, { height: d.siswaH, opacity: 1 })
    if (d.alumniH > 0) gsap.set(`#bar-a-${i}`, { height: d.alumniH, opacity: 1 })
  })
  gsap.set('.val-lbl, .x-lbl, .y-lbl', { opacity: 1 })
}

const runBars = () => {
  if (animated) return
  animated = true

  // Hormati pengguna dengan reduced-motion: langsung tampilkan hasil akhir.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showFinalState()
    return
  }

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

    gsap.fromTo(`#val-s-${i}, #val-a-${i}`,
      { opacity: 0, y: 4 },
      { opacity: 1, y: 0, duration: 0.3, delay: delay + 0.6, ease: 'power2.out' }
    )

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
            <h3 class="text-xl font-bold text-foreground font-heading">
              Pertumbuhan Pengguna {{ RAW[0]?.year }}–{{ RAW[RAW.length - 1]?.year }}
            </h3>
            <p class="text-sm text-muted-foreground">
              Perkembangan siswa aktif dan alumni yang diterima di PTN/PTS dari tahun ke tahun.
            </p>
          </div>

          <!-- Quick stat badges -->
          <div class="flex flex-wrap gap-2">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
              <Icon icon="lucide:users" class="size-4 text-primary" />
              <span class="text-sm font-semibold text-primary">{{ latestStats.siswa }}</span>
              <span class="text-xs text-muted-foreground hidden sm:inline">Siswa</span>
            </div>
            <div class="alumni-badge flex items-center gap-1.5 px-3 py-1.5 rounded-lg">
              <Icon icon="lucide:trophy" class="size-4 alumni-text" />
              <span class="text-sm font-semibold alumni-text">{{ latestStats.alumni }}</span>
              <span class="text-xs text-muted-foreground hidden sm:inline">Alumni</span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border">
              <Icon icon="lucide:trending-up" class="size-4 text-primary" />
              <span class="text-sm font-semibold text-primary">{{ latestStats.growth }}</span>
              <span class="text-xs text-muted-foreground hidden sm:inline">Growth YoY</span>
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
            <span class="alumni-bar block w-4 h-3 rounded-sm" />
            <span class="text-xs text-muted-foreground">Alumni yang Diterima di PTN/PTS</span>
          </div>
        </div>

        <!-- Bar chart (role="img": ringkasan data dibacakan lewat aria-label) -->
        <div class="flex gap-2" role="img" :aria-label="chartLabel">

          <!-- Y-axis labels: diposisikan absolut agar tepat sejajar dengan gridline -->
          <div class="relative shrink-0 w-10" aria-hidden="true" :style="{ height: `${PLOT_PX}px` }">
            <span v-for="t in Y_TICKS" :key="t"
              class="y-lbl absolute right-1 translate-y-1/2 text-[10px] text-muted-foreground leading-none opacity-0 whitespace-nowrap"
              :style="{ bottom: `${yPos(t)}px` }">
              {{ fmt(t) }}
            </span>
          </div>

          <!-- Main chart area -->
          <div class="flex-1 min-w-0 overflow-x-auto max-w-full" aria-hidden="true">

            <div class="relative" :style="{ height: `${PLOT_PX}px` }">
              <!-- Grid lines (absolut dari bawah, skala sama dengan bar) -->
              <div class="absolute inset-0 pointer-events-none">
                <div v-for="t in Y_TICKS.slice(1)" :key="t"
                  class="absolute inset-x-0 border-t border-dashed border-border"
                  :style="{ bottom: `${yPos(t)}px` }" />
              </div>

              <!-- Bars — items-end agar bar tumbuh ke atas -->
              <div class="relative z-10 flex items-end justify-around h-full gap-2 px-2">
                <div v-for="(d, i) in bars" :key="d.year"
                  class="flex items-end justify-center gap-1 flex-1">

                  <!-- Siswa -->
                  <div class="flex flex-col items-center justify-end">
                    <span :id="`val-s-${i}`"
                      class="val-lbl hidden md:block mb-1 text-[10px] font-semibold leading-none text-primary opacity-0">
                      {{ fmt(d.siswa) }}
                    </span>
                    <div
                      :id="`bar-s-${i}`"
                      class="w-3 md:w-8 lg:w-12 rounded-t-[4px] bg-primary shrink-0
                             transition-[filter] duration-150 hover:brightness-110"
                      style="height: 0; opacity: 0"
                      :title="`Siswa ${d.year}: ${fmtFull(d.siswa)}`"
                    />
                  </div>

                  <!-- Alumni -->
                  <div class="flex flex-col items-center justify-end">
                    <span :id="`val-a-${i}`"
                      class="val-lbl alumni-text hidden md:block mb-1 text-[10px] font-semibold leading-none opacity-0">
                      {{ fmt(d.alumni) }}
                    </span>
                    <div
                      :id="`bar-a-${i}`"
                      class="alumni-bar w-3 md:w-8 lg:w-12 rounded-t-[4px] shrink-0
                             transition-[filter] duration-150 hover:brightness-110"
                      style="height: 0; opacity: 0"
                      :title="`Alumni ${d.year}: ${fmtFull(d.alumni)}`"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- X-axis -->
            <div class="border-t border-border" />

            <!-- X labels (gap & padding sama dengan baris bar agar sejajar) -->
            <div class="flex justify-around mt-2 gap-2 px-2">
              <div v-for="(d, i) in bars" :key="d.year"
                :id="`lbl-${i}`"
                class="x-lbl flex-1 text-center text-xs text-muted-foreground opacity-0">
                {{ d.year }}
              </div>
            </div>
          </div>
        </div>

        <!-- Tabel ringkas untuk layar kecil (nilai bar tidak bisa dibaca via tooltip di layar sentuh) -->
        <div class="md:hidden mt-5 pt-4 border-t border-border overflow-x-auto">
          <table class="w-full text-xs">
            <caption class="sr-only">Data siswa aktif dan alumni per tahun</caption>
            <thead>
              <tr class="text-muted-foreground">
                <th scope="col" class="text-left font-medium pb-2">Tahun</th>
                <th scope="col" class="text-right font-medium pb-2">Siswa</th>
                <th scope="col" class="text-right font-medium pb-2">Alumni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in RAW" :key="d.year" class="border-t border-border/60">
                <th scope="row" class="text-left font-medium text-foreground py-1.5">{{ d.year }}</th>
                <td class="text-right font-semibold text-primary py-1.5">{{ fmtFull(d.siswa) }}</td>
                <td class="text-right font-semibold alumni-text py-1.5">{{ fmtFull(d.alumni) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <p class="text-xs text-muted-foreground mt-5 text-right flex items-center justify-end gap-1">
          <Icon icon="lucide:file-text" class="size-3" />
          <template v-if="IS_DUMMY_DATA">Data ilustrasi (dummy) · belum terhubung ke data asli</template>
          <template v-else>Data internal REDUKA · Diperbarui {{ RAW[RAW.length - 1]?.year }}</template>
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

/* Warna seri Alumni: amber dari token --ring terlalu terang di latar putih
   (kontras rendah), jadi dipakai varian lebih gelap untuk bar & teks. */
.chart-block {
  --alumni: oklch(0.7 0.16 70);
  --alumni-text: oklch(0.5 0.12 70);
}
.dark .chart-block {
  --alumni: oklch(0.8 0.15 80);
  --alumni-text: oklch(0.82 0.14 80);
}
.alumni-bar  { background: var(--alumni); }
.alumni-text { color: var(--alumni-text); }
.alumni-badge {
  background: color-mix(in oklch, var(--alumni) 14%, transparent);
  border: 1px solid color-mix(in oklch, var(--alumni) 35%, transparent);
}
</style>