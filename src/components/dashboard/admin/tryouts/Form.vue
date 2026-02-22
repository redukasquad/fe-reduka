<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import type { ZodType } from 'zod'
import UploadImage from '../../../ui/UploadImage.vue'
import Editor from 'primevue/editor'
import InputSwitch from 'primevue/inputswitch'
import Calendar from 'primevue/calendar'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue3-toastify'
import { TryoutService } from '../../../../services/tryout'

const { schema } = defineProps<{
  schema: ZodType
}>()

const {
  handleSubmit,
  isSubmitting,
  resetForm,
  meta: {
    value: { valid },
  },
} = useForm({
  validationSchema: toTypedSchema(schema),
})

const uploadKey = ref(0)

const { value: name, errorMessage: nameError } =
  useField<string>('name')

const { value: description, errorMessage: descriptionError } =
  useField<string>('description', undefined, {
    initialValue: '',
  })

const { value: imageUrl } =
  useField<string | null>('imageUrl')

const { value: isFree } =
  useField<boolean>('isFree', undefined, {
    initialValue: true,
  })

const { value: price, errorMessage: priceError } =
  useField<number>('price')

const { value: qrisImageUrl, errorMessage: qrisImageUrlError } =
  useField<string>('qrisImageUrl')

const { value: paymentLink, errorMessage: paymentLinkError } =
  useField<string>('paymentLink')

const { value: registrationStart, errorMessage: registrationStartError } =
  useField<Date>('registrationStart')

const { value: registrationEnd, errorMessage: registrationEndError } =
  useField<Date>('registrationEnd')

const { value: isPublished } =
  useField<boolean>('isPublished', undefined, {
    initialValue: false,
  })

watch(isFree, (val) => {
  if (val) {
    price.value = 0
    qrisImageUrl.value = ''
    paymentLink.value = ''
  }
})

const mutate = useMutation({
  mutationFn: async (data: any) => {
    await TryoutService.create(data)
  },
  onSuccess: () => {
    toast.success('Successfully created')
  },
})

const onSubmit = handleSubmit(async (values) => {
  mutate.mutate(values)
  resetForm()
  uploadKey.value++
})

const isValid = computed(() => !valid || isSubmitting.value)
</script>

<template>
  <form
    @submit="onSubmit"
    class="h-full flex flex-col gap-6 w-full max-w-5xl mx-auto p-6"
  > 
    <UploadImage v-model="imageUrl" :key="uploadKey" />

    <div>
      <InputText
        v-model="name"
        placeholder="Nama TryOut"
        class="w-full"
      />
      <p class="text-red-500 text-sm mt-1">{{ nameError }}</p>
    </div>

    <div class="flex flex-col gap-2">
      <Editor
        v-model="description"
        editorStyle="height:40vh"
        placeholder="Masukkan deskripsi lengkap tryout"
      />
      <p class="text-red-500 text-sm">{{ descriptionError }}</p>
    </div>

    <div class="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <div class="font-medium">Gratis</div>
        <div class="text-sm text-surface-500">
          Aktifkan jika tryout tidak berbayar
        </div>
      </div>
      <InputSwitch v-model="isFree" />
    </div>

    <div v-if="!isFree" class="flex flex-col gap-4">
      <div>
        <InputNumber
          v-model="price"
          mode="currency"
          currency="IDR"
          locale="id-ID"
          placeholder="Harga"
          class="w-full"
        />
        <p class="text-red-500 text-sm mt-1">{{ priceError }}</p>
      </div>

      <div>
        <InputText
          v-model="qrisImageUrl"
          placeholder="QRIS Image URL"
          class="w-full"
        />
        <p class="text-red-500 text-sm mt-1">{{ qrisImageUrlError }}</p>
      </div>

      <div>
        <InputText
          v-model="paymentLink"
          placeholder="Payment Link"
          class="w-full"
        />
        <p class="text-red-500 text-sm mt-1">{{ paymentLinkError }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Calendar
          v-model="registrationStart"
          showTime
          hourFormat="24"
          placeholder="Registration Start"
          class="w-full"
        />
        <p class="text-red-500 text-sm mt-1">{{ registrationStartError }}</p>
      </div>

      <div>
        <Calendar
          v-model="registrationEnd"
          showTime
          hourFormat="24"
          placeholder="Registration End"
          class="w-full"
        />
        <p class="text-red-500 text-sm mt-1">{{ registrationEndError }}</p>
      </div>
    </div>

    <div class="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <div class="font-medium">Publish TryOut</div>
        <div class="text-sm text-surface-500">
          Aktifkan jika tryout bisa diakses pengguna
        </div>
      </div>
      <InputSwitch v-model="isPublished" />
    </div>

    <button
      type="submit"
      class="self-end mt-6 px-6 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
      :disabled="isValid"
    >
      Submit
    </button>
  </form>
</template>