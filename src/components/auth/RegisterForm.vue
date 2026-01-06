<script setup lang="ts">
import { useForm, useField } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { RegisterSchema } from "../../schemas/auth"
import { Icon } from "@iconify/vue"
import LoginGoogle from "../../components/ui/LoginGoogle.vue"
import { computed, reactive } from "vue"
import { AuthService } from "../../services/auth"
import { useApi } from "../../composable/useApi"
import { useRouter } from "vue-router"
import { toast } from "vue3-toastify"

const router = useRouter()

const form = useForm({
  validationSchema: toTypedSchema(RegisterSchema),
})

const { value: username, errorMessage: usernameError } = useField("username")
const { value: email, errorMessage: emailError } = useField("email")
const { value: password, errorMessage: passwordError } = useField("password")
const { value: confirmPassword, errorMessage: confirmPasswordError } =
  useField("confirmPassword")
const { value: acceptPolicy, errorMessage: acceptPolicyError } =
  useField("acceptPolicy")

const { call, isLoading, error, message } =
  useApi(AuthService.register)

const onSubmit = form.handleSubmit(async (values) => {
  await call({
    email: values.email,
    password: values.password,
    username: values.username,
  })

  if (error.value) {
    toast(error.value, { type: "error" })
    return
  }

  toast(message.value || "Registrasi berhasil", {
    type: "success",
  })

  router.push("/auth/verify-email?email=" + values.email)
})

const isDisabled = computed(() => {
  return !form.meta.value.valid || isLoading.value
})

const showPassword = reactive({
  password: false,
  confirmPassword: false,
})

const togglePassword = (type: "password" | "confirmPassword") => {
  showPassword[type] = !showPassword[type]
}
</script>

<template>
    <form @submit="onSubmit" class="space-y-2">
        <div class="space-y-1">
          <div class="relative">
            <input v-model="username" type="text" placeholder="Username" class="w-full border pl-10 pr-4 py-2 text-xs rounded bg-[#D2D4C8] text-foreground outline-none focus:ring-2 focus:ring-primary peer" />
            <Icon icon="lucide:user" class="absolute top-1/2 left-2 -translate-y-1/2 text-primary h-6 w-6 opacity-70 peer-focus:opacity-100" />
          </div>
          <p v-if="usernameError" class="text-red-600 text-[10px]">{{ usernameError }}</p>
        </div>

        <div class="space-y-1">
          <div class="relative">
            <input v-model="email" type="email" placeholder="Email" class="w-full border pl-10 pr-4 py-2 text-xs rounded bg-[#D2D4C8] text-foreground outline-none focus:ring-2 focus:ring-primary peer" />
            <Icon icon="lucide:mail" class="absolute top-1/2 left-2 -translate-y-1/2 text-primary h-6 w-6 opacity-70 peer-focus:opacity-100" />
          </div>
          <p v-if="emailError" class="text-red-600 text-[10px]">{{ emailError }}</p>
        </div>

        <div class="space-y-1">
          <div class="relative">
            <input v-model="password" :type="showPassword.password ? 'text' : 'password'" placeholder="Password" class="w-full border pl-10 pr-10 py-2 text-xs rounded outline-none bg-[#D2D4C8] text-foreground focus:ring-2 focus:ring-primary peer" />
            <Icon icon="lucide:lock" class="absolute top-1/2 left-2 -translate-y-1/2 text-primary h-6 w-6 opacity-70 peer-focus:opacity-100" />
            <button type="button" @click="togglePassword('password')" class="absolute top-1/2 right-2 -translate-y-1/2 text-gray-600 hover:text-primary">
              <Icon :icon="showPassword.password ? 'lucide:eye-off' : 'lucide:eye'" class="h-5 w-5" />
            </button>
          </div>
          <p v-if="passwordError" class="text-red-600 text-[10px]">{{ passwordError }}</p>
        </div>

        <div class="space-y-1">
          <div class="relative">
            <input v-model="confirmPassword" :type="showPassword.confirmPassword ? 'text' : 'password'" placeholder="Konfirmasi Password" class="w-full border pl-10 pr-10 py-2 text-xs rounded outline-none bg-[#D2D4C8] text-foreground focus:ring-2 focus:ring-primary peer" />
            <Icon icon="lucide:shield-check" class="absolute top-1/2 left-2 -translate-y-1/2 text-primary h-6 w-6 opacity-70 peer-focus:opacity-100" />
            <button type="button" @click="togglePassword('confirmPassword')" class="absolute top-1/2 right-2 -translate-y-1/2 text-gray-600 hover:text-primary">
              <Icon :icon="showPassword.confirmPassword ? 'lucide:eye-off' : 'lucide:eye'" class="h-5 w-5" />
            </button>
          </div>
          <p v-if="confirmPasswordError" class="text-red-600 text-[10px]">{{ confirmPasswordError }}</p>
        </div>

        <div class="flex items-center gap-2 text-xs px-1">
          <input id="accept" v-model="acceptPolicy" type="checkbox" class="size-4 bg-[#D2D4C8]" />
          <label for="accept" class="text-xs">Menyetujui syarat & ketentuan</label>
        </div>
        <p v-if="acceptPolicyError" class="text-red-600 text-[10px] px-1">{{ acceptPolicyError }}</p>

        <button type="submit" :disabled="isDisabled" :class="['w-full flex items-center px-4 cursor-pointer py-2 font-semibold text-white rounded-md bg-primary hover:bg-primary/80 transition-all duration-200', isLoading ? 'justify-between' : 'justify-center']">
          <Icon v-if="isLoading" icon="lucide-refresh-ccw" class="animate-spin opacity-80" />
          Daftar
          <Icon v-if="isLoading" icon="lucide-refresh-ccw" class="animate-spin opacity-80" />
        </button>

        <div class="flex items-center gap-1">
          <div class="flex-1 h-0.5 rounded-full bg-gray-300" />
          <p class="text-xs text-gray-500">Or</p>
          <div class="flex-1 h-0.5 rounded-full bg-gray-300" />
        </div>

        <LoginGoogle message="Daftar dengan Google" />
        <p class="text-sm text-center md:text-black text-white">Have an account? <RouterLink to="/auth/login" class="text-blue-700 hover:text-blue-900">login</RouterLink></p>
    </form> 
</template>