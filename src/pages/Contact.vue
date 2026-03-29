<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const form = ref({ name: '', email: '', subject: '', message: '' })
const submitted = ref(false)
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  loading.value = false
  submitted.value = true
}

const contacts = [
  {
    icon: 'mdi:whatsapp',
    label: 'WhatsApp',
    value: '+62 812-3456-7890',
    href: 'https://wa.me/6281234567890',
    color: '#16a34a',
    bg: '#f0fdf4',
    shadow: 'rgba(22,163,74,0.25)',
    glow: 'rgba(22,163,74,0.12)',
  },
  {
    icon: 'mdi:instagram',
    label: 'Instagram',
    value: '@reduka.id',
    href: 'https://instagram.com/reduka.id',
    color: '#db2777',
    bg: '#fdf2f8',
    shadow: 'rgba(219,39,119,0.25)',
    glow: 'rgba(219,39,119,0.12)',
  },
  {
    icon: 'mdi:email-outline',
    label: 'Email',
    value: 'info@reduka.id',
    href: 'mailto:info@reduka.id',
    color: '#047857',
    bg: '#ecfdf5',
    shadow: 'rgba(4,120,87,0.25)',
    glow: 'rgba(4,120,87,0.12)',
  },
  {
    icon: 'mdi:youtube',
    label: 'YouTube',
    value: 'REDUKA Academy',
    href: 'https://youtube.com/@reduka',
    color: '#dc2626',
    bg: '#fef2f2',
    shadow: 'rgba(220,38,38,0.25)',
    glow: 'rgba(220,38,38,0.12)',
  },
]

const faqs = [
  { q: 'Bagaimana cara mendaftar kursus?', a: 'Buat akun, pilih kursus yang diinginkan, lalu klik tombol Daftar. Admin akan memverifikasi pendaftaran kamu.' },
  { q: 'Berapa lama proses verifikasi?', a: 'Biasanya 1–2 hari kerja. Kamu akan mendapat notifikasi via email setelah disetujui.' },
  { q: 'Apakah ada biaya pendaftaran?', a: 'Tergantung program. Beberapa program tersedia gratis, sementara yang lain berbayar sesuai paket.' },
  { q: 'Bagaimana jika saya lupa password?', a: 'Gunakan fitur "Lupa Password" di halaman login. Link reset akan dikirim ke email kamu.' },
]

const openFaq = ref<number | null>(null)

// 3D tilt on social cards
function onCardEnter(e: MouseEvent, idx: number) {
  const card = (e.currentTarget as HTMLElement)
  const rect = card.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dx = (e.clientX - cx) / (rect.width / 2)
  const dy = (e.clientY - cy) / (rect.height / 2)
  gsap.to(card, {
    rotateY: dx * 12,
    rotateX: -dy * 12,
    scale: 1.06,
    boxShadow: `${-dx * 8}px ${dy * 8}px 32px ${contacts[idx]?.shadow}, 0 0 40px ${contacts[idx]?.glow}`,
    duration: 0.3,
    ease: 'power2.out',
    transformPerspective: 600,
  })
}

function onCardMove(e: MouseEvent, idx: number) {
  const card = (e.currentTarget as HTMLElement)
  const rect = card.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dx = (e.clientX - cx) / (rect.width / 2)
  const dy = (e.clientY - cy) / (rect.height / 2)
  gsap.to(card, {
    rotateY: dx * 12,
    rotateX: -dy * 12,
    boxShadow: `${-dx * 8}px ${dy * 8}px 32px ${contacts[idx]?.shadow}, 0 0 40px ${contacts[idx]?.glow}`,
    duration: 0.15,
    ease: 'power2.out',
  })
}

function onCardLeave(e: MouseEvent) {
  const card = (e.currentTarget as HTMLElement)
  gsap.to(card, {
    rotateY: 0,
    rotateX: 0,
    scale: 1,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    duration: 0.4,
    ease: 'power3.out',
  })
}

