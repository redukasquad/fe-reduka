<script setup lang="ts">
defineProps<{
  total: number
  current: number
  answers: Record<number, string>
  questionIds: number[]
}>()

const emit = defineEmits<{ go: [index: number] }>()
</script>

<template>
  <div class="grid grid-cols-5 gap-1.5">
    <button
      v-for="(qId, i) in questionIds" :key="qId"
      @click="emit('go', i)"
      :class="[
        'h-8 rounded-lg text-xs font-bold transition-all',
        i === current
          ? 'bg-primary text-white shadow-sm'
          : answers[qId]
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      ]"
    >{{ i + 1 }}</button>
  </div>
</template>
