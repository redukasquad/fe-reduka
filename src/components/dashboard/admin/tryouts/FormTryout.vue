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
  meta,
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

const { value: driveLink, errorMessage: driveLinkError } =
  useField<string>('driveLink')

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
    console.log(data)
    await TryoutService.create(data)
  },
  onSuccess: () => {
    toast.success('Berhasil membuat tryout')
  },
})

const onSubmit = handleSubmit(async (values) => {
  mutate.mutate(values)
  resetForm()
  uploadKey.value++
})

const isValid = computed(() => !meta.value.valid || isSubmitting.value)
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
            <Icon icon="mdi:pencil-box-multiple" class="text-primary" />
            Konfigurasi Tryout
          </h2>
          <p class="text-sm text-gray-400 mt-1">Atur detail pendaftaran dan publikasi tryout.</p>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
            <span class="text-xs font-bold text-gray-500 uppercase">Publikasikan</span>
            <InputSwitch v-model="isPublished" />
          </div>
        </div>
      </div>

      <!-- Section: Media -->
      <div class="space-y-4">
        <label class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
          <Icon icon="mdi:image-plus" class="text-primary text-lg" />
          Banner Tryout
        </label>
        <div class="flex justify-center">
          <UploadImage v-model="imageUrl" :key="uploadKey" class="w-full max-w-md aspect-video" />
        </div>
        <p class="text-[11px] text-gray-400 text-center italic">Gunakan gambar yang menarik untuk meningkatkan pendaftaran.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Section: Basic Info -->
        <div class="space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Icon icon="mdi:format-title" class="text-primary text-lg" />
              Nama Tryout
            </label>
            <InputText
              v-model="name"
              placeholder="Contoh: Tryout Nasional SNBT 2025"
              class="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50/50"
            />
            <p v-if="nameError" class="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
              <Icon icon="mdi:alert-circle" />
              {{ nameError }}
            </p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Icon icon="mdi:google-drive" class="text-primary text-lg" />
              Link Pembahasan (Drive)
            </label>
            <InputText
              v-model="driveLink"
              placeholder="https://drive.google.com/..."
              class="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50/50"
            />
            <p v-if="driveLinkError" class="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
              <Icon icon="mdi:alert-circle" />
              {{ driveLinkError }}
            </p>
          </div>

          <!-- Pricing Section -->
          <div class="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
            <div class="flex items-center justify-between">
              <label class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Icon icon="mdi:cash-multiple" class="text-primary" />
                Sistem Berbayar
              </label>
              <InputSwitch :modelValue="!isFree" @update:modelValue="isFree = !$event" />
            </div>
            
            <div v-if="!isFree" class="space-y-4 pt-2 border-t border-gray-200">
              <div class="space-y-1">
                <label class="text-[10px] font-bold text-gray-400 uppercase">Harga Tryout (IDR)</label>
                <InputNumber
                  v-model="price"
                  mode="currency"
                  currency="IDR"
                  locale="id-ID"
                  placeholder="Harga"
                  class="w-full"
                  inputClass="rounded-xl border-gray-200 px-4 py-2"
                />
                <p v-if="priceError" class="text-red-500 text-[10px] font-medium">{{ priceError }}</p>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold text-gray-400 uppercase">Link Pembayaran / WhatsApp</label>
                <InputText
                  v-model="paymentLink"
                  placeholder="Link pembayaran otomatis atau manual"
                  class="w-full rounded-xl border-gray-200 px-4 py-2 text-sm"
                />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold text-gray-400 uppercase">URL QRIS (Opsional)</label>
                <InputText
                  v-model="qrisImageUrl"
                  placeholder="Link gambar QRIS untuk discan"
                  class="w-full rounded-xl border-gray-200 px-4 py-2 text-sm"
                />
              </div>
            </div>
            <div v-else class="text-xs text-green-600 font-medium flex items-center gap-1">
              <Icon icon="mdi:check-decagram" />
              Tryout ini diatur sebagai Gratis.
            </div>
          </div>
        </div>

        <!-- Section: Registration Dates -->
        <div class="space-y-6">
          <div class="p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-6">
            <h3 class="font-bold text-primary flex items-center gap-2 text-sm uppercase tracking-wider">
              <Icon icon="mdi:calendar-clock" />
              Periode Pendaftaran
            </h3>
            
            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-500 uppercase">Mulai Pendaftaran</label>
              <Calendar
                v-model="registrationStart"
                showTime
                hourFormat="24"
                showIcon
                placeholder="Pilih Tanggal & Waktu"
                class="w-full"
                inputClass="rounded-xl border-gray-200"
              />
              <p v-if="registrationStartError" class="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                <Icon icon="mdi:alert-circle" />
                {{ registrationStartError }}
              </p>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-500 uppercase">Akhir Pendaftaran</label>
              <Calendar
                v-model="registrationEnd"
                showTime
                hourFormat="24"
                showIcon
                placeholder="Pilih Tanggal & Waktu"
                class="w-full"
                inputClass="rounded-xl border-gray-200"
              />
              <p v-if="registrationEndError" class="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                <Icon icon="mdi:alert-circle" />
                {{ registrationEndError }}
              </p>
            </div>

            <div class="p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex gap-3">
              <Icon icon="mdi:information-outline" class="text-yellow-600 text-xl shrink-0" />
              <p class="text-[11px] text-yellow-700 leading-tight">
                Pastikan pendaftaran berakhir sebelum waktu pelaksanaan tryout yang sebenarnya.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Description -->
      <div class="space-y-2">
        <label class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
          <Icon icon="mdi:text-box-outline" class="text-primary text-lg" />
          Deskripsi & Ketentuan
        </label>
        <div class="rounded-xl border border-gray-200 overflow-hidden bg-gray-50/50">
          <Editor
            v-model="description"
            editorStyle="height:350px"
            placeholder="Jelaskan detail tryout, jumlah soal, waktu pengerjaan, dan syarat kelulusan..."
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
          * Perubahan status pendaftaran akan langsung berdampak pada pengguna.
        </p>
        <button
          type="submit"
          class="flex items-center gap-2 px-10 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all duration-200 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
          :disabled="isValid"
        >
          <Icon v-if="isSubmitting" icon="mdi:loading" class="animate-spin text-xl" />
          <Icon v-else icon="mdi:content-save-check" class="text-xl" />
          Simpan Tryout
        </button>
      </div>
    </div>
  </form>
</template>