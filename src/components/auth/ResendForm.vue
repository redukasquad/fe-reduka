<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'
import { ResendPasswordSchema } from '../../schemas/auth'
import { AuthService } from '../../services/auth'
import { useApi } from '../../composable/useApi'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: "update:modelValue", value: boolean): void }>()

const resendForm = useForm({
  validationSchema: toTypedSchema(ResendPasswordSchema),
  initialValues: { email: "" },
})

const { value: resendEmail, errorMessage: resendError } = useField<string>("email", undefined, { initialValue: "" })
const { call, message, isLoading, error } = useApi(AuthService.resendOtp)

const onResend = resendForm.handleSubmit(async (values) => {
  await call(values.email)
  if (error.value) { toast(message, { type: "error" }); return }
  toast("Kode verifikasi berhasil dikirim ulang", { type: "success" })
  emit("update:modelValue", false)
})
</script>

<template>
  <form @submit="onResend" class="space-y-4">
    <div class="space-y-1.5">
      <label class="text-sm font-medium text-gray-700">Email</label>
      <div class="relative">
        <Icon icon="mdi:email-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input
          v-model="resendEmail"
          type="email"
          placeholder="nama@email.com"
          :class="['w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 bg-white', resendError ? 'border-red-300 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-primary/25 focus:border-primary/50']"
        />
      </div>
      <p v-if="resendError" class="text-red-500 text-xs flex items-center gap-1">
        <Icon icon="mdi:alert-circle-outline" class="text-sm" />{{ resendError }}
      </p>
    </div>

    <button
      type="submit"
      :disabled="isLoading"
      class="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
    >
      <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin text-lg" />
      {{ isLoading ? 'Mengirim...' : 'Kirim Ulang Kode' }}
    </button>
  </form>
</template>
