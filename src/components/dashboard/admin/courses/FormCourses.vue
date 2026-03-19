<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { computed, ref} from 'vue'
import type { ZodType } from 'zod'
import UploadImage from '../../../ui/UploadImage.vue'
import Editor from 'primevue/editor'
import Dropdown from 'primevue/dropdown'
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import { Icon } from '@iconify/vue'

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ProgramService } from '../../../../services/program'
import type { CreateCourseInput } from '../../../../schemas/course'
import { CourseService } from '../../../../services/course'
import { toast } from 'vue3-toastify'

const { schema } = defineProps<{
  schema: ZodType
}>()

const {
  handleSubmit,
  isSubmitting,
  meta: { value: { valid } },
  resetForm
} = useForm({
  validationSchema: toTypedSchema(schema),
})

const uploadKey = ref(0)


const { value: programId, errorMessage: programError } =
  useField<number | null>('programId', undefined, {
    initialValue: null
  })

const { value: nameCourse, errorMessage: nameError } =
  useField<string>('nameCourse')

const { value: description, errorMessage: descriptionError } =
  useField<string>('description', undefined, { initialValue: '' })

const { value: startDate, errorMessage: startError } =
  useField<Date>('startDate')

const { value: endDate, errorMessage: endError } =
  useField<Date>('endDate')

const { value: isFree } =
  useField<boolean>('isFree', undefined, { initialValue: false })

const { value: image } =
  useField<string | null>('image')

const { value: whatsappGroupLink, errorMessage: waError } =
  useField<string>('whatsappGroupLink')

const { data, isLoading } = useQuery({
  queryKey: ['programs'],
  queryFn: ProgramService.findAll,
})

const programOptions = computed(() =>
  data.value?.data?.map((p: any) => ({
    label: p.programName,
    value: p.ID,
  })) ?? []
)

const queryClient = useQueryClient()

const mutation=useMutation({
 mutationFn:async(data:CreateCourseInput)=>{
  await CourseService.create(data)
 },
 onSuccess:()=>{
  toast.success('Successfully created')
  queryClient.invalidateQueries({
    queryKey: ['courses']
  })
     uploadKey.value++
 }
})

const onSubmit = handleSubmit(async (values) => {
  mutation.mutate(values)
  resetForm()
})


const isDisabled = computed(() => !valid || isSubmitting.value)
</script>

<template>
  <form
    @submit="onSubmit"
    class="max-w-5xl mx-auto space-y-8"
  >
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
      <!-- Section: Header & Status -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-50">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Icon icon="mdi:book-plus" class="text-primary" />
            Buat Course Baru
          </h2>
          <p class="text-sm text-gray-400 mt-1">Lengkapi informasi course di bawah ini.</p>
        </div>
        
        <div class="flex items-center gap-3 bg-gray-50 p-1 rounded-xl border border-gray-100">
          <button 
            type="button"
            @click="isFree = true"
            :class="[isFree ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600', 'px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2']"
          >
            <Icon icon="mdi:check-circle" v-if="isFree" />
            Gratis
          </button>
          <button 
            type="button"
            @click="isFree = false"
            :class="[!isFree ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600', 'px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2']"
          >
            <Icon icon="mdi:currency-usd" v-if="!isFree" />
            Berbayar
          </button>
        </div>
      </div>

      <!-- Section: Media -->
      <div class="space-y-4">
        <label class=" text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
          <Icon icon="mdi:image-plus" class="text-primary text-lg" />
          Thumbnail Course
        </label>
        <div class="flex justify-center">
          <UploadImage v-model="image" :key="uploadKey" class="w-full max-w-md aspect-video" />
        </div>
        <p class="text-[11px] text-gray-400 text-center italic">Format: JPG, PNG, WEBP. Maks 2MB.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Section: Basic Info -->
        <div class="space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Icon icon="mdi:school-outline" class="text-primary text-lg" />
              Program Terkait
            </label>
            <Dropdown
              v-model:modelValue="programId"
              :options="programOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Pilih Program Utama"
              class="w-full rounded-xl border-gray-200 bg-gray-50/50"
              :loading="isLoading"
            />
            <p v-if="programError" class="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
              <Icon icon="mdi:alert-circle" />
              {{ programError }}
            </p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Icon icon="mdi:format-title" class="text-primary text-lg" />
              Nama Course
            </label>
            <InputText
              v-model="nameCourse"
              placeholder="Contoh: Matematika Dasar Intensif"
              class="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50/50"
            />
            <p v-if="nameError" class="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
              <Icon icon="mdi:alert-circle" />
              {{ nameError }}
            </p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Icon icon="mdi:whatsapp" class="text-primary text-lg" />
              Link Grup WhatsApp
            </label>
            <InputText
              v-model="whatsappGroupLink"
              placeholder="https://chat.whatsapp.com/..."
              class="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50/50"
            />
            <p v-if="waError" class="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
              <Icon icon="mdi:alert-circle" />
              {{ waError }}
            </p>
          </div>
        </div>

        <!-- Section: Dates -->
        <div class="space-y-6">
          <div class="p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-6">
            <h3 class="font-bold text-primary flex items-center gap-2 text-sm uppercase tracking-wider">
              <Icon icon="mdi:calendar-range" />
              Periode Course
            </h3>
            
            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-500 uppercase">Tanggal Mulai</label>
              <DatePicker
                v-model="startDate"
                showIcon
                placeholder="Pilih Tanggal Mulai"
                class="w-full rounded-xl border-gray-200"
              />
              <p v-if="startError" class="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                <Icon icon="mdi:alert-circle" />
                {{ startError }}
              </p>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-500 uppercase">Tanggal Berakhir</label>
              <DatePicker
                v-model="endDate"
                showIcon
                placeholder="Pilih Tanggal Berakhir"
                class="w-full rounded-xl border-gray-200"
              />
              <p v-if="endError" class="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                <Icon icon="mdi:alert-circle" />
                {{ endError }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Description -->
      <div class="space-y-2">
        <label class=" text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
          <Icon icon="mdi:text-box-outline" class="text-primary text-lg" />
          Deskripsi Lengkap
        </label>
        <div class="rounded-xl border border-gray-200 overflow-hidden bg-gray-50/50">
          <Editor
            v-model="description"
            editorStyle="height:350px"
            placeholder="Jelaskan apa yang akan dipelajari, jadwal, dan persyaratan lainnya..."
            class="border-none"
          />
        </div>
        <p v-if="descriptionError" class="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
          <Icon icon="mdi:alert-circle" />
          {{ descriptionError }}
        </p>
      </div>

      <!-- Footer: Actions -->
      <div class="flex items-center justify-between pt-8 border-t border-gray-50">
        <p class="text-xs text-gray-400 italic">
          * Pastikan periode tanggal valid sebelum menyimpan.
        </p>
        <button
          type="submit"
          class="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all duration-200 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
          :disabled="isDisabled"
        >
          <Icon v-if="isSubmitting" icon="mdi:loading" class="animate-spin text-xl" />
          <Icon v-else icon="mdi:content-save-check" class="text-xl" />
          Simpan Course
        </button>
      </div>
    </div>
  </form>
</template>
