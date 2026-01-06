<script setup lang="ts">
import { useForm, useField } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { computed, ref } from "vue"
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

const { call, isLoading, error, message } =
  useApi(AuthService.verifyOtp)

const onInput = (e: Event, index: number) => {
  const value = (e.target as HTMLInputElement).value.replace(/\D/g, "")
  if (!value) return

  const otpArray = (otp.value || "").split("")
  if(otpArray.length){
     otpArray[index] = value[value.length - 1] ||  ''
    otp.value = otpArray.join("")
  }

  if (index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

const onKeydown = (e: KeyboardEvent, index: number) => {
  if (e.key === "Backspace") {
    const otpArray = (otp.value || "").split("")
    otpArray[index] = ""
    otp.value = otpArray.join("")

    if (index > 0) {
      otpInputs.value[index - 1]?.focus()
    }
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
    toast(message.value || "Email berhasil diverifikasi", {
      type: "success",
    })
    router.push("/auth/login")
  }

  if (error.value) {
    toast(message.value || "OTP tidak valid", {
      type: "error",
    })
  }
})

const isDisabled = computed(() => {
  return !form.meta.value.valid || isLoading.value
})

</script>

<template>
    <form @submit="onSubmit" class="space-y-4">
        <div
          class="flex justify-between gap-2"
          @paste.prevent="onPaste"
        >
          <input
            v-for="(_, index) in 6"
            :key="index"
            ref="otpInputs"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="w-12 h-12 text-center text-lg font-semibold border rounded bg-[#D2D4C8] outline-none focus:ring-2 focus:ring-primary"
            :value="otp?.[index] || ''"
            @input="onInput($event, index)"
            @keydown="onKeydown($event, index)"
          />
        </div>

        <p v-if="errorMessage" class="text-red-600 text-[11px]">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="isDisabled"
          class="w-full py-2 cursor-pointer active:scale-95 rounded-md font-semibold text-white bg-primary hover:bg-primary/80 transition-all"
        >
          {{ isLoading ? "Verifying..." : "Verify Email" }}
        </button>
    </form> 
</template>