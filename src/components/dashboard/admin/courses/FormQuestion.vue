<script setup lang="ts">
import { computed, nextTick, watch } from "vue"
import { useForm, useField } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import {
  CreateRegistrationQuestionSchema,
  type CreateRegistrationQuestionInput
} from "../../../../schemas/course.question"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { CourseQuestionService } from "../../../../services/course.question"
import { toast } from "vue3-toastify"

const visible = defineModel<boolean>({ default: false })

const props = defineProps<{
  courseId?: number
  lastQuestion: number
}>()

const form = useForm({
  validationSchema: toTypedSchema(CreateRegistrationQuestionSchema),
  validateOnMount: true
})

const { value: questionText, errorMessage: questionTextError } =
  useField<string>("questionText")

const { value: questionType, errorMessage: questionTypeError } =
  useField<CreateRegistrationQuestionInput["questionType"]>("questionType")

    console.log(props.lastQuestion)

watch(
  () => visible.value,
  async (v) => {
    if (v) {
      await nextTick()

      form.setFieldValue("questionText", "")
      form.setFieldValue("questionType", "" as any)
    } else {
      form.resetForm()
    }
  }
)

const queryClient = useQueryClient()

const mutate = useMutation<
  unknown,
  Error,
  { courseId: number; data: CreateRegistrationQuestionInput }
>({
  mutationFn: async ({ courseId, data }) =>
    await CourseQuestionService.create(courseId,{
        ... data,
        questionOrder:props.lastQuestion
    }),

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["course-questions", props.courseId]
    })
    visible.value = false
    form.resetForm()
    toast("Successfully created question", { type: "success" })
  }
})

const onSubmit = form.handleSubmit(
  (values: CreateRegistrationQuestionInput) => {
    mutate.mutate({
      courseId: Number(props.courseId),
      data: values
    })
  }
)

const isDisabled = computed(
  () => !form.meta.value.valid || form.isSubmitting.value
)
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Add New Question"
    :style="{ width: '800px' }"
  >
    <form @submit.prevent="onSubmit" class="space-y-4 mt-3">

      <div class="space-y-1">
        <input
          v-model="questionText"
          type="text"
          placeholder="Question text"
          class="w-full border px-3 py-2 rounded bg-gray-100 outline-none focus:ring-2 focus:ring-primary"
        />
        <p v-if="questionTextError" class="text-red-600 text-xs">
          {{ questionTextError }}
        </p>
      </div>

      <div class="space-y-1">
        <select
          v-model="questionType"
          class="w-full border px-3 py-2 rounded bg-gray-100 outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="" disabled>Pilih tipe pertanyaan</option>
          <option value="text">Text</option>
          <option value="select">Select</option>
          <option value="radio">Radio</option>
          <option value="checkbox">Checkbox</option>
        </select>
        <p v-if="questionTypeError" class="text-red-600 text-xs">
          {{ questionTypeError }}
        </p>
      </div>

      <Button
        type="submit"
        :disabled="isDisabled"
      >
        <span>Add Question</span>
      </Button>
    </form>
  </Dialog>
</template>
