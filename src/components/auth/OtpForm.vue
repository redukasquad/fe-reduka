<script setup lang="ts">
import { useForm, useField } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { computed, ref } from "vue"
import { Icon } from "@iconify/vue"
import { useApi } from "../../composable/useApi"
import { AuthService } from "../../services/auth"
import { toast } from "vue3-toastify"
import { useRouter } from "vue-router"
import { VerifyOtpSchema } from "../../schemas/auth"

const router = useRouter()

const form = useForm({
  validationSchema: toTypedSchema(VerifyOtpSchema),
  initialValues: {
    otp: "",
    email: router.currentRoute.value.query.email as string || "",
  },
})

const { value: otp, errorMessage } = useField<string>("otp", undefined, { initialValue: "" })
const otpInputs = ref<HTMLInputElement[]>([])
const { call, isLoading, error, message } = useApi(AuthService.verifyOtp)

const onInput = (e: Event, index: number) => {
  const value = (e.target as HTMLInputElement).value.replace(/\D/g, "")
  if (!value) return
  const arr = (otp.value || "").split("")
  arr[index] = value[value.length - 1] || ''
  otp.value = arr.join("")
  if (index < 5) otpInputs.value[index + 1]?.focus()
}

const onKeydown = (e: KeyboardEvent, index: number) => {
  if (e.key === "Backspace") {
    const arr = (otp.value || "").split("")
    arr[index] = ""
    otp.value = arr.join("")
    if (index > 0) otpInputs.value[index - 1]?.focus()
  }
}

const onPaste = (e: ClipboardEvent) => {
  const pasted = e.clipboardData?.getData("text").replace(/\D/g, "")
  if (!pasted) return
  otp.value = pasted.slice(0, 6)
  otpInputs.value[5]?.focus()
}

const onSubmit = form.handleSubmit(async (values) => {
  await call(values)
  if (message.value.includes("successfully")) {
    toast(message.value || "Email berhasil diverifikasi", { type: "success" })
    router.push("/auth/login")
  }
  if (error.value) toast(message.value || "OTP tidak valid", { type: "error" })
})

const isDisabled = computed(() => !form.meta.value.valid || isLoading.value)
</script>

<template>
  <form @submit="onSubmit" class="space-y-5">
    <!-- OTP inputs -->
    <div class="flex justify-center gap-2.5" @paste.prevent="onPaste">
      <input
        v-for="(_, index) in 6"
        :key="index"
        ref="otpInputs"
        type="text"
        inputmode="numeric"
        maxlength="1"
        :value="otp?.[index] || ''"
        @input="onInput($event, index)"
        @keydown="onKeydown($event, index)"
        :class="[
          'w-11 h-12 text-center text-lg font-bold rounded-xl border outline-none transition-all duration-200 bg-white',
          otp?.[index] ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/25'
        ]"
      />
    </div>

    <p v-if="errorMessage" class="text-red-500 text-xs text-center flex items-center justify-center gap-1">
      <Icon icon="mdi:alert-circle-outline" />{{ errorMessage }}
    </p>

    <button
      type="submit"
      :disabled="isDisabled"
      class="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
    >
      <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin text-lg" />
      {{ isLoading ? 'Memverifikasi...' : 'Verifikasi Email' }}
    </button>
  </form>
</template>
