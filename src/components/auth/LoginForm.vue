<script setup lang="ts">
import { useForm, useField } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { LoginSchema } from "../../schemas/auth"
import { Icon } from "@iconify/vue"
import { computed, ref } from "vue"
import { useApi } from "../../composable/useApi"
import { AuthService } from "../../services/auth"
import { toast } from "vue3-toastify"
import { useAuth } from "../../stores/auth"
import { useRouter } from "vue-router"

const router = useRouter()
const auth = useAuth()

const form = useForm({ validationSchema: toTypedSchema(LoginSchema) })
const { value: email, errorMessage: emailError } = useField("email")
const { value: password, errorMessage: passwordError } = useField("password")
const showPassword = ref(false)

const { call, isLoading, data, error, message } = useApi(AuthService.login)

const onSubmit = form.handleSubmit(async (values) => {
  await call(values)
  if (data.value?.token) {
    auth.setToken(data.value.token)
    toast(message.value || "Login berhasil", { type: "success" })
    router.push("/courses")
  }
  if (error.value) {
    toast(message.value, { type: "error" })
    if (message.value.includes('veri')) router.push('/auth/verify-email?email=' + values.email)
  }
})

const isDisabled = computed(() => !form.meta.value.valid || isLoading.value)
</script>

<template>
  <form @submit="onSubmit" class="space-y-4">
    <!-- Email -->
    <div class="space-y-1.5">
      <label class="text-sm font-medium text-gray-700">Email</label>
      <div class="relative">
        <Icon icon="mdi:email-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input
          v-model="email"
          type="email"
          placeholder="nama@email.com"
          :class="['w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 bg-white', emailError ? 'border-red-300 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-primary/25 focus:border-primary/50']"
        />
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
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          :class="['w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 bg-white', passwordError ? 'border-red-300 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-primary/25 focus:border-primary/50']"
        />
        <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
          <Icon :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="text-lg" />
        </button>
      </div>
      <p v-if="passwordError" class="text-red-500 text-xs flex items-center gap-1">
        <Icon icon="mdi:alert-circle-outline" class="text-sm" />{{ passwordError }}
      </p>
    </div>

    <!-- Remember + Forgot -->
    <div class="flex items-center justify-between">
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-primary accent-primary" />
        <span class="text-sm text-gray-600">Ingat saya</span>
      </label>
      <RouterLink to="/auth/reset-password" class="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
        Lupa password?
      </RouterLink>
    </div>

    <!-- Submit -->
    <button
      type="submit"
      :disabled="isDisabled"
      class="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
    >
      <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin text-lg" />
      {{ isLoading ? 'Masuk...' : 'Masuk' }}
    </button>

    <!-- Divider -->
    <div class="flex items-center gap-3">
      <div class="flex-1 h-px bg-gray-200" />
      <span class="text-xs text-gray-400">atau</span>
      <div class="flex-1 h-px bg-gray-200" />
    </div>

    <!-- Register link -->
    <p class="text-sm text-center text-gray-600">
      Belum punya akun?
      <RouterLink to="/auth/register" class="text-primary font-semibold hover:text-primary/80 transition-colors">
        Daftar sekarang
      </RouterLink>
    </p>
  </form>
</template>
