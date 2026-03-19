<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import Calendar from 'primevue/calendar'
import Editor from 'primevue/editor'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import UploadImage from '../../../../components/ui/UploadImage.vue'
import { TryoutService } from '../../../../services/tryout'
import { updateTryOutInputSchema } from '../../../../schemas/tryout'
import type { UpdateTryOutInput } from '../../../../schemas/tryout'

const route = useRoute()
const router = useRouter()
const tryoutId = Number(route.params.id)

const { data, isLoading, isError } = useQuery({
  queryKey: ['tryout', tryoutId],
  queryFn: () => TryoutService.findOne(tryoutId),
  enabled: !!tryoutId,
})

const tryout = computed(() => data.value?.data ?? null)

const { handleSubmit, isSubmitting, meta } = useForm({
  validationSchema: toTypedSchema(updateTryOutInputSchema),
})

const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: description } = useField<string>('description', undefined, { initialValue: '' })
const { value: imageUrl } = useField<string | null>('imageUrl')
const { value: driveLink, errorMessage: driveLinkError } = useField<string>('driveLink')
const { value: isFree } = useField<boolean>('isFree', undefined, { initialValue: true })
const { value: price, errorMessage: priceError } = useField<number>('price')
const { value: qrisImageUrl, errorMessage: qrisImageUrlError } = useField<string>('qrisImageUrl')
const { value: paymentLink, errorMessage: paymentLinkError } = useField<string>('paymentLink')
const { value: registrationStart, errorMessage: registrationStartError } = useField<Date>('registrationStart')
const { value: registrationEnd, errorMessage: registrationEndError } = useField<Date>('registrationEnd')
const { value: isPublished } = useField<boolean>('isPublished', undefined, { initialValue: false })

// Populate form when data loads
watch(tryout, (val) => {
  if (!val) return
  name.value = val.name
  description.value = val.description ?? ''
  imageUrl.value = val.imageUrl ?? null
  driveLink.value = val.driveLink ?? ''
  isFree.value = val.isFree
  price.value = val.price ?? 0
  qrisImageUrl.value = val.qrisImageUrl ?? ''
  paymentLink.value = val.paymentLink ?? ''
  registrationStart.value = new Date(val.registrationStart)
  registrationEnd.value = new Date(val.registrationEnd)
  isPublished.value = val.isPublished
}, { immediate: true })

const mutation = useMutation({
  mutationFn: (data: UpdateTryOutInput) => TryoutService.update(tryoutId, data),
  onSuccess: () => {
    toast.success('Tryout berhasil diperbarui')
    router.push({ name: 'admin-tryouts-view', params: { id: tryoutId } })
  },
  onError: (err: any) => {
    toast.error(err?.response?.data?.message ?? 'Gagal memperbarui tryout')
  },
})

const onSubmit = handleSubmit((values) => {
  mutation.mutate(values)
})

const isDisabled = computed(() => !meta.value.valid || isSubmitting.value)
</script>

<template>
  <DashboardLayout class="pb-2 pt-8 backdrop-blur-sm">
    <div class="relative">
      <RouterLink
        :to="{ name: 'admin-tryouts-view', params: { id: tryoutId } }"
        class="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 hover:text-primary hover:bg-primary/10 transition-all duration-200 absolute left-4 top-0"
      >
        <Icon icon="heroicons:chevron-left" class="text-xl transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span class="text-sm font-medium hidden sm:inline">Back</span>
      </RouterLink>

      <h1 class="text-3xl font-bold text-center mb-4 text-primary">Edit Tryout</h1>

      <div v-if="isLoading" class="p-8 text-center text-gray-600">Memuat data...</div>
      <div v-else-if="isError" class="p-8 text-center text-red-600">Gagal memuat data tryout.</div>

      <form
        v-else-if="tryout"
        @submit="onSubmit"
        class="h-full flex flex-col gap-6 w-full max-w-5xl mx-auto p-6"
      >
        <UploadImage v-model="imageUrl" />

        <div>
          <InputText v-model="name" placeholder="Nama Tryout" class="w-full" />
          <p class="text-red-500 text-sm mt-1">{{ nameError }}</p>
        </div>

        <div class="flex flex-col gap-2">
          <Editor v-model="description" editorStyle="height:40vh" placeholder="Deskripsi tryout" />
        </div>

        <div>
          <InputText v-model="driveLink" placeholder="Link Google Drive Pembahasan Soal" class="w-full" />
          <p class="text-red-500 text-sm mt-1">{{ driveLinkError }}</p>
        </div>

        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div class="font-medium">Gratis</div>
            <div class="text-sm text-surface-500">Aktifkan jika tryout tidak berbayar</div>
          </div>
          <InputSwitch v-model="isFree" />
        </div>

        <div v-if="!isFree" class="flex flex-col gap-4">
          <div>
            <InputNumber v-model="price" mode="currency" currency="IDR" locale="id-ID" placeholder="Harga" class="w-full" />
            <p class="text-red-500 text-sm mt-1">{{ priceError }}</p>
          </div>
          <div>
            <InputText v-model="qrisImageUrl" placeholder="Link Gambar QRIS" class="w-full" />
            <p class="text-red-500 text-sm mt-1">{{ qrisImageUrlError }}</p>
          </div>
          <div>
            <InputText v-model="paymentLink" placeholder="Link Pembayaran" class="w-full" />
            <p class="text-red-500 text-sm mt-1">{{ paymentLinkError }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Calendar v-model="registrationStart" showTime hourFormat="24" placeholder="Mulai Pendaftaran" class="w-full" />
            <p class="text-red-500 text-sm mt-1">{{ registrationStartError }}</p>
          </div>
          <div>
            <Calendar v-model="registrationEnd" showTime hourFormat="24" placeholder="Akhir Pendaftaran" class="w-full" />
            <p class="text-red-500 text-sm mt-1">{{ registrationEndError }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <div class="font-medium">Publikasikan Tryout</div>
            <div class="text-sm text-surface-500">Aktifkan jika tryout dapat diakses pengguna</div>
          </div>
          <InputSwitch v-model="isPublished" />
        </div>

        <button
          type="submit"
          class="self-end mt-6 px-6 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
          :disabled="isDisabled"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  </DashboardLayout>
</template>
