<script setup lang="ts">
import { useForm, useField } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { RegisterSchema } from "../../schemas/auth"
import { Icon } from "@iconify/vue"
import { computed, reactive } from "vue"
import { AuthService } from "../../services/auth"
import { useApi } from "../../composable/useApi"
import { useRouter } from "vue-router"
import { toast } from "vue3-toastify"

const router = useRouter()
const form = useForm({ validationSchema: toTypedSchema(RegisterSchema) })

const { value: username, errorMessage: usernameError } = useField("username")
const { value: email, errorMessage: emailError } = useField("email")
const { value: password, errorMessage: passwordError } = useField("password")
const { value: confirmPassword, errorMessage: confirmPasswordError } = useField("confirmPassword")
const { value: acceptPolicy, errorMessage: acceptPolicyError } = useField("acceptPolicy")

const { call, isLoading, error, message } = useApi(AuthService.register)

const onSubmit = form.handleSubmit(async (values) => {
  await call({ email: values.email, password: values.password, username: values.username })
  if (error.value) { toast(message.value, { type: "error" }); return }
  toast(message.value || "Registrasi berhasil", { type: "success" })
  router.push("/auth/verify-email?email=" + values.email)
})

const isDisabled = computed(() => !form.meta.value.valid || isLoading.value)
const show = reactive({ password: false, confirmPassword: false })

const inputClass = (hasError: string | undefined) =>
  `w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 bg-white ${hasError ? 'border-red-300 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-primary/25 focus:border-primary/50'}`
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <!-- Username -->
    <div class="space-y-1.5">
      <label class="text-sm font-medium text-gray-700">Username</label>
      <div class="relative">
        <Icon icon="mdi:account-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input v-model="username" type="text" placeholder="username kamu" :class="inputClass(usernameError)" />
      </div>
      <p v-if="usernameError" class="text-red-500 text-xs flex items-center gap-1">
        <Icon icon="mdi:alert-circle-outline" class="text-sm" />{{ usernameError }}
      </p>
    </div>

    <!-- Email -->
    <div class="space-y-1.5">
      <label class="text-sm font-medium text-gray-700">Email</label>
      <div class="relative">
        <Icon icon="mdi:email-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input v-model="email" type="email" placeholder="nama@email.com" :class="inputClass(emailError)" />
      </div>
      <p v-if="emailError" class="text-red-500 text-xs flex items-center gap-1">
        <Icon icon="mdi:alert-circle-outline" class="text-sm" />{{ emailError }}
      </p>
    </div>

    <!-- Password -->
    <div class="space-y-1.5">
      <label class="text-sm font-medium text-gray-700">Password</label>
      <div class="relative">
        <Icon icon="mdi:lock-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input v-model="password" :type="show.password ? 'text' : 'password'" placeholder="••••••••" :class="inputClass(passwordError)" />
        <button type="button" @click="show.password = !show.password" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
          <Icon :icon="show.password ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="text-lg" />
        </button>
      </div>
      <p v-if="passwordError" class="text-red-500 text-xs flex items-center gap-1">
        <Icon icon="mdi:alert-circle-outline" class="text-sm" />{{ passwordError }}
      </p>
    </div>

    <!-- Confirm Password -->
    <div class="space-y-1.5">
      <label class="text-sm font-medium text-gray-700">Konfirmasi Password</label>
      <div class="relative">
        <Icon icon="mdi:shield-check-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input v-model="confirmPassword" :type="show.confirmPassword ? 'text' : 'password'" placeholder="••••••••" :class="inputClass(confirmPasswordError)" />
        <button type="button" @click="show.confirmPassword = !show.confirmPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
          <Icon :icon="show.confirmPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="text-lg" />
        </button>
      </div>
      <p v-if="confirmPasswordError" class="text-red-500 text-xs flex items-center gap-1">
        <Icon icon="mdi:alert-circle-outline" class="text-sm" />{{ confirmPasswordError }}
      </p>
    </div>

    <!-- Accept policy -->
    <div class="space-y-1">
      <label class="flex items-start gap-2.5 cursor-pointer">
        <input v-model="acceptPolicy" type="checkbox" class="mt-0.5 w-4 h-4 rounded border-gray-300 accent-primary shrink-0" />
        <span class="text-sm text-gray-600 leading-snug">
          Saya menyetujui
          <RouterLink to="/terms" class="text-primary font-medium hover:underline">syarat & ketentuan</RouterLink>
          dan
          <RouterLink to="/privacy" class="text-primary font-medium hover:underline">kebijakan privasi</RouterLink>
        </span>
      </label>
      <p v-if="acceptPolicyError" class="text-red-500 text-xs flex items-center gap-1 pl-6">
        <Icon icon="mdi:alert-circle-outline" class="text-sm" />{{ acceptPolicyError }}
      </p>
    </div>

    <!-- Submit -->
    <button
      type="submit"
      :disabled="isDisabled"
      class="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
    >
      <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin text-lg" />
      {{ isLoading ? 'Mendaftar...' : 'Buat Akun' }}
    </button>

    <!-- Divider -->
    <div class="flex items-center gap-3">
      <div class="flex-1 h-px bg-gray-200" />
      <span class="text-xs text-gray-400">atau</span>
      <div class="flex-1 h-px bg-gray-200" />
    </div>

    <p class="text-sm text-center text-gray-600">
      Sudah punya akun?
      <RouterLink to="/auth/login" class="text-primary font-semibold hover:text-primary/80 transition-colors">Masuk</RouterLink>
    </p>
  </form>
</template>
