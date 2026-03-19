<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import type { ZodType } from 'zod'
import UploadImage from '../../../ui/UploadImage.vue'
import Editor from 'primevue/editor'
import { useMutation } from '@tanstack/vue-query'
import { ProgramService } from '../../../../services/program'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  schema: ZodType
  initialData?: any
  isUpdate?: boolean
}>()

const router = useRouter()
const uploadKey = ref(0)

const {
  handleSubmit,
  isSubmitting,
  resetForm,
  setValues,
  meta: {
    value: { valid },
  },
} = useForm({
  validationSchema: toTypedSchema(props.schema),
  initialValues: props.initialData,
})

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    setValues(newVal)
  }
}, { immediate: true, deep: true })

const { value: programName, errorMessage: programNameError } =
  useField<string>('programName')

const { value: description, errorMessage: descriptionError } =
  useField<string>('description', undefined, {
    initialValue: '',
  })

const { value: image } =
  useField<string | null>('imageProgram')

const mutate=useMutation({
  mutationFn:async(data:any)=>{
    if (props.isUpdate && props.initialData?.ID) {
      await ProgramService.update(props.initialData.ID, data)
    } else {
      await ProgramService.create(data)
    }
  },
  onSuccess:()=>{
    toast.success(props.isUpdate ? 'Successfully updated' : 'Successfully created')
    if (!props.isUpdate) {
      resetForm()
      uploadKey.value++
      router.push('/dashboard/admin/programs')
    } else {
      router.push('/dashboard/admin/programs')
    }
  },
  onError: (error: any) => {
    toast.error(error.message || 'Something went wrong')
  }
})

const onSubmit = handleSubmit(async (values) => {
   mutate.mutate(values)
})

const isValid = computed(() => !valid || isSubmitting.value)

</script>

<template>
    <form
      @submit="onSubmit"
      class="max-w-5xl mx-auto space-y-8"
    >
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
        <!-- Section: Media -->
        <div class="space-y-4">
          <label class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <Icon icon="mdi:image-plus" class="text-primary text-lg" />
            Banner Program
          </label>
          <div class="flex justify-center">
            <UploadImage v-model="image" :key="uploadKey" class="w-full max-w-md aspect-video" />
          </div>
          <p class="text-[11px] text-gray-400 text-center italic">Disarankan ukuran 1200x630 pixel untuk hasil terbaik.</p>
        </div>

        <div class="grid grid-cols-1 gap-8 pt-4">
          <!-- Section: Basic Info -->
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Icon icon="mdi:format-title" class="text-primary text-lg" />
                Nama Program
              </label>
              <input
                v-model="programName"
                type="text"
                placeholder="Contoh: Intensif UTBK 2025"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 bg-gray-50/50"
              />
              <p v-if="programNameError" class="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                <Icon icon="mdi:alert-circle" />
                {{ programNameError }}
              </p>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Icon icon="mdi:text-box-outline" class="text-primary text-lg" />
                Deskripsi Lengkap
              </label>
              <div class="rounded-xl border border-gray-200 overflow-hidden bg-gray-50/50">
                <Editor
                  v-model="description"
                  editorStyle="height:400px"
                  placeholder="Jelaskan detail program, manfaat, dan apa yang akan didapatkan siswa..."
                  class="border-none"
                />
              </div>
              <p v-if="descriptionError" class="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                <Icon icon="mdi:alert-circle" />
                {{ descriptionError }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-6 border-t border-gray-50">
          <p class="text-sm text-gray-400 italic">
            * Pastikan semua data sudah benar sebelum menyimpan.
          </p>
          <button
            type="submit"
            class="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all duration-200 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
            :disabled="isValid"
          >
            <Icon v-if="isSubmitting" icon="mdi:loading" class="animate-spin text-xl" />
            <Icon v-else :icon="isUpdate ? 'mdi:content-save-edit' : 'mdi:plus-circle'" class="text-xl" />
            {{ isUpdate ? 'Simpan Perubahan' : 'Tambah Program Baru' }}
          </button>
        </div>
      </div>
    </form>
</template>
