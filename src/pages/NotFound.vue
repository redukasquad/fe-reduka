<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="w-full h-screen flex flex-col items-center justify-center text-center px-6 z-29">
    <h1 class="text-6xl font-bold text-primary">404</h1>
    <p class="mt-4 text-lg text-gray-600">
      Halaman yang kamu cari tidak ditemukan
      Sabar yak masih belum dibikin hehe...
    </p>

    <div class="flex gap-3 mt-6">
      <RouterLink
        to="/"
        class="px-4 py-2 rounded bg-primary text-white hover:bg-primary/80 transition"
      >
        Kembali ke Beranda
      </RouterLink>

      <button
        @click="goBack"
        class="px-4 py-2 rounded border border-primary text-primary hover:bg-primary/10 transition"
      >
        Kembali
      </button>
    </div>
  </div>
</template>
