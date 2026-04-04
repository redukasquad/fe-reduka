<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

const route = useRoute()

const errorMessages: Record<string, string> = {
  code_not_found: 'Kode otorisasi tidak ditemukan. Coba lagi.',
  token_exchange_failed: 'Gagal menukar token dengan Google. Coba lagi.',
  oauth_service_failed: 'Layanan Google OAuth tidak tersedia saat ini.',
  user_info_failed: 'Gagal mengambil informasi akun Google.',
  login_failed: 'Gagal masuk. Akun mungkin terdaftar dengan metode lain.',
}

const errorKey = computed(() => String(route.query.error ?? ''))
const errorMessage = computed(() => errorMessages[errorKey.value] ?? 'Terjadi kesalahan saat login dengan Google.')
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-sm w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-5">
      <div class="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
        <Icon icon="mdi:google" class="text-red-400 text-3xl" />
      </div>
      <div class="space-y-1.5">
        <h1 class="text-xl font-extrabold text-gray-900">Login Google Gagal</h1>
        <p class="text-sm text-gray-500">{{ errorMessage }}</p>
      </div>
      <RouterLink
        to="/auth/login"
        class="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        <Icon icon="mdi:arrow-left" />
        Kembali ke Login
      </RouterLink>
    </div>
  </div>
</template>
