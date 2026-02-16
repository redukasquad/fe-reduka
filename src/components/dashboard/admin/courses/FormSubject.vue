<script setup lang="ts">
import { computed, watch } from "vue"
import { useForm, useField } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { CreateSubjectSchema, type CreateSubjectInput } from "../../../../schemas/course.subject"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { CourseSubjectService } from "../../../../services/course.subject"
import { toast } from "vue3-toastify"
const visible = defineModel<boolean>({ default: false })

const props = defineProps<{
  courseId?: number
}>()

const form = useForm({
  validationSchema: toTypedSchema(CreateSubjectSchema),
  validateOnMount:true
})

const { value: name, errorMessage: nameError } =
  useField<string>("name")

const { value: description, errorMessage: descriptionError } =
  useField<string | undefined>("description")

watch(
  () => props.courseId,
  (val) => {
    if (val) {
      form.setFieldValue("courseId", val)
    }
  },
  { immediate: true }
)

const queryClient = useQueryClient()

const mutate = useMutation<
  unknown,
  Error,
  { courseId: number; data: CreateSubjectInput }
>({
  mutationFn: async({ courseId, data }) =>
    await CourseSubjectService.create(courseId, data),

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['course', props.courseId]
    })
    visible.value=false
    form.resetForm()
    toast('Sucessfully Created subject', { type:'success' })
  }
})

const onSubmit = form.handleSubmit((values: CreateSubjectInput) => {
  mutate.mutate({
    courseId: Number(props.courseId),
    data: values
  })
})

const isDisabled = computed(
  () => !form.meta.value.valid || form.isSubmitting.value
)


</script>


<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Create New Subject"
    :style="{ width: '800px' }"
  >
    <form @submit.prevent="onSubmit" class="space-y-4 mt-3">
      <div class="space-y-1">
        <input
          v-model="name"
          type="text"
          placeholder="Subject Name"
          class="w-full border px-3 py-2 rounded bg-gray-100 outline-none focus:ring-2 focus:ring-primary"
        />
        <p v-if="nameError" class="text-red-600 text-xs">
          {{ nameError }}
        </p>
      </div>

      <div class="space-y-1">
          <Editor
          v-model="description"
          class="flex-1"
          editorStyle="height:50vh"
          placeholder="Masukkan deskripsi lengkap program untuk ditampilkan kepada pengguna"
        />
        <p v-if="descriptionError" class="text-red-600 text-xs">
          {{ descriptionError }}
        </p>
      </div>

      <Button
        type="submit"
        :disabled="isDisabled"
        >
        <span>Create Subject</span>
      </Button>

    </form>
  </Dialog>
</template>
