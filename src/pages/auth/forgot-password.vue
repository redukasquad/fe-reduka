<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ForgotPassword } from '../../schemas/auth'
import { useApi } from '../../composable/useApi'
import { AuthService } from '../../services/auth'
import { toast } from 'vue3-toastify'

const router = useRouter()
const sent = ref(false)
const sentEmail = ref('')

const form = useForm({ validationSchema: toTypedSchema(ForgotPassword) })
const { value: email, errorMessage: emailError } = useField<string>('email')

const { call, isLoading, error, message } = useApi(AuthService.forgotPassword)

const onSubmit = form.handleSubmit(async (values) => {
  await call(values)
  if (!error.value) {
    sentEmail.value = values.email
    sent.value = true
    toast.success('Kode reset telah dikirim ke email kamu')
  } else {
    toast.error(message.value || 'Gagal mengirim kode reset')
  }
})

const isDisabled = computed(() => !form.meta.value.valid || isLoading.value)

function goToReset() {
  router.push({ name: 'reset-password', query: { email: sentEmail.value } })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Sent state -->
    <template v-if="sent">
      <div class="text-center space-y-3">
        <div class="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto">
          <Icon icon="mdi:email-check-outline" class="text-emerald-500 text-3xl" />
        </div>
        <h1 class="text-2xl font-extrabold text-gray-900">Cek Email Kamu</h1>
        <p class="text-sm text-gray-500 max-w-xs mx-auto">
          Kode reset password telah dikirim ke
          <span class="font-semibold text-gray-700">{{ sentEmail }}</span>.
          Masukkan kode tersebut di halaman berikutnya.
        </p>
      </div>
      <button
        @click="goToReset"
        class="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
      >
        Masukkan Kode Reset
        <Icon icon="mdi:arrow-right" />
      </button>
      <button
        @click="sent = false"
        class="w-full text-sm text-center text-gray-500 hover:text-primary transition-colors"
      >
        Kirim ulang ke email lain
      </button>
    </template>

    <!-- Form state -->
    <template v-else>
      <div>
        <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Icon icon="mdi:lock-reset" class="text-primary text-3xl" />
        </div>
        <h1 class="text-2xl font-extrabold text-gray-900">Lupa Password?</h1>
        <p class="text-sm text-gray-500 mt-1.5">
          Masukkan email kamu dan kami akan mengirimkan kode reset password.
        </p>
      </div>

      <form @submit="onSubmit" class="space-y-4">
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

        <button
          type="submit"
          :disabled="isDisabled"
          class="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
        >
          <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin text-lg" />
          {{ isLoading ? 'Mengirim...' : 'Kirim Kode Reset' }}
        </button>

        <RouterLink to="/auth/login" class="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors">
          <Icon icon="mdi:arrow-left" />
          Kembali ke halaman masuk
        </RouterLink>
      </form>
    </template>
  </div>
</template>
