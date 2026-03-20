<script setup lang="ts">
import type { QuestionForExam } from '../../services/tryout.attempt'

const props = defineProps<{
  question: QuestionForExam
  index: number
  total: number
  selectedOption: string | undefined
}>()

const emit = defineEmits<{
  (e: 'select', option: string): void
}>()

const options = ['A', 'B', 'C', 'D', 'E'] as const

const optionKey = (o: typeof options[number]) =>
  `option${o}` as 'optionA' | 'optionB' | 'optionC' | 'optionD' | 'optionE'

/**
 * Parse semua kemungkinan format:
 * - IMG::https://...
 * - https://...png
 * - <img src="..." />
 * - rich text biasa
 */
const parseContent = (val?: string) => {
  if (!val) return { type: 'empty', value: '' }

  const clean = val.trim()

  // Case 1: IMG::https://...
  if (clean.startsWith('IMG::')) {
    return {
      type: 'image',
      value: clean.replace('IMG::', '')
    }
  }

  // Case 2: direct image URL
  if (/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)$/i.test(clean)) {
    return {
      type: 'image',
      value: clean
    }
  }

  // Case 3: HTML mengandung <img>
  if (clean.includes('<img')) {
    return {
      type: 'html',
      value: clean
    }
  }

  // Default: anggap rich text
  return {
    type: 'html',
    value: clean
  }
}
</script>

<template>
  <div class="space-y-5">
    <!-- Question Header -->
    <div>
      <p class="text-xs font-semibold text-gray-400 mb-2">
        Soal {{ index + 1 }} dari {{ total }}
      </p>

      <!-- Question Image -->
      <div v-if="question.imageUrl" class="mb-4">
        <img
          :src="question.imageUrl"
          :alt="`Soal ${index + 1}`"
          class="max-w-full max-h-64 rounded-xl border border-gray-100 object-contain mx-auto"
        />
      </div>

      <!-- Question Text -->
      <div
        class="text-gray-900 text-base leading-relaxed font-medium prose prose-sm max-w-none"
        v-html="question.questionText"
      />
    </div>

    <!-- Options -->
    <div class="space-y-2.5">
      <button
        v-for="opt in options"
        :key="opt"
        @click="emit('select', opt)"
        :class="[
          'w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150',
          selectedOption === opt
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-gray-100 hover:border-primary/30 hover:bg-gray-50'
        ]"
      >
        <!-- Label A/B/C -->
        <span
          :class="[
            'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5',
            selectedOption === opt
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-500'
          ]"
        >
          {{ opt }}
        </span>

        <!-- Option Content -->
        <div class="flex-1 text-sm text-gray-800 leading-relaxed">
          <template v-if="parseContent(question[optionKey(opt)]).type === 'image'">
            <img
              :src="parseContent(question[optionKey(opt)]).value"
              class="max-h-40 rounded-lg object-contain"
            />
          </template>

          <template v-else-if="parseContent(question[optionKey(opt)]).type === 'html'">
            <div
              class="prose prose-sm max-w-none"
              v-html="parseContent(question[optionKey(opt)]).value"
            />
          </template>

          <template v-else>
            <span class="text-gray-400 italic">Tidak ada konten</span>
          </template>
        </div>
      </button>
    </div>
  </div>
</template>