<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import CardCountSubtest from '../../../../components/dashboard/tutor/tryouts/CardCountSubtest.vue'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { TryOutQuestionService } from '../../../../services/tryout.question'
import { computed, ref, watch } from 'vue'
import FormCreateQuestion from '../../../../components/dashboard/tutor/tryouts/FormCreateQuestion.vue'
import QuestionCard from '../../../../components/dashboard/tutor/tryouts/QuestionCard.vue'
import type { TryOutQuestion } from '../../../../types/entites/tryout.question'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'
import Button from 'primevue/button'

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()

const tryoutId = Number(route.params.id)
const visibleCreateQuestion = ref(false)
const questionToEdit = ref<TryOutQuestion | null>(null)

const showQuestion = ref((route.query.watch as string) || 'All')
const q = ref((route.query.q as string) || '')
const difficultyFilter = ref((route.query.difficulty as string) || '')

const difficultyOptions = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' }
]

const toggleShowQuestion = (value: string) => {
  showQuestion.value = value
}

watch(showQuestion, (newVal) => {
  router.replace({
    query: {
      ...route.query,
      watch: newVal
    }
  })
})

watch(difficultyFilter, (newVal) => {
  router.replace({
    query: {
      ...route.query,
      difficulty: newVal || undefined
    }
  })
})

let debounceTimer: number | undefined

const onChangeSearch = (e: Event) => {
  const target = e.target as HTMLInputElement
  const value = target.value

  clearTimeout(debounceTimer)

  debounceTimer = window.setTimeout(() => {
    q.value = value

    router.replace({
      query: {
        ...route.query,
        q: value || undefined
      }
    })
  }, 500)
}

const { data: subtestData, isLoading, isError, refetch } = useQuery({
  queryKey: ['subtest-count-question', tryoutId],
  queryFn: async () => {
    return await TryOutQuestionService.getSubtestQuestionCount(tryoutId)
  }
})

const subtest = computed(() => subtestData.value?.data ?? [])

const selectedSubtestId = computed(() => {
  if (showQuestion.value === 'All') return undefined
  const found = subtest.value.find((s: any) => s.code === showQuestion.value)
  return found?.id
})

const { data: questionsData, isLoading: isLoadingQuestions } = useQuery({
  queryKey: ['tryout-questions', tryoutId, selectedSubtestId, q, difficultyFilter],
  queryFn: async () => {
    return await TryOutQuestionService.getQuestions(tryoutId, selectedSubtestId.value, q.value, difficultyFilter.value)
  }
})

const questions = computed(() => questionsData.value?.data ?? [])


const handleEdit = (question: TryOutQuestion) => {
  questionToEdit.value = question
  visibleCreateQuestion.value = true
}

const deleteMutation = useMutation({
  mutationFn: async (questionId: number) => {
    return await TryOutQuestionService.deleteQuestion(questionId)
  },
  onSuccess: () => {
    toast("Berhasil menghapus soal", { type: "success" })
    queryClient.invalidateQueries({ queryKey: ['tryout-questions'] })
    queryClient.invalidateQueries({ queryKey: ['subtest-count-question'] })
  },
  onError: () => {
    toast("Terjadi kesalahan saat menghapus", { type: "error" })
  }
})

const handleDelete = (question: TryOutQuestion) => {
  if (window.confirm("Apakah Anda yakin ingin menghapus soal ini?")) {
    deleteMutation.mutate(question.id)
  }
}

const openCreateForm = async () => {
  questionToEdit.value = null
  await refetch()
  visibleCreateQuestion.value = true
}
</script>

<template>
  <DashboardLayout class="px-4 space-y-2 backdrop-blur-md">
    <div>
      <h1 class="text-2xl font-bold">Tryout Details</h1>
      <p class="text-gray-500 text-sm">Overview dan Management Soal</p>
    </div>

    <CardCountSubtest
      :is-loading="isLoading"
      :is-error="isError"
      :subtest="subtest"
    />

    <div class="mt-6 pb-20">
      <h2 class="text-xl md:text-2xl font-semibold">
        Management Soal
      </h2>

      <div class="w-full flex justify-start md:gap-4 gap-2 mt-4 flex-wrap">
        <Button :variant="showQuestion=='All'?'default':'outlined'" class="text-sm" @click="toggleShowQuestion('All')">
          All
        </Button>

        <Button
          v-for="(item, index) in subtest"
          :key="index"
          class="text-sm"
          :variant="showQuestion==item.code?'default':'outlined'"
          @click="toggleShowQuestion(item.code)"
        >
          {{ item.code }}
        </Button>
      </div>

      <div class="flex items-center gap-2 mt-3 flex-wrap">
        <span class="text-sm font-medium text-gray-500 mr-2">Difficulty:</span>
        <Button
          v-for="opt in difficultyOptions"
          :key="opt.value"
          size="small"
          :variant="difficultyFilter === opt.value ? 'default' : 'outlined'"
          class="!py-1 !px-3 text-xs"
          @click="difficultyFilter = difficultyFilter === opt.value ? '' : opt.value"
        >
          {{ opt.label }}
        </Button>
        <Button 
          v-if="difficultyFilter" 
          variant="text" 
          size="small" 
          class="!p-1 text-red-500 text-xs" 
          @click="difficultyFilter = ''"
        >
          Clear
        </Button>
      </div>

      <div class="mt-4">
        <div class="flex justify-between items-center gap-4">
          <input
            type="text"
            :value="q"
            placeholder="Cari soal..."
            class="border rounded px-3 py-2 w-full max-w-sm"
            @input="onChangeSearch"
          />
          <Button variant="outline" @click="openCreateForm">
            <Icon icon="mdi:plus" /> Tambah Soal
          </Button>
        </div>
        
        <FormCreateQuestion 
          v-model:visible="visibleCreateQuestion" 
          :subtest="subtest" 
          :tryout-id="tryoutId" 
          :initial-data="questionToEdit"
          :selected-subtest-id="selectedSubtestId"
        />
      </div>

      <div class="mt-6 flex flex-col gap-4">
        <div v-if="isLoadingQuestions" class="flex justify-center p-10">
          <Icon icon="mdi:loading" class="animate-spin text-4xl text-gray-400" />
        </div>
        <div v-else-if="questions.length === 0" class="text-center p-10 border rounded-lg bg-gray-50 text-gray-500">
          Tidak ada soal ditemukan.
        </div>
        <QuestionCard
          v-else
          v-for="question in questions"
          :key="question.id"
          :question="question"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>

    </div>
  </DashboardLayout>
</template>