onMounted(() => {
  // Hero entrance
  gsap.from('.hero-content > *', {
    y: 30,
    opacity: 0,
    stagger: 0.12,
    duration: 0.7,
    ease: 'power3.out',
    delay: 0.1,
  })

  // Social cards stagger in
  gsap.from('.social-card', {
    scrollTrigger: { trigger: '.social-cards-row', start: 'top 85%' },
    y: 50,
    opacity: 0,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power3.out',
  })

  // Form + info panel
  gsap.from('.form-panel', {
    scrollTrigger: { trigger: '.form-panel', start: 'top 85%' },
    x: -40,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out',
  })
  gsap.from('.info-panel', {
    scrollTrigger: { trigger: '.info-panel', start: 'top 85%' },
    x: 40,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out',
  })

  // FAQ items
  gsap.from('.faq-item', {
    scrollTrigger: { trigger: '.faq-section', start: 'top 85%' },
    y: 24,
    opacity: 0,
    stagger: 0.08,
    duration: 0.5,
    ease: 'power2.out',
  })
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- ── Hero ──────────────────────────────────────────────────────────── -->
    <section class="relative bg-linear-to-br from-primary via-emerald-700 to-teal-600 pt-32 pb-32 overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-10 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div class="absolute bottom-0 right-1/4 w-96 h-48 bg-teal-400/10 rounded-full blur-3xl" />
        <div class="absolute inset-0 opacity-[0.04]"
          style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 40px 40px;" />
      </div>
      <div class="hero-content relative max-w-4xl mx-auto px-6 text-center">
        <div class="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/80 mb-6">
          <Icon icon="mdi:headset" class="text-base" />
          Kami siap membantu kamu
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Hubungi Kami
        </h1>
        <p class="text-white/70 text-lg max-w-xl mx-auto">
          Ada pertanyaan, saran, atau butuh bantuan? Tim REDUKA siap merespons kamu secepatnya.
        </p>
      </div>
    </section>

    <!-- ── Social cards — OUTSIDE hero, no overlap ───────────────────────── -->
    <div class="social-cards-row max-w-5xl mx-auto px-6 -mt-12 relative z-10">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
        <a
          v-for="(c, i) in contacts"
          :key="c.label"
          :href="c.href"
          target="_blank"
          class="social-card group flex flex-col items-center gap-4 p-6 rounded-2xl bg-white border border-gray-100 cursor-pointer select-none"
          style="transform-style: preserve-3d; will-change: transform; box-shadow: 0 4px 20px rgba(0,0,0,0.08);"
          @mouseenter="onCardEnter($event, i)"
          @mousemove="onCardMove($event, i)"
          @mouseleave="onCardLeave($event)"
        >
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
            :style="{ background: c.bg }"
          >
            <Icon :icon="c.icon" class="text-3xl" :style="{ color: c.color }" />
          </div>
          <div class="text-center">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ c.label }}</p>
            <p class="text-sm font-semibold text-gray-700 mt-0.5">{{ c.value }}</p>
          </div>
        </a>
      </div>
    </div>

    <!-- ── Main content ───────────────────────────────────────────────────── -->
    <div class="max-w-6xl mx-auto px-6 pt-12 pb-24 space-y-16">

      <!-- Form + info -->
      <div class="grid md:grid-cols-5 gap-8">

        <!-- Contact form -->
        <div class="form-panel md:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div class="mb-6">
            <h2 class="text-xl font-bold text-gray-900">Kirim Pesan</h2>
            <p class="text-sm text-gray-500 mt-1">Isi form di bawah, kami akan balas dalam 1×24 jam.</p>
          </div>

          <div v-if="submitted" class="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div class="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <Icon icon="mdi:check-circle-outline" class="text-4xl text-emerald-500" />
            </div>
            <h3 class="font-bold text-gray-900">Pesan Terkirim!</h3>
            <p class="text-sm text-gray-500 max-w-xs">Terima kasih sudah menghubungi kami. Tim kami akan segera merespons.</p>
            <button @click="submitted = false; form = { name: '', email: '', subject: '', message: '' }"
              class="mt-2 text-sm font-semibold text-primary hover:underline">
              Kirim pesan lain
            </button>
          </div>

          <form v-else @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nama</label>
                <input v-model="form.name" required placeholder="Nama lengkap"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</label>
                <input v-model="form.email" type="email" required placeholder="email@kamu.com"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              </div>
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Subjek</label>
              <input v-model="form.subject" required placeholder="Topik pesan kamu"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Pesan</label>
              <textarea v-model="form.message" required rows="5" placeholder="Tulis pesanmu di sini..."
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" />
            </div>
            <button type="submit" :disabled="loading"
              class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-all duration-200">
              <Icon v-if="loading" icon="mdi:loading" class="animate-spin text-base" />
              <Icon v-else icon="mdi:send-outline" class="text-base" />
              {{ loading ? 'Mengirim...' : 'Kirim Pesan' }}
            </button>
          </form>
        </div>

        <!-- Info panel -->
        <div class="info-panel md:col-span-2 space-y-6">
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 class="font-bold text-gray-900 text-sm">Informasi Kontak</h3>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon icon="mdi:map-marker-outline" class="text-primary text-sm" />
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-500">Alamat</p>
                  <p class="text-sm text-gray-700">Jl. Pendidikan No. 1, Indonesia</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon icon="mdi:clock-outline" class="text-primary text-sm" />
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-500">Jam Operasional</p>
                  <p class="text-sm text-gray-700">Senin – Jumat, 08.00 – 17.00 WIB</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon icon="mdi:reply-outline" class="text-primary text-sm" />
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-500">Waktu Respons</p>
                  <p class="text-sm text-gray-700">Maks. 1×24 jam kerja</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-linear-to-br from-primary/5 to-emerald-50 rounded-3xl border border-primary/10 p-6 space-y-3">
            <h3 class="font-bold text-gray-900 text-sm">Butuh Bantuan Cepat?</h3>
            <p class="text-xs text-gray-500">Langsung chat via WhatsApp untuk respons lebih cepat.</p>
            <a href="https://wa.me/6281234567890" target="_blank"
              class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors">
              <Icon icon="mdi:whatsapp" class="text-base" />
              Chat WhatsApp
            </a>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <div class="faq-section max-w-3xl mx-auto">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Pertanyaan Umum</h2>
          <p class="text-sm text-gray-500 mt-2">Jawaban untuk pertanyaan yang sering ditanyakan.</p>
        </div>
        <div class="space-y-3">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="faq-item bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200"
            :class="openFaq === i ? 'shadow-sm' : ''"
          >
            <button
              @click="openFaq = openFaq === i ? null : i"
              class="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <span class="font-semibold text-gray-800 text-sm">{{ faq.q }}</span>
              <Icon
                icon="mdi:chevron-down"
                :class="['text-gray-400 text-lg transition-transform duration-200 shrink-0 ml-3', openFaq === i ? 'rotate-180' : '']"
              />
            </button>
            <div v-if="openFaq === i" class="px-6 pb-4">
              <p class="text-sm text-gray-500 leading-relaxed">{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
