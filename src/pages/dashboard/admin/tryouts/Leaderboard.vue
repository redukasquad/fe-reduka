<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import { TryoutService } from '../../../../services/tryout'
import { TryoutAttemptService } from '../../../../services/tryout.attempt'

const route = useRoute()
const router = useRouter()
const tryoutId = Number(route.params.id)

const { data: tryoutData, isLoading: tryoutLoading } = useQuery({
  queryKey: ['tryout', tryoutId],
  queryFn: () => TryoutService.findOne(tryoutId),
  enabled: !!tryoutId,
})

const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ['leaderboard', tryoutId],
  queryFn: () => TryoutAttemptService.getLeaderboard(tryoutId),
  staleTime: 1000 * 30,
  enabled: !!tryoutId,
})

const tryout = computed(() => tryoutData.value?.data ?? null)
const entries = computed(() => data.value?.data ?? [])

const rankMedal = (rank: number) => {
  if (rank === 1) return { icon: 'mdi:trophy', color: 'text-yellow-500 bg-yellow-50' }
  if (rank === 2) return { icon: 'mdi:medal', color: 'text-gray-400 bg-gray-50' }
  if (rank === 3) return { icon: 'mdi:medal', color: 'text-amber-600 bg-amber-50' }
  return null
}

function formatDate(d?: string) {
  if (!d) return '-'
  return new Date(d).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
</script>

<template>
  <DashboardLayout>
    <div class="backdrop-blur min-h-screen px-4 py-2">
      <!-- Back -->
      <div class="flex items-center gap-3 mb-5">
        <button
          @click="router.push({ name: 'admin-tryouts-view', params: { id: tryoutId } })"
          class="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
        >
          <Icon icon="mdi:chevron-left" class="text-xl" />
        </button>
        <div>
          <p class="text-xs text-gray-400">Tryout</p>
          <h1 class="text-lg font-bold text-gray-900 leading-tight">
            {{ tryoutLoading ? '...' : tryout?.name ?? 'Leaderboard' }}
          </h1>
        </div>
        <button
          @click="refetch()"
          class="ml-auto p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          title="Refresh"
        >
          <Icon icon="mdi:refresh" />
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <!-- Header -->
        <div class="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <Icon icon="mdi:podium-gold" class="text-yellow-500 text-2xl" />
          <div>
            <h2 class="font-bold text-gray-900">Leaderboard</h2>
            <p class="text-xs text-gray-400">{{ entries.length }} peserta menyelesaikan ujian</p>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="p-6 space-y-2 animate-pulse">
          <div v-for="n in 8" :key="n" class="h-14 bg-gray-100 rounded-xl" />
        </div>

        <!-- Error -->
        <div v-else-if="isError" class="p-10 text-center space-y-2">
          <Icon icon="mdi:alert-circle-outline" class="text-4xl text-red-400 mx-auto" />
          <p class="text-sm text-gray-500">Gagal memuat leaderboard</p>
          <button @click="refetch()" class="text-xs text-primary hover:underline">Coba lagi</button>
        </div>

        <!-- Empty -->
        <div v-else-if="entries.length === 0" class="p-12 text-center space-y-3">
          <Icon icon="mdi:trophy-outline" class="text-5xl text-gray-300 mx-auto" />
          <p class="text-sm text-gray-400">Belum ada peserta yang menyelesaikan ujian</p>
        </div>

        <!-- Top 3 podium -->
        <template v-else>
          <div v-if="entries.length >= 3" class="px-5 pt-5 pb-3 flex items-end justify-center gap-3">
            <!-- 2nd -->
            <div class="flex flex-col items-center gap-1 flex-1">
              <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Icon icon="mdi:medal" class="text-2xl text-gray-400" />
              </div>
              <p class="text-xs font-bold text-gray-700 text-center truncate w-full">{{ entries[1]?.username }}</p>
              <p class="text-sm font-extrabold text-gray-500">{{ entries[1]?.totalScore.toFixed(1) }}</p>
              <div class="w-full h-14 bg-gray-100 rounded-t-xl flex items-center justify-center">
                <span class="text-lg font-black text-gray-400">2</span>
              </div>
            </div>
            <!-- 1st -->
            <div class="flex flex-col items-center gap-1 flex-1">
              <div class="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                <Icon icon="mdi:trophy" class="text-3xl text-yellow-500" />
              </div>
              <p class="text-xs font-bold text-gray-900 text-center truncate w-full">{{ entries[0]?.username }}</p>
              <p class="text-base font-extrabold text-yellow-600">{{ entries[0]?.totalScore.toFixed(1) }}</p>
              <div class="w-full h-20 bg-yellow-50 rounded-t-xl flex items-center justify-center">
                <span class="text-2xl font-black text-yellow-500">1</span>
              </div>
            </div>
            <!-- 3rd -->
            <div class="flex flex-col items-center gap-1 flex-1">
              <div class="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <Icon icon="mdi:medal" class="text-2xl text-amber-600" />
              </div>
              <p class="text-xs font-bold text-gray-700 text-center truncate w-full">{{ entries[2]?.username }}</p>
              <p class="text-sm font-extrabold text-amber-600">{{ entries[2]?.totalScore.toFixed(1) }}</p>
              <div class="w-full h-10 bg-amber-50 rounded-t-xl flex items-center justify-center">
                <span class="text-lg font-black text-amber-500">3</span>
              </div>
            </div>
          </div>

          <!-- Full list -->
          <div class="divide-y divide-gray-50">
            <div
              v-for="entry in entries"
              :key="entry.rank"
              class="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors"
            >
              <!-- Rank -->
              <div class="w-8 flex items-center justify-center shrink-0">
                <div
                  v-if="rankMedal(entry.rank)"
                  :class="['w-7 h-7 rounded-full flex items-center justify-center', rankMedal(entry.rank)!.color]"
                >
                  <Icon :icon="rankMedal(entry.rank)!.icon" class="text-sm" />
                </div>
                <span v-else class="text-sm font-bold text-gray-400">{{ entry.rank }}</span>
              </div>

              <!-- User info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">{{ entry.username }}</p>
                <p class="text-[10px] text-gray-400">Selesai {{ formatDate(entry.finishedAt) }}</p>
              </div>

              <!-- Score -->
              <div class="text-right shrink-0">
                <p class="text-base font-extrabold text-gray-800">{{ entry.totalScore.toFixed(1) }}</p>
                <p class="text-[10px] text-gray-400">poin</p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </DashboardLayout>
</template>
