<script setup lang="ts">
import { onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Checklist — menghubungkan ke fitur-fitur di atas
const checkpoints = [
  { icon: 'lucide:globe',       text: 'Belajar kapan saja, di mana saja'         },
  { icon: 'lucide:users',       text: '500+ mentor profesional siap mendampingi' },
  { icon: 'lucide:book-open',   text: 'Kurikulum SD–SMA terstruktur & terarah'   },
  { icon: 'lucide:badge-check', text: 'Gratis — tanpa biaya tersembunyi'         },
]

const stats = [
  { num: '10.000+', label: 'Siswa Aktif'   },
  { num: '500+',    label: 'Mentor'        },
  { num: '100%',    label: 'Gratis'        },
]

onMounted(() => {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.cta-section', start: 'top 78%' },
  })

  tl.fromTo('.cta-label',
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
  )
  .fromTo('.cta-title',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
    '-=0.2'
  )
  .fromTo('.cta-sub',
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
    '-=0.2'
  )
  .fromTo('.cta-check',
    { opacity: 0, x: -12 },
    { opacity: 1, x: 0, duration: 0.35, stagger: 0.08, ease: 'power2.out' },
    '-=0.15'
  )
  .fromTo('.cta-actions',
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
    '-=0.1'
  )
  .fromTo('.cta-stat',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.35, stagger: 0.07, ease: 'power2.out' },
    '-=0.15'
  )
})
</script>

<template>
  <section class="cta-section w-full bg-background py-20 md:py-28 relative overflow-hidden">

    <!-- Subtle blobs — tidak mengganggu teks -->
    <div class="absolute top-0 right-0 size-72 bg-primary/5 blur-3xl rounded-full
                -translate-y-1/3 translate-x-1/3 pointer-events-none" />
    <div class="absolute bottom-0 left-0 size-72 bg-ring/5 blur-3xl rounded-full
                translate-y-1/3 -translate-x-1/3 pointer-events-none" />

    <div class="max-w-5xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

        <!-- ── Kiri: teks + checklist ──────────────────────── -->
        <div class="space-y-6">

          <!-- Label -->
          <span class="cta-label text-xs font-semibold tracking-widest uppercase text-primary">
            Bergabung Sekarang
          </span>

          <!-- Headline -->
          <h2 class="cta-title text-3xl md:text-4xl font-bold text-foreground font-heading leading-tight">
            Mulai Perjalanan<br>
            Pendidikanmu Hari Ini
          </h2>

          <!-- Subtext -->
          <p class="cta-sub text-base text-muted-foreground leading-relaxed max-w-sm">
            Semua yang kamu butuhkan untuk bangkit kembali sudah ada di sini —
            gratis, terstruktur, dan didampingi mentor terbaik.
          </p>

          <!-- Checklist — koneksi visual ke FeaturesSection -->
          <ul class="space-y-3">
            <li
              v-for="(c, i) in checkpoints"
              :key="i"
              class="cta-check flex items-center gap-3"
            >
              <span class="size-7 rounded-full bg-primary/10 flex items-center
                           justify-center flex-shrink-0">
                <Icon :icon="c.icon" class="size-3.5 text-primary" />
              </span>
              <span class="text-sm text-foreground">{{ c.text }}</span>
            </li>
          </ul>

          <!-- Buttons -->
          <div class="cta-actions flex flex-col sm:flex-row gap-3 pt-2">
            <RouterLink
              to="/auth/register"
              class="px-8 py-3 rounded-md text-sm font-semibold font-heading text-center
                     bg-primary text-primary-foreground
                     shadow-lg shadow-primary/20
                     hover:opacity-90 hover:scale-[1.02]
                     transition-all duration-150"
            >
              Gabung Sekarang
            </RouterLink>
            <RouterLink
              to="/contact"
              class="px-8 py-3 rounded-md text-sm font-semibold font-heading text-center
                     border border-border text-foreground bg-transparent
                     hover:bg-secondary transition-all duration-150"
            >
              Hubungi Kami
            </RouterLink>
          </div>
        </div>

        <!-- ── Kanan: stats card ───────────────────────────── -->
        <div class="space-y-4">

          <!-- Stats 3 baris — vertikal di kanan -->
          <div
            v-for="(s, i) in stats"
            :key="i"
            class="cta-stat flex items-center justify-between
                   bg-secondary border border-border rounded-xl px-6 py-5
                   hover:border-primary/30 hover:shadow-sm
                   transition-all duration-200"
          >
            <div>
              <p class="text-2xl font-bold text-foreground font-heading leading-none">
                {{ s.num }}
              </p>
              <p class="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-semibold">
                {{ s.label }}
              </p>
            </div>

            <!-- Mini progress bar visual -->
            <div class="w-24 h-1.5 bg-border rounded-full overflow-hidden">
              <div
                class="h-full bg-primary rounded-full transition-all duration-1000"
                :style="{
                  width: i === 0 ? '100%' : i === 1 ? '60%' : '100%'
                }"
              />
            </div>
          </div>

          <!-- Tagline kecil di bawah -->
          <p class="text-xs text-muted-foreground text-center pt-1 flex items-center justify-center gap-1.5">
            <Icon icon="lucide:shield-check" class="size-3 text-primary" />
            Bergabung gratis. Tidak perlu kartu kredit.
          </p>
        </div>

      </div>
    </div>
  </section>
</template>