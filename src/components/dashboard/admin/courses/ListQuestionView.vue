<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { CourseQuestionService } from '../../../../services/course.question'
import FormQuestion from './FormQuestion.vue'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'
import FormAnswer from './FormAnswer.vue'

export interface RegistrationAnswer {
  id: number
  answerText: string
}

export interface RegistrationQuestion {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  courseId: number
  questionText: string
  questionType: 'text' | 'select' | 'radio' | 'file'
  questionOrder: number
  answers?: RegistrationAnswer[]
}

const props = defineProps<{ courseId: number }>()

const queryClient=useQueryClient()
const addNewquestion = ref(false)

const { data, isLoading, isError } = useQuery({
  queryKey: ['course-questions', props.courseId],
  queryFn: async () => await CourseQuestionService.findAll(props.courseId)
})

const questions = computed<RegistrationQuestion[]>(() => {
  const list = data.value?.data ?? []
  if (!Array.isArray(list)) return []

  return list
    .slice()
    .sort((a, b) => (a.questionOrder ?? 0) - (b.questionOrder ?? 0))
})

const showFormAnswer=ref(false)

const addAnswer = () => {
  showFormAnswer.value=!showFormAnswer.value
}

const getQuestionHint = (type: string) => {
  if (type === 'select') return 'Jawaban pilihan perlu ditambahkan'
  if (type === 'radio') return 'Jawaban hanya berupa Yes or No'
  return 'Input teks — tidak memerlukan opsi jawaban'
}

const deletingId = ref<number | null>(null)

const deleteMutation = useMutation({
  mutationFn: async (id: number) =>
    await CourseQuestionService.delete(id),

  onMutate: (id: number) => {
    deletingId.value = id
  },

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['course-questions', props.courseId]
    })

    toast('Sucessfully deleted', {
        type:'success'
    })
  },

  onSettled: () => {
    deletingId.value = null
  }
})

const deleteQuestion = (id: number) => {
  deleteMutation.mutate(id)
}

</script>

<template>
  <div class="card">

    <div v-if="isLoading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="animate-pulse">
        <div class="h-10 bg-gray-200 rounded mb-2"></div>
        <div class="h-20 bg-gray-100 rounded"></div>
      </div>
    </div>

    <div v-else-if="isError" class="text-red-500">
      Gagal memuat data
    </div>

    <div
      v-else-if="questions.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <div class="text-6xl mb-4">📭</div>

      <h3 class="text-lg font-semibold mb-2">
        Belum ada pertanyaan
      </h3>

      <p class="text-gray-500">
        Pertanyaan untuk kursus ini belum tersedia
      </p>
    </div>

    <Accordion v-else multiple>
      <AccordionPanel
        v-for="(q, i) in questions"
        :key="q.id"
        :value="String(i)"
      >
        <AccordionHeader>
            <div class="space-y-2 w-full">

                <div class="flex items-start gap-2 text-sm">
                    <span class="bg-primary/20 text-primary text-xs px-2 py-1 rounded shrink-0">
                    {{ q.questionOrder }}
                    </span>

                    <span class="font-medium leading-snug">
                    {{ q.questionText }}
                    </span>
                </div>

                <div class="flex justify-start gap-2 items-center gap-4">

                    <div
                    class="text-white bg-primary/80 px-2 py-0.5 text-[10px] rounded-full"
                    >
                      {{ q.questionType }}
                    </div>

                    <button
                    class="p-1 cursor-pointer rounded-md hover:bg-red-500/20 transition disabled:opacity-50"
                    :disabled="deletingId === q.id"
                    @click.stop="deleteQuestion(q.id)"
                    >
                    <Icon
                        v-if="deletingId !== q.id"
                        icon="mdi:rubbish"
                        class="text-red-400 text-lg"
                    />

                    <Icon
                        v-else
                        icon="svg-spinners:90-ring"
                        class="text-red-400 text-lg"
                    />
                    </button>

                </div>

            </div>

        </AccordionHeader>

        <AccordionContent>
          <div>

            <div v-if="q.answers?.length" class="space-y-2">
              <div
                v-for="a in q.answers"
                :key="a.id"
                class="bg-gray-100 p-3 rounded"
              >
                {{ a.answerText }}
              </div>
            </div>

            <div v-else class="text-gray-400 italic">
              {{ getQuestionHint(q.questionType) }}
            </div>

            <button
              v-if="q.questionType === 'select'"
              class="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              @click="addAnswer()"
            >
              Tambah Jawaban
            </button>

          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

    <Button
      @click="addNewquestion = true"
      class="block w-full my-4"
    >
      New question
    </Button>

  </div>

  <FormQuestion
    v-model:visible="addNewquestion"
    :course-id="props.courseId"
    :last-question="questions.length + 1"
  />
  <FormAnswer v-model:visible="showFormAnswer" />
</template>
