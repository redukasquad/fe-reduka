<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, nextTick, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ALL = [
  { quote: 'REDUKA memberi saya kesempatan kedua. Sekarang saya lulus SMA dan diterima di universitas negeri melalui jalur prestasi yang tidak pernah saya bayangkan.', name: 'Andi Pratama', role: 'Alumni 2023', initial: 'A', tag: 'Universitas Negeri' },
  { quote: 'Mentornya sabar dan materi mudah dipahami. Saya tidak merasa sendiri dalam mengejar ketertinggalan.', name: 'Siti Nurhaliza', role: 'Siswa Aktif', initial: 'S', tag: 'Program SMA' },
  { quote: 'Gratis dan berkualitas. Tidak menyangka bisa belajar dari mana saja dengan mentor terbaik tanpa biaya sepeser pun.', name: 'Budi Santoso', role: 'Alumni 2022', initial: 'B', tag: 'Belajar Online' },
  { quote: 'Berkat REDUKA saya bisa menyiapkan diri untuk UTBK meskipun lama tidak bersekolah.', name: 'Dewi Rahayu', role: 'Alumni 2023', initial: 'D', tag: 'Lolos UTBK' },
  { quote: 'Program mentoring satu-satu benar-benar membantu saya fokus.', name: 'Rizki Maulana', role: 'Siswa Aktif', initial: 'R', tag: 'Mentoring 1-on-1' },
  { quote: 'Saya kembali percaya diri setelah 3 tahun tidak sekolah.', name: 'Fatimah Zahra', role: 'Alumni 2022', initial: 'F', tag: 'Comeback Story' },
  { quote: 'Materinya lengkap dari dasar.', name: 'Hendra Kusuma', role: 'Siswa Aktif', initial: 'H', tag: 'Mulai dari Nol' },
  { quote: 'Komunitas REDUKA sangat supportif.', name: 'Nadia Putri', role: 'Alumni 2023', initial: 'N', tag: 'Komunitas' },
  { quote: 'Saya bisa belajar di sela-sela kerja.', name: 'Wahyu Saputro', role: 'Siswa Aktif', initial: 'W', tag: 'Belajar Fleksibel' },
  { quote: 'Kini saya sudah selesai ujian kesetaraan.', name: 'Laila Indah', role: 'Alumni 2024', initial: 'L', tag: 'Ujian Kesetaraan' },
]

const STEP_FIRST = 7
const STEP_MORE = 3

const shown = ref(STEP_FIRST)
const isExpanding = ref(false)

const MAX_RENDER = 18

const visibleItems = computed(() =>
  ALL.slice(0, shown.value).slice(-MAX_RENDER)
)

const hasMore = computed(() => shown.value < ALL.length)

const loadMore = async () => {
  if (isExpanding.value || !hasMore.value) return

  isExpanding.value = true

  shown.value = Math.min(
    shown.value + STEP_MORE,
    ALL.length
  )

  await nextTick()

  setTimeout(() => {
    restartScroll()
    ScrollTrigger.refresh()
    isExpanding.value = false
  }, 120)
}

const cols = computed(() => {
  const c0 = visibleItems.value.filter((_, i) => i % 3 === 0)
  const c1 = visibleItems.value.filter((_, i) => i % 3 === 1)
  const c2 = visibleItems.value.filter((_, i) => i % 3 === 2)

  return [
    [...c0, ...c0],
    [...c1, ...c1],
    [...c2, ...c2]
  ]
})

const sectionRef = ref<HTMLElement>()
const colRefs = ref<(HTMLElement | null)[]>([null, null, null])

const setColRef = (el: HTMLElement | null, i: number) => {
  colRefs.value[i] = el
}

let tweens: gsap.core.Tween[] = []

let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null

const SPEEDS = [32, 42, 26]

const killAll = () => {
  tweens.forEach(t => t.kill())
  tweens = []
}

const startScroll = (retry = 0) => {
  killAll()

  colRefs.value.forEach((col, i) => {
    if (!col) return

    const half = col.scrollHeight / 2

    if (half <= 0) {
      if (retry < 5)
        setTimeout(() => startScroll(retry + 1), 100)

      return
    }

    gsap.set(col, { y: 0 })

    const tween = gsap.to(col, {
      y: -half,
      duration: SPEEDS[i],
      ease: 'none',
      repeat: -1,
      onRepeat() {
        gsap.set(col, { y: 0 })
      }
    })

    tweens.push(tween)
  })
}

const restartScroll = () => {
  killAll()
  requestAnimationFrame(startScroll)
}

const pauseAll = () => tweens.forEach(t => t.pause())
const resumeAll = () => tweens.forEach(t => t.resume())

onMounted(async () => {
  await nextTick()

  resizeObserver = new ResizeObserver(() => {
    restartScroll()
    ScrollTrigger.refresh()
  })

  colRefs.value.forEach(col => {
    if (col) resizeObserver?.observe(col)
  })

  intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        startScroll()
      } else {
        pauseAll()
      }
    },
    { threshold: 0.15 }
  )

  if (sectionRef.value) {
    intersectionObserver.observe(sectionRef.value)
  }

  gsap.fromTo(
    sectionRef.value!,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%'
      }
    }
  )

  setTimeout(() => {
    startScroll()
    ScrollTrigger.refresh()
  }, 200)
})

watch(visibleItems, async () => {
  await nextTick()

  setTimeout(() => {
    restartScroll()
    ScrollTrigger.refresh()
  }, 120)
})

onUnmounted(() => {
  killAll()
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
})
</script>

<template>
  <section
    ref="sectionRef"
    class="w-full bg-secondary py-20 md:py-28 overflow-hidden"
    @mouseenter="pauseAll"
    @mouseleave="resumeAll"
  >
    <div class="max-w-7xl mx-auto px-6">

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

      <div
        class="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-hidden"
        style="height:520px; mask-image:linear-gradient(to bottom, transparent 0%, black 7%, black 93%, transparent 100%);"
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
            class="rounded-2xl border border-border bg-background p-5
                   hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <span class="inline-block text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-2.5 py-0.5 mb-3">
              {{ item.tag }}
            </span>

            <p class="text-sm leading-relaxed text-foreground mb-4">
              {{ item.quote }}
            </p>

            <div class="flex items-center gap-3 pt-3 border-t border-border">
              <div class="size-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary uppercase">
                {{ item.initial }}
              </div>
              <div>
                <p class="text-xs font-semibold text-foreground truncate">
                  {{ item.name }}
                </p>
                <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  {{ item.role }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center gap-3 mt-10">
        <button
          v-if="hasMore"
          class="px-6 py-2.5 rounded-lg text-sm font-semibold border border-border bg-background hover:bg-muted"
          :disabled="isExpanding"
          @click="loadMore"
        >
          {{ isExpanding ? 'Memuat...' : `More (${ALL.length - shown} tersisa)` }}
        </button>

        <p v-else class="text-xs text-primary">
          Semua {{ ALL.length }} testimoni ditampilkan
        </p>
      </div>

    </div>
  </section>
</template>