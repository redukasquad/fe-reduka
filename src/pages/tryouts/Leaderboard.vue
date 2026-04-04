<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { TryoutService } from '../../services/tryout'
import { TryoutAttemptService } from '../../services/tryout.attempt'
import { useAuth } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuth()

const tryoutId = Number(route.params.id)
const currentUserId = computed(() => auth.user?.ID ?? auth.user?.id)

const { data: tryoutData } = useQuery({
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

const currentUserEntry = computed(() =>
  currentUserId.value ? entries.value.find(e => e.userId === currentUserId.value) : null
)

const rankMedal = (rank: number) => {
  if (rank === 1) return { icon: 'mdi:trophy', color: 'text-yellow-500', bg: 'bg-yellow-50' }
  if (rank === 2) return { icon: 'mdi:medal', color: 'text-gray-400', bg: 'bg-gray-50' }
  if (rank === 3) return { icon: 'mdi:medal', color: 'text-amber-600', bg: 'bg-amber-50' }
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
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-2xl mx-auto space-y-5">

      <!-- Back + title -->
      <div class="flex items-center gap-3">
        <button
          @click="router.back()"
          class="p-1.5 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Icon icon="mdi:chevron-left" class="text-xl" />
        </button>
        <div class="flex-1 min-w-0">
          <p class="text-xs text-gray-400">Leaderboard</p>
          <h1 class="font-extrabold text-gray-900 truncate">{{ tryout?.name ?? '...' }}</h1>
        </div>
        <button
          @click="refetch()"
          class="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <Icon icon="mdi:refresh" />
        </button>
      </div>

      <!-- Current user position card (if logged in & participated) -->
      <div
        v-if="currentUserEntry"
        class="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-4"
      >
        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span class="text-lg font-extrabold text-primary">#{{ currentUserEntry.rank }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs text-primary/70 font-medium">Posisi kamu</p>
          <p class="font-bold text-primary truncate">{{ currentUserEntry.username }}</p>
          <p class="text-[10px] text-gray-400">Selesai {{ formatDate(currentUserEntry.finishedAt) }}</p>
        </div>
        <div class="text-right shrink-0">
          <p class="text-2xl font-extrabold text-primary">{{ currentUserEntry.totalScore.toFixed(1) }}</p>
          <p class="text-[10px] text-gray-400">poin</p>
        </div>
      </div>

      <!-- Leaderboard card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <Icon icon="mdi:podium-gold" class="text-yellow-500 text-2xl" />
          <div>
            <h2 class="font-bold text-gray-900">Peringkat Peserta</h2>
            <p class="text-xs text-gray-400">{{ entries.length }} peserta menyelesaikan ujian</p>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="p-5 space-y-2 animate-pulse">
          <div v-for="n in 6" :key="n" class="h-14 bg-gray-100 rounded-xl" />
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

        <!-- List -->
        <div v-else class="divide-y divide-gray-50">
          <div
            v-for="entry in entries"
            :key="entry.rank"
            :class="[
              'flex items-center gap-4 px-5 py-3.5 transition-colors',
              entry.userId === currentUserId ? 'bg-primary/5' : 'hover:bg-gray-50',
            ]"
          >
            <!-- Rank indicator -->
            <div class="w-8 flex items-center justify-center shrink-0">
              <div
                v-if="rankMedal(entry.rank)"
                :class="['w-8 h-8 rounded-full flex items-center justify-center', rankMedal(entry.rank)!.bg]"
              >
                <Icon :icon="rankMedal(entry.rank)!.icon" :class="['text-lg', rankMedal(entry.rank)!.color]" />
              </div>
              <span v-else class="text-sm font-bold text-gray-400">{{ entry.rank }}</span>
            </div>

            <!-- Name -->
            <div class="flex-1 min-w-0">
              <p :class="['text-sm font-semibold truncate', entry.userId === currentUserId ? 'text-primary' : 'text-gray-900']">
                {{ entry.username }}
                <span v-if="entry.userId === currentUserId" class="text-xs font-normal text-primary/60 ml-1">(Kamu)</span>
              </p>
              <p class="text-[10px] text-gray-400">{{ formatDate(entry.finishedAt) }}</p>
            </div>

            <!-- Score -->
            <div class="text-right shrink-0">
              <p :class="['text-base font-extrabold', entry.userId === currentUserId ? 'text-primary' : 'text-gray-800']">
                {{ entry.totalScore.toFixed(1) }}
              </p>
              <p class="text-[10px] text-gray-400">poin</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
