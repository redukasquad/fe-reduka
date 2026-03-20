<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { ForgotPassword } from '../../schemas/auth'

const form = useForm({ validationSchema: toTypedSchema(ForgotPassword) })
const { value: email, errorMessage: emailError } = useField("email")

const onSubmit = form.handleSubmit((values) => {
  console.log("forgot password:", values)
})

const isDisabled = computed(() => !form.meta.value.valid || form.isSubmitting.value)
</script>

<template>
  <div class="space-y-6">
    <div>
      <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon icon="mdi:lock-reset" class="text-primary text-3xl" />
      </div>
      <h1 class="text-2xl font-extrabold text-gray-900">Lupa Password?</h1>
      <p class="text-sm text-gray-500 mt-1.5">
        Masukkan email kamu dan kami akan mengirimkan instruksi reset password.
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
        <Icon v-if="form.isSubmitting.value" icon="mdi:loading" class="animate-spin text-lg" />
        Kirim Instruksi Reset
      </button>

      <RouterLink to="/auth/login" class="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors">
        <Icon icon="mdi:arrow-left" />
        Kembali ke halaman masuk
      </RouterLink>
    </form>
  </div>
</template>
