<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import type { ZodType } from 'zod'
import UploadImage from '../../../ui/UploadImage.vue'
import Editor from 'primevue/editor'
import Dropdown from 'primevue/dropdown'
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

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
    class="max-w-5xl mx-auto flex flex-col gap-6 p-6 bg-surface rounded-xl shadow"
  >
    <div class="flex justify-between items-center px-4 mt-4">
      <h2 class="text-2xl font-semibold">New course</h2>
      <Button
        type="button"
        @click="isFree = !isFree"
        :label="isFree ? 'Gratis' : 'Berbayar'"
        :icon="isFree ? 'pi pi-check' : 'pi pi-dollar'"
        :severity="isFree ? 'success' : 'danger'"
        outlined
       />
    </div>

    <UploadImage v-model="image" :key="uploadKey"  />

    <div>
      <Dropdown
        v-model:modelValue="programId"
        :options="programOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Pilih Program"
        class="w-full"
        :loading="isLoading"
      />
      <small class="text-red-500">{{ programError }}</small>
    </div>

    <div>
      <InputText
        v-model="nameCourse"
        placeholder="Nama Course"
        class="w-full"
      />
      <small class="text-red-500">{{ nameError }}</small>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <DatePicker
          v-model="startDate"
          showIcon
          placeholder="Start Date"
          class="w-full"
        />
        <small class="text-red-500">{{ startError }}</small>
      </div>

      <div>
        <DatePicker
          v-model="endDate"
          showIcon
          placeholder="End Date"
          class="w-full"
        />
        <small class="text-red-500">{{ endError }}</small>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label class="font-medium">Deskripsi</label>

      <Editor
        v-model="description"
        editorStyle="height:300px"
      />

      <small class="text-red-500">{{ descriptionError }}</small>
    </div>

    <div>
      <InputText
        v-model="whatsappGroupLink"
        placeholder="Link Grup WhatsApp (opsional)"
        class="w-full"
      />
      <small class="text-red-500">{{ waError }}</small>
    </div>

    <div class="flex justify-end">
      <Button
        type="submit"
        label="Create Course"
        icon="pi pi-check"
        :loading="isSubmitting"
        :disabled="isDisabled"
      />
    </div>
  </form>
</template>
