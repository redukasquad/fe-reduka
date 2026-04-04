<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useQuery } from '@tanstack/vue-query'
import { TryoutAttemptService, type LeaderboardEntry } from '../../services/tryout.attempt'

const props = defineProps<{
  tryOutId: number
  currentUserId?: number
}>()

const { data, isLoading, isError } = useQuery({
  queryKey: ['leaderboard', props.tryOutId],
  queryFn: () => TryoutAttemptService.getLeaderboard(props.tryOutId),
  staleTime: 1000 * 60,
  enabled: !!props.tryOutId,
})

const entries = computed(() => data.value?.data ?? [])

const currentUserEntry = computed(() =>
  props.currentUserId
    ? entries.value.find(e => e.userId === props.currentUserId)
    : null
)

const rankMedal = (rank: number) => {
  if (rank === 1) return { icon: 'mdi:trophy', color: 'text-yellow-500' }
  if (rank === 2) return { icon: 'mdi:medal', color: 'text-gray-400' }
  if (rank === 3) return { icon: 'mdi:medal', color: 'text-amber-600' }
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
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <h2 class="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
      <Icon icon="mdi:podium-gold" class="text-yellow-500 text-lg" />
      Leaderboard
    </h2>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-2 animate-pulse">
      <div v-for="n in 5" :key="n" class="h-12 bg-gray-100 rounded-xl" />
    </div>

    <!-- Error -->
    <div v-else-if="isError" class="py-8 text-center text-sm text-gray-400">
      <Icon icon="mdi:alert-circle-outline" class="text-3xl mb-2 mx-auto" />
      <p>Gagal memuat leaderboard</p>
    </div>

    <!-- Empty -->
    <div v-else-if="entries.length === 0" class="py-10 text-center space-y-2">
      <Icon icon="mdi:trophy-outline" class="text-4xl text-gray-300 mx-auto" />
      <p class="text-sm text-gray-400">Belum ada peserta yang menyelesaikan ujian</p>
    </div>

    <template v-else>
      <!-- Current user highlight (if not in top list) -->
      <div
        v-if="currentUserEntry && currentUserEntry.rank > entries.length"
        class="mb-3 p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3"
      >
        <span class="text-xs font-bold text-primary w-6 text-center">#{{ currentUserEntry.rank }}</span>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-primary truncate">{{ currentUserEntry.username }} (Kamu)</p>
          <p class="text-[10px] text-gray-400">{{ formatDate(currentUserEntry.finishedAt) }}</p>
        </div>
        <span class="text-sm font-extrabold text-primary">{{ currentUserEntry.totalScore.toFixed(1) }}</span>
      </div>

      <!-- Table -->
      <div class="space-y-1.5">
        <div
          v-for="entry in entries"
          :key="entry.rank"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
            entry.userId === currentUserId
              ? 'bg-primary/5 border border-primary/20'
              : 'hover:bg-gray-50',
          ]"
        >
          <!-- Rank -->
          <div class="w-7 flex items-center justify-center shrink-0">
            <Icon
              v-if="rankMedal(entry.rank)"
              :icon="rankMedal(entry.rank)!.icon"
              :class="['text-xl', rankMedal(entry.rank)!.color]"
            />
            <span v-else class="text-xs font-bold text-gray-400">{{ entry.rank }}</span>
          </div>

          <!-- Name -->
          <div class="flex-1 min-w-0">
            <p :class="['text-sm font-semibold truncate', entry.userId === currentUserId ? 'text-primary' : 'text-gray-800']">
              {{ entry.username }}
              <span v-if="entry.userId === currentUserId" class="text-xs font-normal text-primary/70 ml-1">(Kamu)</span>
            </p>
            <p class="text-[10px] text-gray-400">{{ formatDate(entry.finishedAt) }}</p>
          </div>

          <!-- Score -->
          <span :class="['text-sm font-extrabold shrink-0', entry.userId === currentUserId ? 'text-primary' : 'text-gray-700']">
            {{ entry.totalScore.toFixed(1) }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>
