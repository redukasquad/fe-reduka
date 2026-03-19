<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Data ───────────────────────────────────────────────────────
const ALL = [
  {
    quote: 'REDUKA memberi saya kesempatan kedua. Sekarang saya lulus SMA dan diterima di universitas negeri melalui jalur prestasi yang tidak pernah saya bayangkan.',
    name: 'Andi Pratama', role: 'Alumni 2023', initial: 'A', tag: 'Universitas Negeri',
  },
  {
    quote: 'Mentornya sabar dan materi mudah dipahami. Saya tidak merasa sendiri dalam mengejar ketertinggalan.',
    name: 'Siti Nurhaliza', role: 'Siswa Aktif', initial: 'S', tag: 'Program SMA',
  },
  {
    quote: 'Gratis dan berkualitas. Tidak menyangka bisa belajar dari mana saja dengan mentor terbaik tanpa biaya sepeser pun.',
    name: 'Budi Santoso', role: 'Alumni 2022', initial: 'B', tag: 'Belajar Online',
  },
  {
    quote: 'Berkat REDUKA saya bisa menyiapkan diri untuk UTBK meskipun lama tidak bersekolah.',
    name: 'Dewi Rahayu', role: 'Alumni 2023', initial: 'D', tag: 'Lolos UTBK',
  },
  {
    quote: 'Program mentoring satu-satu benar-benar membantu saya fokus. Mentor mengerti kebutuhan saya dan menyesuaikan metode belajar.',
    name: 'Rizki Maulana', role: 'Siswa Aktif', initial: 'R', tag: 'Mentoring 1-on-1',
  },
  {
    quote: 'Saya kembali percaya diri setelah 3 tahun tidak sekolah. REDUKA membuat saya sadar tidak ada kata terlambat untuk belajar.',
    name: 'Fatimah Zahra', role: 'Alumni 2022', initial: 'F', tag: 'Comeback Story',
  },
  {
    quote: 'Materinya lengkap dari dasar. Cocok untuk saya yang sudah lama tidak memegang buku pelajaran.',
    name: 'Hendra Kusuma', role: 'Siswa Aktif', initial: 'H', tag: 'Mulai dari Nol',
  },
  {
    quote: 'Komunitas REDUKA sangat supportif. Teman-teman sesama siswa saling menyemangati setiap hari.',
    name: 'Nadia Putri', role: 'Alumni 2023', initial: 'N', tag: 'Komunitas',
  },
  {
    quote: 'Saya bisa belajar di sela-sela kerja. Fleksibilitas waktu yang ditawarkan REDUKA sangat membantu.',
    name: 'Wahyu Saputro', role: 'Siswa Aktif', initial: 'W', tag: 'Belajar Fleksibel',
  },
  {
    quote: 'Dari tidak tahu harus mulai dari mana, kini saya sudah selesai ujian kesetaraan dengan nilai memuaskan.',
    name: 'Laila Indah', role: 'Alumni 2024', initial: 'L', tag: 'Ujian Kesetaraan',
  },
]

// ── Load more state ────────────────────────────────────────────
const STEP_FIRST  = 7
const STEP_MORE   = 3   // 7 → 10 → all
const shown       = ref(STEP_FIRST)
const isExpanding = ref(false)

const visibleItems = computed(() => ALL.slice(0, shown.value))
const hasMore      = computed(() => shown.value < ALL.length)

const loadMore = async () => {
  if (isExpanding.value || !hasMore.value) return
  isExpanding.value = true

  const prev = shown.value
  shown.value = Math.min(shown.value + STEP_MORE, ALL.length)

  // Animate new cards in after Vue renders
  await new Promise<void>(res => requestAnimationFrame(() => { res() }))

  const newCards = document.querySelectorAll('.tc-card-new')
  if (newCards.length) {
    gsap.fromTo(newCards,
      { opacity: 0, y: 20, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.45, stagger: 0.07, ease: 'power2.out',
        onComplete: () => {
          newCards.forEach(el => el.classList.remove('tc-card-new'))
          isExpanding.value = false
          // Restart scroll with new heights
          restartScroll()
        },
      }
    )
  } else {
    isExpanding.value = false
    restartScroll()
  }
}

// ── Split into 3 columns ───────────────────────────────────────
const cols = computed(() => {
  const c0 = visibleItems.value.filter((_, i) => i % 3 === 0)
  const c1 = visibleItems.value.filter((_, i) => i % 3 === 1)
  const c2 = visibleItems.value.filter((_, i) => i % 3 === 2)
  // Duplicate for seamless infinite loop
  return [
    [...c0, ...c0],
    [...c1, ...c1],
    [...c2, ...c2],
  ]
})

// ── Refs ───────────────────────────────────────────────────────
const sectionRef = ref<HTMLElement>()
const colRefs    = ref<(HTMLElement | null)[]>([null, null, null])
const setColRef  = (el: HTMLElement | null, i: number) => { colRefs.value[i] = el }

// ── GSAP tweens ────────────────────────────────────────────────
let tweens: gsap.core.Tween[] = []
const SPEEDS = [32, 42, 26]

const killAll = () => { tweens.forEach(t => t.kill()); tweens = [] }

