<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { TryoutService } from '../../services/tryout'
import { TryoutAttemptService } from '../../services/tryout.attempt'
import { useAuth } from '../../stores/auth'
import LeaderboardPanel from '../../components/exam/LeaderboardPanel.vue'

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

      <!-- Current user position card -->
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

      <!-- Leaderboard panel (with search built-in) -->
      <LeaderboardPanel
        :entries="entries"
        :is-loading="isLoading"
        :is-error="isError"
        :current-user-id="currentUserId"
        @retry="refetch()"
      />

    </div>
  </div>
</template>
