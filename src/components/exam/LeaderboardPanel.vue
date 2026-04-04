<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import type { LeaderboardEntry } from '../../services/tryout.attempt'

const props = defineProps<{
  entries: LeaderboardEntry[]
  isLoading?: boolean
  isError?: boolean
  currentUserId?: number
}>()

const emit = defineEmits<{ retry: [] }>()

const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.entries
  return props.entries.filter(e => e.username.toLowerCase().includes(q))
})

const currentUserEntry = computed(() =>
  props.currentUserId
    ? props.entries.find(e => e.userId === props.currentUserId)
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
    <div class="flex items-center gap-2 mb-4">
      <Icon icon="mdi:podium-gold" class="text-yellow-500 text-lg shrink-0" />
      <h2 class="font-bold text-gray-900 text-sm flex-1">Leaderboard</h2>
      <span v-if="!isLoading && !isError" class="text-xs text-gray-400">
        {{ entries.length }} peserta
      </span>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-2 animate-pulse">
      <div v-for="n in 5" :key="n" class="h-12 bg-gray-100 rounded-xl" />
    </div>

    <!-- Error -->
    <div v-else-if="isError" class="py-8 text-center space-y-2">
      <Icon icon="mdi:alert-circle-outline" class="text-3xl text-red-400 mx-auto" />
      <p class="text-sm text-gray-400">Gagal memuat leaderboard</p>
      <button @click="emit('retry')" class="text-xs text-primary hover:underline">Coba lagi</button>
    </div>

    <!-- Empty (no data at all) -->
    <div v-else-if="entries.length === 0" class="py-10 text-center space-y-2">
      <Icon icon="mdi:trophy-outline" class="text-4xl text-gray-300 mx-auto" />
      <p class="text-sm text-gray-400">Belum ada peserta yang menyelesaikan ujian</p>
    </div>

    <template v-else>
      <!-- Search -->
      <div class="relative mb-3">
        <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          v-model="search"
          type="text"
          placeholder="Cari nama peserta..."
          class="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <!-- Current user highlight (pinned, shown when not in filtered list) -->
      <div
        v-if="currentUserEntry && !filtered.find(e => e.userId === currentUserId)"
        class="mb-3 p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3"
      >
        <span class="text-xs font-bold text-primary w-6 text-center">#{{ currentUserEntry.rank }}</span>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-primary truncate">{{ currentUserEntry.username }} <span class="font-normal text-primary/60">(Kamu)</span></p>
          <p class="text-[10px] text-gray-400">{{ formatDate(currentUserEntry.finishedAt) }}</p>
        </div>
        <span class="text-sm font-extrabold text-primary">{{ currentUserEntry.totalScore.toFixed(1) }}</span>
      </div>

      <!-- No search result -->
      <div v-if="filtered.length === 0" class="py-6 text-center">
        <p class="text-sm text-gray-400">Tidak ada peserta dengan nama "{{ search }}"</p>
      </div>

      <!-- List -->
      <div v-else class="space-y-1">
        <div
          v-for="entry in filtered"
          :key="entry.rank"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
            entry.userId === currentUserId
              ? 'bg-primary/5 border border-primary/20'
              : 'hover:bg-gray-50',
          ]"
        >
          <div class="w-7 flex items-center justify-center shrink-0">
            <Icon
              v-if="rankMedal(entry.rank)"
              :icon="rankMedal(entry.rank)!.icon"
              :class="['text-xl', rankMedal(entry.rank)!.color]"
            />
            <span v-else class="text-xs font-bold text-gray-400">{{ entry.rank }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p :class="['text-sm font-semibold truncate', entry.userId === currentUserId ? 'text-primary' : 'text-gray-800']">
              {{ entry.username }}
              <span v-if="entry.userId === currentUserId" class="text-xs font-normal text-primary/60 ml-1">(Kamu)</span>
            </p>
            <p class="text-[10px] text-gray-400">{{ formatDate(entry.finishedAt) }}</p>
          </div>
          <span :class="['text-sm font-extrabold shrink-0', entry.userId === currentUserId ? 'text-primary' : 'text-gray-700']">
            {{ entry.totalScore.toFixed(1) }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>
