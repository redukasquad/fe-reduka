<script setup lang="ts">
import { Image } from "@unpic/vue"
import { Icon } from "@iconify/vue"
</script>

<template>
  <div class="min-h-screen w-full flex">
    <!-- Left panel — branding (hidden on mobile) -->
    <div class="hidden lg:flex lg:w-[45%] pt-16 xl:w-[42%] relative bg-primary flex-col justify-between overflow-hidden shrink-0">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-full h-full" style="background-image: radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px); background-size: 40px 40px;" />
      </div>
      <!-- Glow blobs -->
      <div class="absolute top-1/4 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div class="absolute bottom-1/4 right-0 w-56 h-56 bg-white/8 rounded-full blur-2xl" />

      <!-- Center content -->
      <div class="relative z-10 px-10 flex-1 flex flex-col justify-center">
        <div class="mb-8">
          <Image src="/images/core/maskot.png" alt="maskot" class="w-56 xl:w-64 mx-auto drop-shadow-2xl" />
        </div>
        <h2 class="text-white text-2xl xl:text-3xl font-extrabold leading-snug mb-3">
          Raih Impianmu<br />Bersama Kami
        </h2>
        <p class="text-white/70 text-sm leading-relaxed max-w-xs">
          Platform pembelajaran inovatif untuk membantu kamu kembali meraih pendidikan yang lebih baik.
        </p>

        <!-- Stats -->
        <div class="flex gap-6 mt-8">
          <div>
            <p class="text-white font-extrabold text-xl">5K+</p>
            <p class="text-white/60 text-xs">Siswa Aktif</p>
          </div>
          <div class="w-px bg-white/20" />
          <div>
            <p class="text-white font-extrabold text-xl">100+</p>
            <p class="text-white/60 text-xs">Mentor</p>
          </div>
          <div class="w-px bg-white/20" />
          <div>
            <p class="text-white font-extrabold text-xl">500+</p>
            <p class="text-white/60 text-xs">Alumni PTN</p>
          </div>
        </div>
      </div>

      <!-- Bottom socials -->
      <div class="relative z-10 p-10 flex items-center gap-5">
        <a href="#" class="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors">
          <Icon icon="mdi:instagram" class="text-base" /> Instagram
        </a>
        <a href="#" class="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors">
          <Icon icon="mdi:email-outline" class="text-base" /> Email
        </a>
        <a href="#" class="flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors">
          <Icon icon="mdi:whatsapp" class="text-base" /> WhatsApp
        </a>
      </div>
    </div>

    <!-- Right panel — form -->
    <div class="flex-1 pt-8 flex flex-col items-center justify-center min-h-screen bg-gray-50 px-5 py-12 relative">
      <!-- Mobile logo -->
      <RouterLink to="/" class="lg:hidden flex items-center gap-2 mb-8">
        <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
          <Image src="/images/core/logo.png" alt="REDUKA" class="w-5 h-5 object-contain" />
        </div>
        <span class="text-primary font-extrabold text-lg">REDUKA</span>
      </RouterLink>

      <div class="w-full max-w-md">
        <RouterView />
      </div>
    </div>
  </div>
</template>
