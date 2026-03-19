<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  isLoading: boolean
  subtest: any[]
  isError: boolean
}>()

const totalSubtests = computed(() => props.subtest?.length || 0)

const totalQuestions = computed(() => {
  if (!props.subtest) return 0
  return props.subtest.reduce((acc, curr) => acc + (curr.questionCount || 0), 0)
})

const totalCurrentQuestions = computed(() => {
  if (!props.subtest) return 0
  return props.subtest.reduce((acc, curr) => acc + (curr.currentQuestionCount || 0), 0)
})

const percentProgress = computed(() => {
  if (totalQuestions.value === 0) return 0
  return Math.round((totalCurrentQuestions.value / totalQuestions.value) * 100)
})

</script>

<template>
  <div
    v-if="isLoading"
    class="p-6 text-center text-gray-500"
  >
    Memuat subtest...
  </div>

  <div
    v-else-if="isError"
    class="p-6 text-center text-red-500"
  >
    Gagal memuat data subtest.
  </div>

  <div
    v-else
    class="space-y-6 mt-4"
  >
    <!-- Overall Stats -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
      <div class="flex-1 w-full space-y-3">
        <h3 class="text-lg font-semibold text-gray-800">Progress Pembuatan Soal</h3>
        <div class="w-full bg-gray-100 rounded-full h-4 overflow-hidden border">
          <div class="bg-blue-600 h-full rounded-full transition-all duration-500 relative" :style="{ width: percentProgress + '%' }">
            <div class="absolute inset-0 bg-white/20 progress-stripes"></div>
          </div>
        </div>
        <div class="flex justify-between text-sm font-medium text-gray-600">
          <span class="text-blue-600">{{ totalCurrentQuestions }} Soal Dibuat</span>
          <span>Target: {{ totalQuestions }} Soal</span>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="text-center p-4 bg-gray-50 rounded-xl border border-gray-200 min-w-[110px]">
          <div class="text-3xl font-bold text-gray-700">{{ totalSubtests }}</div>
          <div class="text-xs text-gray-500 mt-1 uppercase tracking-wide font-semibold">Subtest</div>
        </div>
        <div class="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100 min-w-[110px]">
          <div class="text-3xl font-bold text-emerald-600">{{ percentProgress }}%</div>
          <div class="text-xs text-emerald-800 mt-1 uppercase tracking-wide font-semibold">Selesai</div>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
    <Card
      v-for="s in props.subtest"
      :key="s.id"
      class="hover:shadow-lg transition backdrop-blur-sm"
    >
      <template #title>
        <div class="flex justify-between items-start">
          <span class="font-semibold text-sm">
            {{ s.name }}
          </span>

          <Tag
            :value="s.code"
            severity="info"
          />
        </div>
      </template>

      <template #content>
        <div class="space-y-2 text-sm">

          <div class="flex justify-between">
            <span class="text-gray-500">Jumlah Soal</span>
            <span class="font-medium">
              {{ s.questionCount }}
            </span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-gray-500">Total soal di tryout</span>
            <span class="font-medium">
              {{ s.currentQuestionCount }}
            </span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-500">Durasi</span>
            <span class="font-medium">
              {{ Math.floor(s.timeLimitSeconds / 60) }} menit
            </span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-500">Skor Maks</span>
            <span class="font-medium">
              {{ s.maxScore }}
            </span>
          </div>

        </div>
      </template>
    </Card>
  </div>
</div>
</template>