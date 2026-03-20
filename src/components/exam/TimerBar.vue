<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps<{ seconds: number; totalSeconds: number }>()

// Pause UI updates when tab is hidden (saves CPU, timer logic still runs in store)
const visible = ref(true)
function onVisibilityChange() { visible.value = !document.hidden }
onMounted(() => document.addEventListener('visibilitychange', onVisibilityChange))
onUnmounted(() => document.removeEventListener('visibilitychange', onVisibilityChange))

const pct = computed(() =>
  props.totalSeconds > 0 ? (props.seconds / props.totalSeconds) * 100 : 0
)
const mm = computed(() => String(Math.floor(props.seconds / 60)).padStart(2, '0'))
const ss = computed(() => String(props.seconds % 60).padStart(2, '0'))

// ≤10% → red, ≤30% → amber, >30% → emerald
const barColor = computed(() => {
  if (pct.value <= 10) return 'bg-red-500'
  if (pct.value <= 30) return 'bg-amber-400'
  return 'bg-emerald-500'
})
const textColor = computed(() => {
  if (pct.value <= 10) return 'text-red-600'
  if (pct.value <= 30) return 'text-amber-600'
  return 'text-emerald-600'
})
const isUrgent = computed(() => pct.value <= 10)
</script>

<template>
  <div v-if="visible" class="flex items-center gap-3">
    <Icon
      :icon="isUrgent ? 'mdi:clock-alert-outline' : 'mdi:clock-outline'"
      :class="['text-lg shrink-0 transition-colors', textColor, isUrgent ? 'animate-pulse' : '']"
    />
    <div class="flex-1">
      <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          :class="['h-full rounded-full transition-all duration-1000', barColor]"
          :style="{ width: pct + '%' }"
        />
      </div>
    </div>
    <span
      :class="[
        'text-sm font-bold tabular-nums shrink-0 w-14 text-right transition-colors',
        textColor,
        isUrgent ? 'animate-pulse' : '',
      ]"
    >
      {{ mm }}:{{ ss }}
    </span>
  </div>
  <!-- When tab hidden: keep layout space so no reflow on return -->
  <div v-else class="h-5" />
</template>
