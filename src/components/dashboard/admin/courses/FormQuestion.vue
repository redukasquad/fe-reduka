<script setup lang="ts">
import { computed, watch } from "vue"
import { useForm, useField } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { toast } from "vue3-toastify"
import { CourseQuestionService } from "../../../../services/course.question"

const visible = defineModel<boolean>({ default: false })

const props = defineProps<{
  courseId: number
  lastQuestion: number  // auto-set questionOrder = lastQuestion
}>()

// Matches BE CreateQuestionInput exactly
const Schema = z.object({
  questionText: z.string().min(1, "Teks pertanyaan wajib diisi"),
  questionType: z.enum(["text", "select", "radio", "file"], {
    required_error: "Tipe pertanyaan wajib dipilih",
  }),
})

type FormValues = z.infer<typeof Schema>

const queryClient = useQueryClient()

const { handleSubmit, isSubmitting, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(Schema),
})

const { value: questionText, errorMessage: textError } = useField<string>("questionText")
const { value: questionType, errorMessage: typeError } = useField<FormValues["questionType"]>("questionType")

watch(() => visible.value, v => { if (!v) resetForm() })

const QUESTION_TYPES = [
  { value: 'text', label: 'Text', desc: 'Jawaban bebas teks' },
  { value: 'select', label: 'Select', desc: 'Pilihan dropdown' },
  { value: 'radio', label: 'Radio', desc: 'Ya / Tidak' },
  { value: 'file', label: 'File', desc: 'Upload file' },
]

const { mutate, isPending } = useMutation({
  mutationFn: (values: FormValues) =>
    CourseQuestionService.create(props.courseId, {
      ...values,
      questionOrder: props.lastQuestion,
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['course-questions', props.courseId] })
    visible.value = false
    resetForm()
    toast.success('Pertanyaan berhasil ditambahkan')
  },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal menambahkan pertanyaan'),
})

const onSubmit = handleSubmit(values => mutate(values))
const isDisabled = computed(() => !meta.value.valid || isSubmitting.value || isPending.value)
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Tambah Pertanyaan Registrasi"
    :style="{ width: '560px' }"
    @hide="resetForm()"
  >
    <form @submit.prevent="onSubmit" class="space-y-4 pt-2">

      <!-- Order badge -->
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <span class="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
          Urutan #{{ lastQuestion }}
        </span>
        <span>Pertanyaan baru akan ditambahkan di urutan ini</span>
      </div>

      <!-- Question text -->
      <div>
        <label class="text-sm font-medium text-gray-700 mb-1 block">Teks Pertanyaan</label>
        <input
          v-model="questionText"
          type="text"
          placeholder="Contoh: Mengapa kamu tertarik mengikuti kursus ini?"
          class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
        <p v-if="textError" class="text-red-500 text-xs mt-1">{{ textError }}</p>
      </div>

      <!-- Question type -->
      <div>
        <label class="text-sm font-medium text-gray-700 mb-2 block">Tipe Pertanyaan</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="t in QUESTION_TYPES"
            :key="t.value"
            type="button"
            @click="questionType = t.value as any"
            :class="[
              'flex flex-col items-start p-3 rounded-lg border text-left transition-all',
              questionType === t.value
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            ]"
          >
            <span class="font-medium text-sm">{{ t.label }}</span>
            <span class="text-xs text-gray-400 mt-0.5">{{ t.desc }}</span>
          </button>
        </div>
        <p v-if="typeError" class="text-red-500 text-xs mt-1">{{ typeError }}</p>
      </div>

      <div class="flex justify-end gap-2 pt-1">
        <button
          type="button"
          @click="visible = false"
          class="px-4 py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          :disabled="isDisabled"
          class="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {{ isPending ? 'Menyimpan...' : 'Tambah Pertanyaan' }}
        </button>
      </div>
    </form>
  </Dialog>
</template>
