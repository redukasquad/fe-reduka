<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Icon } from '@iconify/vue'
import Editor from 'primevue/editor'
import Dropdown from 'primevue/dropdown'
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import { toast } from 'vue3-toastify'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import UploadImage from '../../../../components/ui/UploadImage.vue'
import { CreateCourseSchema } from '../../../../schemas/course'
import { CourseService } from '../../../../services/course'
import { ProgramService } from '../../../../services/program'

const router = useRouter()
const queryClient = useQueryClient()
const uploadKey = ref(0)

const { handleSubmit, isSubmitting, meta } = useForm({
  validationSchema: toTypedSchema(CreateCourseSchema),
})

const { value: programId, errorMessage: programError } = useField<number | null>('programId', undefined, { initialValue: null })
const { value: nameCourse, errorMessage: nameError } = useField<string>('nameCourse')
const { value: description } = useField<string>('description', undefined, { initialValue: '' })
const { value: startDate, errorMessage: startError } = useField<Date>('startDate')
const { value: endDate, errorMessage: endError } = useField<Date>('endDate')
const { value: isFree } = useField<boolean>('isFree', undefined, { initialValue: false })
const { value: image } = useField<string | null>('image')
const { value: whatsappGroupLink, errorMessage: waError } = useField<string>('whatsappGroupLink')

const { data: programData, isLoading: programsLoading } = useQuery({
  queryKey: ['programs'],
  queryFn: ProgramService.findAll,
})

const programOptions = computed(() =>
  programData.value?.data?.map((p: any) => ({ label: p.programName, value: p.ID })) ?? []
)

const { mutate: createCourse, isPending: creating } = useMutation({
  mutationFn: (data: any) => CourseService.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['my-courses'] })
    toast.success('Course berhasil dibuat')
    router.push({ name: 'tutor-classes' })
  },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal membuat course'),
})

const isDisabled = computed(() => !meta.value.valid || isSubmitting.value || creating.value)
const onSubmit = handleSubmit(values => createCourse(values))
</script>

<template>
  <DashboardLayout>
    <div class="py-6 px-4 md:px-8 backdrop-blur">
      <RouterLink
        :to="{ name: 'tutor-classes' }"
        class="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 hover:text-primary hover:bg-primary/10 transition-all duration-200 mb-4"
      >
        <Icon icon="heroicons:chevron-left" class="text-xl transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span class="text-sm font-medium">Kembali</span>
      </RouterLink>

      <form @submit.prevent="onSubmit" class="max-w-5xl mx-auto space-y-8">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">

          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-50">
            <div>
              <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Icon icon="mdi:book-plus" class="text-primary" />
                Buat Kelas Baru
              </h2>
              <p class="text-sm text-gray-400 mt-1">Setelah dibuat, kamu bisa tambahkan kelas & lessons.</p>
            </div>
            <div class="flex items-center gap-3 bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button type="button" @click="isFree = true"
                :class="[isFree ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600', 'px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2']">
                <Icon icon="mdi:check-circle" v-if="isFree" />Gratis
              </button>
              <button type="button" @click="isFree = false"
                :class="[!isFree ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600', 'px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2']">
                <Icon icon="mdi:currency-usd" v-if="!isFree" />Berbayar
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <label class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Icon icon="mdi:image-plus" class="text-primary text-lg" />Thumbnail
            </label>
            <div class="flex justify-center">
              <UploadImage v-model="image" :key="uploadKey" class="w-full max-w-md aspect-video" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <Icon icon="mdi:school-outline" class="text-primary text-lg" />Program
                </label>
                <Dropdown v-model:modelValue="programId" :options="programOptions" optionLabel="label" optionValue="value"
                  placeholder="Pilih Program" class="w-full rounded-xl border-gray-200 bg-gray-50/50" :loading="programsLoading" />
                <p v-if="programError" class="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" />{{ programError }}
                </p>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <Icon icon="mdi:format-title" class="text-primary text-lg" />Nama Class
                </label>
                <InputText v-model="nameCourse" placeholder="Contoh: Matematika Dasar Intensif"
                  class="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50/50" />
                <p v-if="nameError" class="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" />{{ nameError }}
                </p>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <Icon icon="mdi:whatsapp" class="text-primary text-lg" />Link Grup WhatsApp
                </label>
                <InputText v-model="whatsappGroupLink" placeholder="https://chat.whatsapp.com/..."
                  class="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50/50" />
                <p v-if="waError" class="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" />{{ waError }}
                </p>
              </div>
            </div>
            <div class="space-y-6">
              <div class="p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-6">
                <h3 class="font-bold text-primary flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Icon icon="mdi:calendar-range" />Periode
                </h3>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-gray-500 uppercase">Tanggal Mulai</label>
                  <DatePicker v-model="startDate" showIcon placeholder="Pilih Tanggal Mulai" class="w-full rounded-xl border-gray-200" />
                  <p v-if="startError" class="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                    <Icon icon="mdi:alert-circle" />{{ startError }}
                  </p>
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-gray-500 uppercase">Tanggal Berakhir</label>
                  <DatePicker v-model="endDate" showIcon placeholder="Pilih Tanggal Berakhir" class="w-full rounded-xl border-gray-200" />
                  <p v-if="endError" class="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                    <Icon icon="mdi:alert-circle" />{{ endError }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Icon icon="mdi:text-box-outline" class="text-primary text-lg" />Deskripsi
            </label>
            <div class="rounded-xl border border-gray-200 overflow-hidden bg-gray-50/50">
              <Editor v-model="description" editorStyle="height:300px" class="border-none" />
            </div>
          </div>

          <div class="flex items-center justify-between pt-8 border-t border-gray-50">
            <p class="text-xs text-gray-400 italic">Setelah disimpan, tambahkan kelas & lessons dari halaman detail.</p>
            <button type="submit" :disabled="isDisabled"
              class="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all duration-200 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed">
              <Icon v-if="creating || isSubmitting" icon="mdi:loading" class="animate-spin text-xl" />
              <Icon v-else icon="mdi:content-save-check" class="text-xl" />
              Simpan & Lanjut
            </button>
          </div>
        </div>
      </form>
    </div>
  </DashboardLayout>
</template>
