<script setup lang="ts">
import { computed } from 'vue'
import type { TryOutQuestion } from '../../../../types/entites/tryout.question'
import Button from 'primevue/button'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  question: TryOutQuestion
}>()

const emit = defineEmits<{
  (e: 'edit', question: TryOutQuestion): void
  (e: 'delete', question: TryOutQuestion): void
}>()

const difficultyColor = computed(() => {
  switch (props.question.difficultyLevel) {
    case 'easy':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'hard':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
})

const renderOption = (val: string) => {
  if (val && val.startsWith('IMG::')) {
    const url = val.substring(5)
    return `<img src="${url}" alt="Option Image" class="max-h-32 object-contain rounded mt-2" />`
  }
  return val
}
</script>

<template>
  <div class="border rounded-lg p-5 bg-white shadow-sm flex flex-col gap-4">
    <div class="flex justify-between items-start gap-4">
      <div class="flex items-center gap-3">
        <span class="font-semibold text-lg">No. {{ question.orderNumber }}</span>
        <span :class="['text-xs px-2 py-1 rounded border', difficultyColor]">
          {{ question.difficultyLevel }}
        </span>
      </div>
      <div class="flex gap-2">
        <Button
          variant="text"
          size="small"
          class="p-2 !text-blue-600 hover:bg-blue-50 focus:ring-blue-200"
          @click="emit('edit', question)"
        >
          <Icon icon="mdi:pencil" class="text-xl" />
        </Button>
        <Button
          variant="text"
          size="small"
          class="p-2 !text-red-600 hover:bg-red-50 focus:ring-red-200"
          @click="emit('delete', question)"
        >
          <Icon icon="mdi:trash-can" class="text-xl" />
        </Button>
      </div>
    </div>

    <div v-if="question.imageUrl" class="flex justify-center my-2">
      <img :src="question.imageUrl" alt="Question Image" class="max-h-64 object-contain rounded border" />
    </div>

    <div class="prose max-w-none text-gray-800 ql-editor px-0" v-html="question.questionText"></div>

    <div class="flex flex-col gap-2 mt-2">
      <div
        class="p-3 rounded border text-sm"
        :class="question.correctOption === 'A' ? 'bg-green-50 border-green-500 font-medium' : 'bg-gray-50 border-gray-200'"
      >
        <strong>A.</strong> <span v-html="renderOption(question.optionA)"></span>
      </div>
      <div
        class="p-3 rounded border text-sm"
        :class="question.correctOption === 'B' ? 'bg-green-50 border-green-500 font-medium' : 'bg-gray-50 border-gray-200'"
      >
        <strong>B.</strong> <span v-html="renderOption(question.optionB)"></span>
      </div>
      <div
        class="p-3 rounded border text-sm"
        :class="question.correctOption === 'C' ? 'bg-green-50 border-green-500 font-medium' : 'bg-gray-50 border-gray-200'"
      >
        <strong>C.</strong> <span v-html="renderOption(question.optionC)"></span>
      </div>
      <div
        class="p-3 rounded border text-sm"
        :class="question.correctOption === 'D' ? 'bg-green-50 border-green-500 font-medium' : 'bg-gray-50 border-gray-200'"
      >
        <strong>D.</strong> <span v-html="renderOption(question.optionD)"></span>
      </div>
      <div
        class="p-3 rounded border text-sm"
        :class="question.correctOption === 'E' ? 'bg-green-50 border-green-500 font-medium' : 'bg-gray-50 border-gray-200'"
      >
        <strong>E.</strong> <span v-html="renderOption(question.optionE)"></span>
      </div>
    </div>
  </div>
</template>
