<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { toast } from 'vue3-toastify'
import { ResendPasswordSchema } from '../../schemas/auth'
import { AuthService } from '../../services/auth';
import { useApi } from '../../composable/useApi';

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()


const resendForm = useForm({
  validationSchema: toTypedSchema(ResendPasswordSchema),
  initialValues: {
    email: "",
  },
})

const { value: resendEmail, errorMessage: resendError } =
  useField<string>("email", undefined, { initialValue: "" })

const { call: callResend, message, isLoading: isResendLoading, error } = useApi(AuthService.resendOtp)

const onResend = resendForm.handleSubmit(async (values) => {

  await callResend(values.email)
  if (error.value) {
    toast(message, { type: "error" })
    return
  }
  toast("Kode verifikasi berhasil dikirim ulang", {
    type: "success",
  })

   emit("update:modelValue", false) 
})

</script>

<template>
      <form
        @submit="onResend"
        class="space-y-4"
      >
        <div class="text-left">
          <label class="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            v-model="resendEmail"
            type="email"
            placeholder="Masukkan email kamu"
            class="w-full px-3 py-2 border rounded-md bg-[#D2D4C8] outline-none focus:ring-2 focus:ring-primary"
          />
          <p v-if="resendError" class="text-red-600 text-[11px] mt-1">
            {{ resendError }}
          </p>
        </div>

        <button
          type="submit"
          class="w-full py-2 rounded-md font-semibold text-white bg-primary hover:bg-primary/80 transition-all"
        >
          {{ isResendLoading ? "Resending..." : "Resend Code" }}
        </button>
      </form>
</template>