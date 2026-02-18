<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import type { ZodType } from 'zod'
import UploadImage from '../../../ui/UploadImage.vue'
import Editor from 'primevue/editor'
import { useMutation } from '@tanstack/vue-query'
import { ProgramService } from '../../../../services/program'
import { toast } from 'vue3-toastify'

const { schema } = defineProps<{
  schema: ZodType
}>()

const {
  handleSubmit,
  isSubmitting,
  meta: {
    value: { valid },
  },
} = useForm({
  validationSchema: toTypedSchema(schema),
})

const { value: programName, errorMessage: programNameError } =
  useField<string>('programName')

const { value: description, errorMessage: descriptionError } =
  useField<string>('description', undefined, {
    initialValue: '',
  })

const mutate=useMutation({
  mutationFn:async(data:any)=>{
    await ProgramService.create(data)
  },
  onSuccess:()=>{
    toast.success('Sucessfully created')
  }
})


const { value: image } =
  useField<string | null>('imageProgram')

const onSubmit = handleSubmit(async (values) => {
   mutate.mutate(values)
})

const isValid = computed(() => !valid || isSubmitting.value)
const uploadKey = ref(0)

</script>

<template>
    <form
      @submit="onSubmit"
      class="h-full flex flex-col gap-4 w-full max-w-5xl mx-auto p-4"
    >
      <UploadImage v-model="image" :key="uploadKey" />

      <div>
        <input
          v-model="programName"
          type="text"
          placeholder="Nama Program"
          class="py-2 w-full pl-4 rounded ring-2 ring-primary/40 focus:ring-primary/50 outline-none"
        />
        <p class="text-red-500 text-sm">{{ programNameError }}</p>
      </div>

      <div class="flex-1 flex flex-col">
        <Editor
          v-model="description"
          class="flex-1"
          editorStyle="height:50vh"
          placeholder="Masukkan deskripsi lengkap program untuk ditampilkan kepada pengguna"
        />
        <p class="text-red-500 text-sm">{{ descriptionError }}</p>
      </div>

      <button
        type="submit"
        class="self-end mt-6 px-4 py-2 rounded-md bg-primary text-primary-foreground"
        :disabled="isValid"
      >
        Submit
      </button>
    </form>
</template>
