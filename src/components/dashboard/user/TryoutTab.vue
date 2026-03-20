<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useQuery } from '@tanstack/vue-query'
import { TryoutRegistrationService } from '../../../services/tryouts.registration'

const { data, isLoading } = useQuery({
  queryKey: ['my-tryout-registrations'],
  queryFn: () => TryoutRegistrationService.getMyRegistrations(),
  staleTime: 1000 * 60,
})
const regs = computed(() => data.value?.data ?? [])

const paymentStatusColor = (s: string) => ({ approved: 'bg-emerald-100 text-emerald-700', pending: 'bg-amber-100 text-amber-700', rejected: 'bg-red-100 text-red-700' }[s] ?? 'bg-gray-100 text-gray-600')
const paymentStatusLabel = (s: string) => ({ approved: 'Pembayaran Disetujui', pending: 'Menunggu Verifikasi', rejected: 'Pembayaran Ditolak' }[s] ?? s)
const attemptStatusLabel = (s?: string) => ({ not_started: 'Belum Dimulai', in_progress: 'Sedang Berlangsung', completed: 'Selesai' }[s ?? ''] ?? '-')
</script>

<template>
  <div>
    <div v-if="isLoading" class="space-y-3">
      <div v-for="n in 3" :key="n" class="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse flex gap-4">
        <div class="w-11 h-11 rounded-xl bg-gray-200 shrink-0" />
        <div class="flex-1 space-y-2 py-1">
          <div class="h-4 bg-gray-200 rounded w-2/3" />
          <div class="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
    </div>

    <div v-else-if="regs.length === 0" class="py-16 text-center space-y-3">
      <div class="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto">
        <Icon icon="mdi:clipboard-off-outline" class="text-3xl text-violet-300" />
      </div>
      <p class="font-semibold text-gray-500">Belum ada try out yang diikuti</p>
      <RouterLink to="/tryouts" class="inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
        <Icon icon="mdi:plus" /> Jelajahi Try Out
      </RouterLink>
    </div>

    <div v-else class="space-y-3">
      <div v-for="reg in regs" :key="reg.id"
        class="bg-white rounded-2xl border border-gray-100 p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200">
        <div class="flex items-start gap-4">
          <div class="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-violet-50 flex items-center justify-center">
            <img v-if="reg.tryOut?.imageUrl" :src="reg.tryOut.imageUrl" :alt="reg.tryOut?.name" class="w-full h-full object-cover" />
            <Icon v-else icon="mdi:clipboard-text-outline" class="text-violet-400 text-lg" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 flex-wrap">
              <h3 class="font-semibold text-gray-900 text-sm">{{ reg.tryOut?.name || `Try Out #${reg.tryOutId}` }}</h3>
              <span :class="['text-xs font-bold px-2.5 py-1 rounded-full shrink-0', paymentStatusColor(reg.paymentStatus)]">
                {{ paymentStatusLabel(reg.paymentStatus) }}
              </span>
            </div>
            <div v-if="reg.paymentStatus === 'approved'" class="mt-2 flex items-center gap-2 flex-wrap">
              <span class="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                <Icon icon="mdi:progress-check" class="text-primary" />{{ attemptStatusLabel(reg.attempt?.status) }}
              </span>

              <!-- Completed: show score prominently + view result -->
              <template v-if="reg.attempt?.status === 'completed'">
                <span v-if="reg.attempt?.totalScore != null"
                  class="inline-flex items-center gap-1 text-xs font-bold text-violet-700 bg-violet-100 px-2.5 py-1 rounded-lg">
                  <Icon icon="mdi:trophy-outline" /> {{ reg.attempt.totalScore.toFixed(1) }}
                </span>
                <RouterLink :to="`/tryouts/exam/${reg.id}/result/${reg.attempt?.id}`"
                  class="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-lg transition-colors">
                  <Icon icon="mdi:chart-bar" /> Lihat Hasil
                </RouterLink>
              </template>

              <!-- Not started / in progress -->
              <RouterLink v-else :to="`/tryouts/exam/${reg.id}`"
                class="inline-flex items-center gap-1 text-xs font-bold text-white bg-primary hover:bg-primary/90 px-3 py-1 rounded-lg transition-colors">
                <Icon icon="mdi:play-outline" />{{ reg.attempt?.status === 'in_progress' ? 'Lanjutkan' : 'Mulai' }}
              </RouterLink>
            </div>
            <p v-if="reg.paymentStatus === 'rejected' && reg.rejectionReason"
              class="mt-2 text-xs text-red-500 bg-red-50 rounded-lg px-3 py-1.5">{{ reg.rejectionReason }}</p>
            <p class="text-[10px] text-gray-400 mt-2">
              Didaftarkan {{ new Date(reg.registeredAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
