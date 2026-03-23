<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'

const navLinks = [
  { label: 'Programs', to: '/programs', icon: 'mdi:school-outline' },
  { label: 'Courses',  to: '/courses',  icon: 'mdi:book-open-variant' },
  { label: 'Tryouts',  to: '/tryouts',  icon: 'mdi:clipboard-text-outline' },
  { label: 'Kontak',   to: '/contact',  icon: 'mdi:headset' },
]

const legalLinks = [
  { label: 'Syarat & Ketentuan', to: '/terms' },
  { label: 'Kebijakan Privasi',  to: '/privacy' },
]

const socials = [
  { label: 'Instagram', icon: 'mdi:instagram', href: '#' },
  { label: 'WhatsApp',  icon: 'mdi:whatsapp',  href: '#' },
  { label: 'YouTube',   icon: 'mdi:youtube',   href: '#' },
]
</script>

<template>
  <footer class="w-full bg-gray-950 text-white relative overflow-hidden">
    <!-- Decorative glow -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />
    <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

    <div class="relative max-w-[95%] mx-auto px-6 pt-16 pb-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-12 border-b border-white/8">

        <!-- Brand -->
        <div class="md:col-span-5 space-y-5">
          <RouterLink to="/" class="inline-flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <img src="/images/core/logo.png" alt="REDUKA" class="w-5 h-5 object-contain" />
            </div>
            <span class="font-extrabold text-xl tracking-tight text-white">REDUKA</span>
          </RouterLink>

          <p class="text-sm text-gray-400 max-w-sm leading-relaxed">
            Platform pembelajaran inovatif yang membantu siswa putus sekolah untuk kembali meraih impian pendidikan mereka secara adil dan berkelanjutan.
          </p>

          <!-- Socials -->
          <div class="flex items-center gap-2 pt-1">
            <a
              v-for="s in socials"
              :key="s.label"
              :href="s.href"
              :title="s.label"
              class="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-all duration-200"
            >
              <Icon :icon="s.icon" class="text-lg" />
            </a>
          </div>
        </div>

        <!-- Spacer -->
        <div class="hidden md:block md:col-span-1" />

        <!-- Nav links -->
        <div class="md:col-span-2 space-y-4">
          <p class="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Navigasi</p>
          <nav class="flex flex-col gap-2">
            <RouterLink
              v-for="l in navLinks"
              :key="l.to"
              :to="l.to"
              class="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-150 group"
            >
              <Icon :icon="l.icon" class="text-base text-gray-600 group-hover:text-primary transition-colors" />
              {{ l.label }}
            </RouterLink>
          </nav>
        </div>

        <!-- Legal -->
        <div class="md:col-span-2 space-y-4">
          <p class="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Legal</p>
          <nav class="flex flex-col gap-2">
            <RouterLink
              v-for="l in legalLinks"
              :key="l.to"
              :to="l.to"
              class="text-sm text-gray-400 hover:text-white transition-colors duration-150"
            >
              {{ l.label }}
            </RouterLink>
          </nav>
        </div>

        <!-- Contact -->
        <div class="md:col-span-2 space-y-4">
          <p class="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Kontak</p>
          <div class="space-y-2.5">
            <a href="#" class="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors group">
              <span class="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon icon="mdi:instagram" class="text-sm" />
              </span>
              Instagram
            </a>
            <a href="#" class="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors group">
              <span class="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon icon="mdi:whatsapp" class="text-sm" />
              </span>
              WhatsApp
            </a>
            <a href="mailto:info@reduka.id" class="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors group">
              <span class="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon icon="mdi:email-outline" class="text-sm" />
              </span>
              Email
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-xs text-gray-600">
          © {{ new Date().getFullYear() }} REDUKA Community Academy. All rights reserved.
        </p>
        <div class="flex items-center gap-1.5 text-xs text-gray-600">
          <span>Made with XninetzyLabs</span>
          <Icon icon="mdi:heart" class="text-red-500 text-xs" />
          <span>for education</span>
        </div>
      </div>
    </div>
  </footer>
</template>
