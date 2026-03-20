<script setup lang="ts">
import type { SubtestProgress } from '../../services/tryout.attempt'

defineProps<{
  subtests: SubtestProgress[]
  currentSubtestId: number
}>()

const statusColor = (s: string) => ({
  completed: 'bg-emerald-500 text-white',
  in_progress: 'bg-primary text-white ring-2 ring-primary/30',
  not_started: 'bg-gray-100 text-gray-400',
}[s] ?? 'bg-gray-100 text-gray-400')
</script>

<template>
  <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
    <template v-for="(sub, i) in subtests" :key="sub.subtestId">
      <div :class="['flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all', statusColor(sub.status)]">
        <span>{{ sub.subtestCode }}</span>
        <span v-if="sub.status === 'completed'" class="opacity-80">✓</span>
      </div>
      <div v-if="i < subtests.length - 1" class="w-4 h-px bg-gray-200 shrink-0" />
    </template>
  </div>
</template>
