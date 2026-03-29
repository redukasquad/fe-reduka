<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { TryoutAttemptService, type QuestionReview } from '../../../services/tryout.attempt'

const route = useRoute()
const router = useRouter()
const attemptId = Number(route.params.attemptId)
const subtestId = Number(route.params.subtestId)

const { data, isLoading, isError } = useQuery({
  queryKey: ['subtest-review', attemptId, subtestId],
  queryFn: () => TryoutAttemptService.getSubtestReview(attemptId, subtestId),
  retry: 1,
})

const review = computed(() => data.value?.data ?? null)
const questions = computed(() => review.value?.questions ?? [])

const filter = ref<'all' | 'correct' | 'wrong' | 'unanswered'>('all')

const filtered = computed(() => {
  if (filter.value === 'all') return questions.value
  if (filter.value === 'correct') return questions.value.filter(q => q.isCorrect === true)
  if (filter.value === 'wrong') return questions.value.filter(q => q.isCorrect === false)
  return questions.value.filter(q => q.selectedOption === null)
})

const stats = computed(() => ({
  correct: questions.value.filter(q => q.isCorrect === true).length,
  wrong: questions.value.filter(q => q.isCorrect === false).length,
  unanswered: questions.value.filter(q => q.selectedOption === null).length,
}))

const options = ['A', 'B', 'C', 'D', 'E'] as const
const optionKey = (o: string) => `option${o}` as 'optionA' | 'optionB' | 'optionC' | 'optionD' | 'optionE'

function optionClass(q: QuestionReview, opt: string) {
  const isCorrect = q.correctOption === opt
  const isSelected = q.selectedOption === opt
  if (isCorrect) return 'border-emerald-400 bg-emerald-50 text-emerald-800'
  if (isSelected && !isCorrect) return 'border-red-400 bg-red-50 text-red-800'
  return 'border-gray-100 bg-white text-gray-600'
}

function labelClass(q: QuestionReview, opt: string) {
  const isCorrect = q.correctOption === opt
  const isSelected = q.selectedOption === opt
  if (isCorrect) return 'bg-emerald-500 text-white'
  if (isSelected && !isCorrect) return 'bg-red-500 text-white'
  return 'bg-gray-100 text-gray-500'
}

function statusIcon(q: QuestionReview) {
  if (q.isCorrect === true) return { icon: 'mdi:check-circle', cls: 'text-emerald-500' }
  if (q.isCorrect === false) return { icon: 'mdi:close-circle', cls: 'text-red-500' }
  return { icon: 'mdi:minus-circle', cls: 'text-gray-400' }
}

