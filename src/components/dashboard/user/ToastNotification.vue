<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useToast } from '../../../composables/useToast'

const { toasts } = useToast()

const iconMap = {
  success: 'mdi:check-circle',
  error: 'mdi:alert-circle',
  info: 'mdi:information',
}
const colorMap = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-5 right-5 z-100 flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          :class="['flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium pointer-events-auto min-w-[240px] max-w-xs', colorMap[t.type]]"
        >
          <Icon :icon="iconMap[t.type]" class="text-lg shrink-0" />
          <span>{{ t.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateX(40px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateX(40px); }
</style>
