<script setup lang="ts">
</script>

<template>
  <div class="w-full h-screen flex flex-col items-center justify-center text-center px-6 z-29">
    <h1 class="text-6xl font-bold text-primary">404</h1>
    <p class="mt-4 text-lg text-gray-600">
      Halaman yang kamu cari tidak ditemukan
    </p>

    <RouterLink
      to="/"
      class="mt-6 px-4 py-2 rounded bg-primary text-white hover:bg-primary/80 transition"
    >
      Kembali ke Beranda
    </RouterLink>
  </div>
</template>
