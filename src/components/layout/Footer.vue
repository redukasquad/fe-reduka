<script setup lang="ts">
import { RouterLink } from 'vue-router'

const footerLinks = [
  { label: 'Programs', to: '/programs' },
  { label: 'Courses',  to: '/courses'  },
  { label: 'Tryouts',  to: '/tryouts'  },
  { label: 'Tentang',  to: '/about'    },
]

const legalLinks = [
  { label: 'Syarat & Ketentuan', to: '/terms' },
  { label: 'Kebijakan Privasi',  to: '/privacy' },
]
</script>

<template>
  <footer class="w-full bg-background border-t border-border py-12 md:py-16">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">

        <!-- Brand Info -->
        <div class="md:col-span-5 space-y-4">
          <RouterLink to="/" class="inline-block">
            <img src="/images/core/logo.png" alt="REDUKA" class="h-8 w-auto" />
          </RouterLink>
          <p class="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Platform pembelajaran inovatif yang berfokus membantu siswa putus sekolah untuk kembali meraih impian pendidikan mereka secara adil dan berkelanjutan.
          </p>
          <div class="pt-2 text-xs text-muted-foreground font-medium uppercase tracking-tight">
            © 2024 REDUKA Community Academy. All rights reserved.
          </div>
        </div>

        <!-- Spacer -->
        <div class="hidden md:block md:col-span-1"></div>

        <!-- Links -->
        <div class="md:col-span-2 space-y-4">
          <p class="text-[10px] font-bold text-foreground tracking-widest uppercase mb-4">Navigasi</p>
          <nav class="flex flex-col gap-2.5">
            <RouterLink v-for="l in footerLinks" :key="l.to" :to="l.to"
              class="text-sm text-muted-foreground hover:text-primary transition-colors duration-150">
              {{ l.label }}
            </RouterLink>
          </nav>
        </div>

        <!-- Legal -->
        <div class="md:col-span-2 space-y-4">
          <p class="text-[10px] font-bold text-foreground tracking-widest uppercase mb-4">Legal</p>
          <nav class="flex flex-col gap-2.5">
            <RouterLink v-for="l in legalLinks" :key="l.to" :to="l.to"
              class="text-sm text-muted-foreground hover:text-primary transition-colors duration-150">
              {{ l.label }}
            </RouterLink>
          </nav>
        </div>

        <!-- Kontak -->
        <div class="md:col-span-2 space-y-4">
          <p class="text-[10px] font-bold text-foreground tracking-widest uppercase mb-4">Kontak</p>
          <div class="space-y-3 text-sm text-muted-foreground">
            <p class="flex items-center gap-2 hover:text-foreground cursor-pointer transition-colors">
               <span class="size-1.5 rounded-full bg-primary/40 block"></span>
               Instagram
            </p>
            <p class="flex items-center gap-2 hover:text-foreground cursor-pointer transition-colors">
               <span class="size-1.5 rounded-full bg-primary/40 block"></span>
               WhatsApp
            </p>
            <p class="flex items-center gap-2 hover:text-foreground cursor-pointer transition-colors">
               <span class="size-1.5 rounded-full bg-primary/40 block"></span>
               Email
            </p>
          </div>
        </div>

      </div>
    </div>
  </footer>
</template>
