<script setup lang="ts">
import { computed } from "vue"
import { useForm, useField } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { toast } from "vue3-toastify"
import { CreateSubjectSchema, type CreateSubjectInput } from "../../../../schemas/course.subject"
import { CourseSubjectService } from "../../../../services/course.subject"

const visible = defineModel<boolean>({ default: false })
const props = defineProps<{ courseId: number }>()

const queryClient = useQueryClient()

const { handleSubmit, isSubmitting, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(CreateSubjectSchema),
})

const { value: name, errorMessage: nameError } = useField<string>("name")
const { value: description } = useField<string | undefined>("description")

const { mutate, isPending } = useMutation({
  mutationFn: (data: CreateSubjectInput) =>
    CourseSubjectService.create(props.courseId, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['course', props.courseId] })
    visible.value = false
    resetForm()
    toast.success('Subject berhasil ditambahkan')
  },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal menambahkan subject'),
})

const onSubmit = handleSubmit(values => mutate(values))
const isDisabled = computed(() => !meta.value.valid || isSubmitting.value || isPending.value)
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Tambah Subject Baru"
    :style="{ width: '640px' }"
    @hide="resetForm()"
  >
    <form @submit.prevent="onSubmit" class="space-y-4 pt-2">
      <div>
        <label class="text-sm font-medium text-gray-700 mb-1 block">Nama Subject</label>
        <input
          v-model="name"
          type="text"
          placeholder="Masukkan nama subject"
          class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
        <p v-if="nameError" class="text-red-500 text-xs mt-1">{{ nameError }}</p>
      </div>

      <div>
        <label class="text-sm font-medium text-gray-700 mb-1 block">Deskripsi <span class="text-gray-400">(opsional)</span></label>
        <Editor v-model="description" editorStyle="height: 200px" />
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
          {{ isPending ? 'Menyimpan...' : 'Tambah Subject' }}
        </button>
      </div>
    </form>
  </Dialog>
</template>
