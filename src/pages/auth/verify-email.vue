<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import OtpForm from '../../components/auth/OtpForm.vue'
import ResendForm from '../../components/auth/ResendForm.vue'

const showResend = ref(false)
</script>

<template>
  <div class="space-y-6">
    <div class="text-center">
      <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Icon icon="mdi:email-check-outline" class="text-primary text-3xl" />
      </div>
      <h1 class="text-2xl font-extrabold text-gray-900">Verifikasi Email</h1>
      <p class="text-sm text-gray-500 mt-1.5 max-w-xs mx-auto">
        Masukkan kode 6 digit yang telah dikirim ke email kamu
      </p>
    </div>

    <OtpForm v-if="!showResend" />
    <ResendForm v-else v-model="showResend" />

    <button
      @click="showResend = !showResend"
      class="w-full text-sm text-center text-gray-500 hover:text-primary transition-colors"
    >
      {{ showResend ? '← Kembali ke verifikasi' : 'Tidak menerima kode? Kirim ulang' }}
    </button>
  </div>
</template>
