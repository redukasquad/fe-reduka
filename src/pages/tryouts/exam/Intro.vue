<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'
import { TryoutRegistrationService } from '../../../services/tryouts.registration'
import { TryoutAttemptService } from '../../../services/tryout.attempt'
import { useExamStore } from '../../../stores/exam'

const route = useRoute()
const router = useRouter()
const exam = useExamStore()

// registrationId comes from route param
const regId = Number(route.params.registrationId)

const { data: regsData, isLoading } = useQuery({
  queryKey: ['my-tryout-registrations'],
  queryFn: () => TryoutRegistrationService.getMyRegistrations(),
})

const registration = computed(() => regsData.value?.data?.find(r => r.id === regId) ?? null)
const tryOut = computed(() => registration.value?.tryOut ?? null)
const isInProgress = computed(() => registration.value?.attempt?.status === 'in_progress')

const starting = ref(false)

async function handleStart() {
  if (!registration.value) return
  starting.value = true
  try {
    const res = await TryoutAttemptService.startAttempt(regId)
    const attempt = res.data
    if (!attempt) throw new Error('Gagal memulai attempt')

    exam.init(attempt.id, regId, tryOut.value?.name ?? '')

    if (attempt.status === 'completed') {
      router.replace(`/tryouts/exam/${regId}/result/${attempt.id}`)
      return
    }

    // Get current state to know which subtest to go to
    const stateRes = await TryoutAttemptService.getCurrentState(attempt.id)
    const state = stateRes.data
    exam.setSubtestProgress(state?.subtestProgress ?? [])

    router.replace(`/tryouts/exam/${regId}/attempt/${attempt.id}`)
  } catch (e: any) {
    toast.error(e?.response?.data?.message ?? 'Gagal memulai tryout')
  } finally {
    starting.value = false
  }
}


</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div v-if="isLoading" class="w-full max-w-lg bg-white rounded-2xl p-8 animate-pulse space-y-4">
      <div class="h-6 bg-gray-200 rounded w-2/3" />
      <div class="h-4 bg-gray-100 rounded w-1/2" />
    </div>

    <div v-else-if="!registration" class="text-center space-y-3">
      <Icon icon="mdi:alert-circle-outline" class="text-5xl text-red-400 mx-auto" />
      <p class="text-gray-600">Registrasi tidak ditemukan.</p>
      <RouterLink to="/dashboard/user" class="text-primary text-sm hover:underline">Kembali ke Dashboard</RouterLink>
    </div>

    <div v-else class="w-full max-w-lg space-y-4">
      <!-- Header card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div v-if="tryOut?.imageUrl" class="h-40 overflow-hidden">
          <img :src="tryOut.imageUrl" :alt="tryOut.name" class="w-full h-full object-cover" />
        </div>
        <div class="p-6">
          <h1 class="text-xl font-extrabold text-gray-900 mb-1">{{ tryOut?.name ?? 'Try Out' }}</h1>
          <p class="text-sm text-gray-500">Baca petunjuk berikut sebelum memulai ujian</p>
        </div>
      </div>

      <!-- Info -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h2 class="text-sm font-bold text-gray-700 flex items-center gap-2">
          <Icon icon="mdi:information-outline" class="text-primary" /> Informasi Ujian
        </h2>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-primary/5 rounded-xl p-3 text-center">
            <p class="text-2xl font-extrabold text-primary">7</p>
            <p class="text-xs text-gray-500 mt-0.5">Subtes</p>
          </div>
          <div class="bg-violet-50 rounded-xl p-3 text-center">
            <p class="text-2xl font-extrabold text-violet-600">1x</p>
            <p class="text-xs text-gray-500 mt-0.5">Kesempatan</p>
          </div>
        </div>
      </div>

      <!-- Rules -->
      <div class="bg-amber-50 border border-amber-100 rounded-2xl p-5 space-y-2">
        <h2 class="text-sm font-bold text-amber-800 flex items-center gap-2">
          <Icon icon="mdi:alert-outline" class="text-amber-500" /> Peraturan
        </h2>
        <ul class="text-xs text-amber-700 space-y-1.5 list-none">
          <li class="flex items-start gap-2"><Icon icon="mdi:circle-small" class="shrink-0 mt-0.5" />Setiap subtes memiliki batas waktu tersendiri</li>
          <li class="flex items-start gap-2"><Icon icon="mdi:circle-small" class="shrink-0 mt-0.5" />Subtes harus dikerjakan secara berurutan</li>
          <li class="flex items-start gap-2"><Icon icon="mdi:circle-small" class="shrink-0 mt-0.5" />Waktu habis = subtes otomatis disubmit</li>
          <li class="flex items-start gap-2"><Icon icon="mdi:circle-small" class="shrink-0 mt-0.5" />Tidak bisa kembali ke subtes sebelumnya</li>
          <li class="flex items-start gap-2"><Icon icon="mdi:circle-small" class="shrink-0 mt-0.5" />Kamu hanya bisa mengerjakan tryout ini 1 kali</li>
        </ul>
      </div>

      <!-- CTA -->
      <button @click="handleStart" :disabled="starting || registration.paymentStatus !== 'approved'"
        class="w-full py-4 rounded-2xl bg-primary text-white font-extrabold text-base hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
        <Icon v-if="starting" icon="mdi:loading" class="animate-spin text-xl" />
        <Icon v-else :icon="isInProgress ? 'mdi:play-circle' : 'mdi:play-circle-outline'" class="text-xl" />
        {{ starting ? 'Memuat...' : isInProgress ? 'Lanjutkan Ujian' : 'Mulai Ujian' }}
      </button>

      <p v-if="registration.paymentStatus !== 'approved'" class="text-center text-xs text-red-500">
        Pembayaran belum diverifikasi. Tidak bisa memulai ujian.
      </p>

      <RouterLink to="/dashboard/user" class="block text-center text-sm text-gray-400 hover:text-gray-600 transition-colors">
        ← Kembali ke Dashboard
      </RouterLink>
    </div>
  </div>
</template>