const parseContent = (val?: string) => {
  if (!val) return { type: 'empty', value: '' }
  const clean = val.trim()
  if (clean.startsWith('IMG::')) return { type: 'image', value: clean.replace('IMG::', '') }
  if (/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)$/i.test(clean)) return { type: 'image', value: clean }
  if (clean.includes('<img')) return { type: 'html', value: clean }
  return { type: 'html', value: clean }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
      <div class="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <button @click="router.back()" class="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors shrink-0">
          <Icon icon="mdi:arrow-left" class="text-lg" />
        </button>
        <div class="flex-1 min-w-0">
          <p class="text-xs text-gray-400">Pembahasan</p>
          <h1 class="font-extrabold text-gray-900 text-sm truncate">{{ review?.subtestName ?? '...' }}</h1>
        </div>
        <span class="text-xs text-gray-400 shrink-0">{{ review?.subtestCode }}</span>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-4 py-5 space-y-4">
      <div v-if="isLoading" class="space-y-4 animate-pulse">
        <div v-for="n in 5" :key="n" class="h-48 bg-white rounded-2xl border border-gray-100" />
      </div>

      <div v-else-if="isError" class="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-3">
        <Icon icon="mdi:alert-circle-outline" class="text-5xl text-red-400 mx-auto" />
        <p class="text-gray-600">Gagal memuat pembahasan.</p>
        <button @click="router.back()" class="text-primary text-sm hover:underline">Kembali</button>
      </div>

      <template v-else-if="review">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-2">
          <button v-for="f in (['all', 'correct', 'wrong', 'unanswered'] as const)" :key="f"
            @click="filter = f"
            :class="['flex-1 py-2 rounded-xl text-xs font-bold transition-all', filter === f
              ? f === 'correct' ? 'bg-emerald-500 text-white'
              : f === 'wrong' ? 'bg-red-500 text-white'
              : f === 'unanswered' ? 'bg-gray-400 text-white'
              : 'bg-primary text-white'
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100']">
            <template v-if="f === 'all'">Semua ({{ questions.length }})</template>
            <template v-else-if="f === 'correct'">✓ {{ stats.correct }}</template>
            <template v-else-if="f === 'wrong'">✗ {{ stats.wrong }}</template>
            <template v-else>— {{ stats.unanswered }}</template>
          </button>
        </div>

        <div v-if="filtered.length === 0" class="py-12 text-center text-gray-400 text-sm">
          Tidak ada soal di kategori ini.
        </div>

        <div v-for="q in filtered" :key="q.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-gray-50">
            <span class="text-xs font-bold text-gray-400">Soal {{ q.orderNumber }}</span>
            <span :class="['inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full',
              q.difficultyLevel === 'easy' ? 'bg-emerald-100 text-emerald-700'
              : q.difficultyLevel === 'medium' ? 'bg-amber-100 text-amber-700'
              : 'bg-red-100 text-red-700']">
              {{ q.difficultyLevel }}
            </span>
            <div class="flex-1" />
            <Icon :icon="statusIcon(q).icon" :class="['text-xl', statusIcon(q).cls]" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div class="p-5 space-y-4">
              <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Soal & Jawaban Benar</p>

              <div v-if="q.imageUrl">
                <img :src="q.imageUrl" class="max-w-full max-h-48 rounded-xl object-contain" />
              </div>

              <div class="text-sm text-gray-900 leading-relaxed prose prose-sm max-w-none" v-html="q.questionText" />

              <div class="space-y-2">
                <div v-for="opt in options" :key="opt"
                  :class="['flex items-start gap-2.5 p-3 rounded-xl border-2 text-sm transition-all', optionClass(q, opt)]">
                  <span :class="['w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0', labelClass(q, opt)]">
                    {{ opt }}
                  </span>

                  <div class="flex-1 leading-relaxed">
                    <img
                      v-if="parseContent(q[optionKey(opt)]).type === 'image'"
                      :src="parseContent(q[optionKey(opt)]).value"
                      class="max-h-40 rounded-lg object-contain"
                    />
                    <div
                      v-else
                      class="prose prose-sm max-w-none"
                      v-html="parseContent(q[optionKey(opt)]).value"
                    />
                  </div>

                  <Icon v-if="q.correctOption === opt" icon="mdi:check-bold" class="text-emerald-500 shrink-0 mt-0.5" />
                </div>
              </div>
            </div>

            <div class="p-5 space-y-4">
              <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Jawaban Kamu</p>

              <div v-if="q.selectedOption === null"
                class="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200">
                <Icon icon="mdi:minus-circle" class="text-gray-400 text-lg shrink-0" />
                <span class="text-sm text-gray-500 font-medium">Tidak dijawab</span>
              </div>

              <div v-else
                :class="['flex items-center gap-2 p-3 rounded-xl border-2',
                  q.isCorrect ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300']">

                <span :class="['w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0',
                  q.isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white']">
                  {{ q.selectedOption }}
                </span>

                <div class="flex-1">
                  <p :class="['text-xs font-bold', q.isCorrect ? 'text-emerald-700' : 'text-red-700']">
                    {{ q.isCorrect ? 'Benar' : 'Salah' }}
                  </p>

                  <div class="text-sm leading-relaxed">
                    <img
                      v-if="parseContent(q[optionKey(q.selectedOption)]).type === 'image'"
                      :src="parseContent(q[optionKey(q.selectedOption)]).value"
                      class="max-h-40 rounded-lg object-contain"
                    />
                    <div
                      v-else
                      class="prose prose-sm max-w-none"
                      v-html="parseContent(q[optionKey(q.selectedOption)]).value"
                    />
                  </div>
                </div>

                <Icon :icon="q.isCorrect ? 'mdi:check-circle' : 'mdi:close-circle'"
                  :class="['text-xl shrink-0', q.isCorrect ? 'text-emerald-500' : 'text-red-500']" />
              </div>

              <div v-if="!q.isCorrect" class="space-y-1">
                <p class="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">Jawaban Benar</p>

                <div class="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border-2 border-emerald-300">
                  <span class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 bg-emerald-500 text-white">
                    {{ q.correctOption }}
                  </span>

                  <div class="flex-1 text-sm leading-relaxed">
                    <img
                      v-if="parseContent(q[optionKey(q.correctOption)]).type === 'image'"
                      :src="parseContent(q[optionKey(q.correctOption)]).value"
                      class="max-h-40 rounded-lg object-contain"
                    />
                    <div
                      v-else
                      class="prose prose-sm max-w-none"
                      v-html="parseContent(q[optionKey(q.correctOption)]).value"
                    />
                  </div>
                </div>
              </div>

              <div v-if="q.explanation" class="space-y-1">
                <p class="text-[11px] font-bold text-violet-600 uppercase tracking-wide flex items-center gap-1">
                  <Icon icon="mdi:lightbulb-outline" /> Pembahasan
                </p>
                <div class="p-3 rounded-xl bg-violet-50 border border-violet-100 text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  v-html="q.explanation" />
              </div>

              <div v-else class="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-400 italic">
                Belum ada pembahasan untuk soal ini.
              </div>
            </div>
          </div>
        </div>

        <button @click="router.back()"
          class="w-full py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          ← Kembali ke Hasil
        </button>
      </template>
    </div>
  </div>
</template>