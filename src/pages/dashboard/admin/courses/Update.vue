<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'
import DatePicker from 'primevue/datepicker'
import Editor from 'primevue/editor'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import UploadImage from '../../../../components/ui/UploadImage.vue'
import { CourseService } from '../../../../services/course'
import { ProgramService } from '../../../../services/program'
import { UpdateCourseSchema, type UpdateCourseInput } from '../../../../schemas/course'

const route = useRoute()
const router = useRouter()
const courseId = Number(route.params.id)
const queryClient = useQueryClient()

const { data, isLoading, isError } = useQuery({
  queryKey: ['course', courseId],
  queryFn: () => CourseService.findOne(courseId),
  enabled: !!courseId,
})

const course = computed(() => data.value?.data ?? null)

const { data: programsData, isLoading: programsLoading } = useQuery({
  queryKey: ['programs'],
  queryFn: ProgramService.findAll,
})

const programOptions = computed(() =>
  programsData.value?.data?.map((p: any) => ({ label: p.programName, value: p.ID })) ?? []
)

const { handleSubmit, isSubmitting, meta } = useForm({
  validationSchema: toTypedSchema(UpdateCourseSchema),
})

const { value: programId, errorMessage: programError } = useField<number | null>('programId', undefined, { initialValue: null })
const { value: nameCourse, errorMessage: nameError } = useField<string>('nameCourse')
const { value: description } = useField<string>('description', undefined, { initialValue: '' })
const { value: startDate, errorMessage: startError } = useField<Date>('startDate')
const { value: endDate, errorMessage: endError } = useField<Date>('endDate')
const { value: isFree } = useField<boolean>('isFree', undefined, { initialValue: false })
const { value: image } = useField<string | null>('image')
const { value: whatsappGroupLink, errorMessage: waError } = useField<string>('whatsappGroupLink')

watch(course, (val) => {
  if (!val) return
  programId.value = val.programId ?? null
  nameCourse.value = val.nameCourse
  description.value = val.description ?? ''
  startDate.value = new Date(val.startDate)
  endDate.value = new Date(val.endDate)
  isFree.value = val.isFree
  image.value = val.image ?? null
  whatsappGroupLink.value = val.whatsAppGroupLink ?? '' // whatsAppGroupLink (capital A) from BE
}, { immediate: true })

const mutation = useMutation({
  mutationFn: (data: UpdateCourseInput) => CourseService.update(courseId, data),
  onSuccess: () => {
    toast.success('Course berhasil diperbarui')
    queryClient.invalidateQueries({ queryKey: ['course', courseId] })
    queryClient.invalidateQueries({ queryKey: ['courses'] })
    router.push({ name: 'admin-courses-view', params: { id: courseId } })
  },
  onError: (err: any) => {
    toast.error(err?.response?.data?.message ?? 'Gagal memperbarui course')
  },
})

const onSubmit = handleSubmit((values) => mutation.mutate(values))
const isDisabled = computed(() => !meta.value.valid || isSubmitting.value)
</script>

<template>
  <DashboardLayout class="pb-2 pt-8 backdrop-blur-sm">
    <div class="relative">
      <RouterLink
        :to="{ name: 'admin-courses-view', params: { id: courseId } }"
        class="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 hover:text-primary hover:bg-primary/10 transition-all duration-200 absolute left-4 top-0"
      >
        <Icon icon="heroicons:chevron-left" class="text-xl transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span class="text-sm font-medium hidden sm:inline">Back</span>
      </RouterLink>

      <h1 class="text-3xl font-bold text-center mb-6 text-primary">Edit Course</h1>

      <div v-if="isLoading" class="p-8 text-center text-gray-500">Memuat data...</div>
      <div v-else-if="isError" class="p-8 text-center text-red-500">Gagal memuat data course.</div>

      <form
        v-else-if="course"
        @submit="onSubmit"
        class="max-w-5xl mx-auto flex flex-col gap-6 p-6 bg-surface rounded-xl shadow"
      >
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Edit Course</h2>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-500">{{ isFree ? 'Gratis' : 'Berbayar' }}</span>
            <InputSwitch v-model="isFree" />
          </div>
        </div>

        <UploadImage v-model="image" />

        <div>
          <Dropdown
            v-model:modelValue="programId"
            :options="programOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Pilih Program"
            class="w-full"
            :loading="programsLoading"
          />
          <small class="text-red-500">{{ programError }}</small>
        </div>

        <div>
          <InputText v-model="nameCourse" placeholder="Nama Course" class="w-full" />
          <small class="text-red-500">{{ nameError }}</small>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <DatePicker v-model="startDate" showIcon placeholder="Start Date" class="w-full" />
            <small class="text-red-500">{{ startError }}</small>
          </div>
          <div>
            <DatePicker v-model="endDate" showIcon placeholder="End Date" class="w-full" />
            <small class="text-red-500">{{ endError }}</small>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-sm">Deskripsi</label>
          <Editor v-model="description" editorStyle="height:300px" />
        </div>

        <div>
          <InputText v-model="whatsappGroupLink" placeholder="Link Grup WhatsApp (opsional)" class="w-full" />
          <small class="text-red-500">{{ waError }}</small>
        </div>

        <div class="flex justify-end">
          <Button
            type="submit"
            label="Simpan Perubahan"
            icon="pi pi-check"
            :loading="isSubmitting"
            :disabled="isDisabled"
          />
        </div>
      </form>
    </div>
  </DashboardLayout>
</template>