const startScroll = () => {
  colRefs.value.forEach((col, i) => {
    if (!col) return
    const half = col.scrollHeight / 2
    if (half <= 0) return
    gsap.set(col, { y: 0 })
    const tween = gsap.to(col, {
      y: -half,
      duration: SPEEDS[i],
      ease: 'none',
      repeat: -1,
      // TS fix: onRepeat must return void
      onRepeat() { gsap.set(col, { y: 0 }) },
    })
    tweens.push(tween)
  })
}

const restartScroll = () => {
  killAll()
  requestAnimationFrame(() => startScroll())
}

const pauseAll  = () => tweens.forEach(t => t.pause())
const resumeAll = () => tweens.forEach(t => t.resume())

// ── Mounted ────────────────────────────────────────────────────
onMounted(() => {
  requestAnimationFrame(() => startScroll())

  gsap.fromTo(sectionRef.value!,
    { opacity: 0 },
    {
      opacity: 1, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: sectionRef.value, start: 'top 82%' },
    }
  )

  gsap.fromTo(colRefs.value.filter(Boolean),
    { opacity: 0, y: 28 },
    {
      opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: sectionRef.value, start: 'top 82%' },
      delay: 0.1,
    }
  )
})

onUnmounted(() => killAll())
</script>

<template>
  <section
    ref="sectionRef"
    class="w-full bg-secondary py-20 md:py-28 overflow-hidden"
    @mouseenter="pauseAll"
    @mouseleave="resumeAll"
  >
    <div class="max-w-7xl mx-auto px-6">

      <!-- ── Header ─────────────────────────────────────────── -->
      <div class="text-center space-y-3 mb-14">
        <span class="text-xs font-semibold tracking-widest uppercase text-primary">
          Kata Mereka
        </span>
        <h2 class="text-3xl md:text-4xl font-bold text-foreground font-heading">
          Cerita Nyata dari Siswa
        </h2>
        <p class="text-sm text-muted-foreground max-w-md mx-auto">
          Ribuan siswa telah membuktikan — pendidikan itu hak semua orang.
        </p>
      </div>

      <!-- ── Masonry columns ────────────────────────────────── -->
      <div
        class="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-hidden"
        style="
          height: 520px;
          mask-image: linear-gradient(to bottom, transparent 0%, black 7%, black 93%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 7%, black 93%, transparent 100%);
        "
      >
        <div
          v-for="(col, ci) in cols"
          :key="ci"
          :ref="(el) => setColRef(el as HTMLElement | null, ci)"
          class="flex flex-col gap-4"
          :class="ci === 2 ? 'hidden md:flex' : ''"
        >
          <div
            v-for="(item, ii) in col"
            :key="`${ci}-${ii}`"
            class="tc-card rounded-2xl border border-border bg-background p-5
                   cursor-default select-none
                   hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5
                   transition-all duration-300"
            :class="ii >= col.length / 2 && ii < col.length / 2 + STEP_MORE
              ? 'tc-card-new'
              : ''"
          >
            <!-- Tag -->
            <span
              class="inline-block text-[10px] font-semibold uppercase tracking-widest
                     text-primary bg-primary/10 rounded-full px-2.5 py-0.5 mb-3"
            >
              {{ item.tag }}
            </span>

            <!-- Quote -->
            <p class="text-sm leading-relaxed text-foreground mb-4">
              {{ item.quote }}
            </p>

            <!-- Author -->
            <div class="flex items-center gap-3 pt-3 border-t border-border">
              <div
                class="size-8 rounded-full bg-primary/15 flex items-center justify-center
                       text-xs font-bold text-primary uppercase shrink-0"
              >
                {{ item.initial }}
              </div>
              <div class="min-w-0">
                <p class="text-xs font-semibold text-foreground leading-none truncate font-heading">
                  {{ item.name }}
                </p>
                <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-0.5">
                  {{ item.role }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Load more + hint ───────────────────────────────── -->
      <div class="flex flex-col items-center gap-3 mt-10">

        <!-- Load more button -->
        <button
          v-if="hasMore"
          class="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold
                 font-heading border border-border text-foreground bg-background
                 hover:bg-muted hover:border-primary/30
                 disabled:opacity-40
                 transition-all duration-150"
          :disabled="isExpanding"
          @click="loadMore"
        >
          <span v-if="isExpanding" class="size-3.5 border-2 border-border border-t-primary
                                          rounded-full animate-spin" />
          <span>
            {{ isExpanding
                ? 'Memuat...'
                : `Tampilkan lebih banyak (${ALL.length - shown} tersisa)` }}
          </span>
        </button>

        <!-- All loaded indicator -->
        <p
          v-else
          class="text-xs text-primary flex items-center gap-1.5"
        >
          <svg class="size-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
          Semua {{ ALL.length }} testimoni ditampilkan
        </p>

        <!-- Hint -->
        <p class="text-xs text-muted-foreground flex items-center gap-2 mt-1">
          <span class="block w-6 h-px bg-border" />
          Hover untuk menjeda · Scroll otomatis berlanjut
          <span class="block w-6 h-px bg-border" />
        </p>
      </div>

    </div>
  </section>
</template>

<style scoped>
.tc-card {
  will-change: transform;
}
</style>