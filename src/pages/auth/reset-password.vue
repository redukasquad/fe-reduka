<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'
import { ResetPasswordSchema } from '../../schemas/auth'
import { useApi } from '../../composable/useApi'
import { AuthService } from '../../services/auth'
import { toast } from 'vue3-toastify'

const done = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const form = useForm({
  validationSchema: toTypedSchema(ResetPasswordSchema),
  initialValues: {
    token: '',
    newPassword: '',
    confirmPassword: '',
  },
})

const { value: token, errorMessage: tokenError } = useField<string>('token')
const { value: newPassword, errorMessage: newPasswordError } = useField<string>('newPassword')
const { value: confirmPassword, errorMessage: confirmPasswordError } = useField<string>('confirmPassword')

const { call, isLoading, error, message } = useApi(AuthService.resetPassword)

const onSubmit = form.handleSubmit(async (values) => {
  await call(values)
  if (!error.value) {
    done.value = true
    toast.success('Password berhasil direset')
  } else {
    toast.error(message.value || 'Gagal mereset password')
  }
})

const isDisabled = computed(() => !form.meta.value.valid || isLoading.value)
</script>

<template>
  <div class="space-y-6">
    <!-- Success state -->
    <template v-if="done">
      <div class="text-center space-y-3">
        <div class="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto">
          <Icon icon="mdi:check-circle-outline" class="text-emerald-500 text-3xl" />
        </div>
        <h1 class="text-2xl font-extrabold text-gray-900">Password Berhasil Direset</h1>
        <p class="text-sm text-gray-500 max-w-xs mx-auto">
          Password kamu telah diperbarui. Silakan masuk dengan password baru.
        </p>
      </div>
      <RouterLink
        to="/auth/login"
        class="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
      >
        <Icon icon="mdi:login" />
        Masuk Sekarang
      </RouterLink>
    </template>

    <!-- Form state -->
    <template v-else>
      <div>
        <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Icon icon="mdi:lock-outline" class="text-primary text-3xl" />
        </div>
        <h1 class="text-2xl font-extrabold text-gray-900">Reset Password</h1>
        <p class="text-sm text-gray-500 mt-1.5">
          Masukkan kode yang dikirim ke email kamu dan buat password baru.
        </p>
      </div>

      <form @submit="onSubmit" class="space-y-4">
        <!-- Token -->
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">Kode Reset</label>
          <div class="relative">
            <Icon icon="mdi:key-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              v-model="token"
              type="text"
              placeholder="Masukkan kode dari email"
              :class="['w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 bg-white', tokenError ? 'border-red-300 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-primary/25 focus:border-primary/50']"
            />
          </div>
          <p v-if="tokenError" class="text-red-500 text-xs flex items-center gap-1">
            <Icon icon="mdi:alert-circle-outline" class="text-sm" />{{ tokenError }}
          </p>
        </div>

        <!-- New password -->
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">Password Baru</label>
          <div class="relative">
            <Icon icon="mdi:lock-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              v-model="newPassword"
              :type="showNew ? 'text' : 'password'"
              placeholder="••••••••"
              :class="['w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 bg-white', newPasswordError ? 'border-red-300 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-primary/25 focus:border-primary/50']"
            />
            <button type="button" @click="showNew = !showNew" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              <Icon :icon="showNew ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="text-lg" />
            </button>
          </div>
          <p v-if="newPasswordError" class="text-red-500 text-xs flex items-center gap-1">
            <Icon icon="mdi:alert-circle-outline" class="text-sm" />{{ newPasswordError }}
          </p>
        </div>

        <!-- Confirm password -->
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">Konfirmasi Password</label>
          <div class="relative">
            <Icon icon="mdi:lock-check-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              v-model="confirmPassword"
              :type="showConfirm ? 'text' : 'password'"
              placeholder="••••••••"
              :class="['w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 bg-white', confirmPasswordError ? 'border-red-300 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-primary/25 focus:border-primary/50']"
            />
            <button type="button" @click="showConfirm = !showConfirm" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              <Icon :icon="showConfirm ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="text-lg" />
            </button>
          </div>
          <p v-if="confirmPasswordError" class="text-red-500 text-xs flex items-center gap-1">
            <Icon icon="mdi:alert-circle-outline" class="text-sm" />{{ confirmPasswordError }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="isDisabled"
          class="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
        >
          <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin text-lg" />
          {{ isLoading ? 'Menyimpan...' : 'Simpan Password Baru' }}
        </button>

        <RouterLink to="/auth/forgot-password" class="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors">
          <Icon icon="mdi:arrow-left" />
          Minta kode baru
        </RouterLink>
      </form>
    </template>
  </div>
</template>
