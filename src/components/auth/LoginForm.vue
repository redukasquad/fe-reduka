<script setup lang="ts">
import { useForm, useField } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { LoginSchema } from "../../schemas/auth"
import { Icon } from "@iconify/vue"
import LoginGoogle from "../../components/ui/LoginGoogle.vue"
import { computed } from "vue"
import { useApi } from "../../composable/useApi"
import { AuthService } from "../../services/auth"
import { toast } from "vue3-toastify"
import { useAuth } from "../../stores/auth"
import { useRouter } from "vue-router"

const router = useRouter()
const auth = useAuth()

const form = useForm({
  validationSchema: toTypedSchema(LoginSchema),
})

const { value: email, errorMessage: emailError } = useField("email")
const { value: password, errorMessage: passwordError } = useField("password")

const { call, isLoading, data, error, message } =
  useApi(AuthService.login)

const onSubmit = form.handleSubmit(async (values) => {
  await call(values)

  if (data.value?.token) {
    auth.setToken(data.value.token)

    toast(message.value || "Login berhasil", {
      type: "success",
    })

    router.push("/courses")
  }

  if (error.value) {
    toast(message.value, {
      type: "error",
    })

    if(message.value.includes('veri')){
        router.push('/auth/verify-email?email='+values.email)
    }
  }
})

const isDisabled = computed(() => {
  return !form.meta.value.valid || isLoading.value
})
</script>

<template>
    <form @submit="onSubmit" class="space-y-2">
        <div class="space-y-1">
            <div class="relative">
                <input
                    v-model="email"
                    type="email"
                    placeholder="Email"
                    class="w-full border pl-10 pr-4 py-2 text-xs rounded bg-[#D2D4C8] text-foreground outline-none focus:ring-2 focus:ring-primary peer"
                />
                <Icon icon="lucide:mail" class="absolute top-1/2 left-2 -translate-y-1/2 text-primary h-6 w-6 opacity-70 peer-focus:opacity-100" />
            </div>
            <p v-if="emailError" class="text-red-600 text-[10px]">{{ emailError }}</p>
        </div>

        <div class="space-y-1">
            <div class="relative">
                <input
                    v-model="password"
                    type="password"
                    placeholder="Password"
                    class="w-full border pl-10 pr-4 py-2 text-xs rounded outline-none  bg-[#D2D4C8] text-foreground focus:ring-2 focus:ring-primary peer"
                />
                <Icon icon="lucide:lock" class="absolute top-1/2 left-2 -translate-y-1/2 text-primary h-6 w-6 opacity-70 peer-focus:opacity-100" />
            </div>
            <p v-if="passwordError" class="text-red-600 text-[10px]">{{ passwordError }}</p>
        </div>

        <div class="flex justify-between items-center px-2">
            <div class="flex items-center gap-2 text-xs">
                <input id="remember" type="checkbox" class="size-4 bg-[#D2D4C8]" />
                <label class="text-xs" for="remember">Ingat sandi</label>
            </div>
            <RouterLink to="/auth/reset-password" class="text-gray-700 text-xs hover:text-gray-800 transition-all duration-200">Lupa Password?</RouterLink>
        </div>
        <button
            type="submit"
            :disabled="isDisabled"
            :class="['w-full flex items-center px-4 cursor-pointer py-2 font-semibold text-white rounded-md bg-primary hover:bg-primary/80 transition-all duration-200', isLoading?'justify-between':'justify-center']"
        >
            <Icon v-if="isLoading" icon="lucide-refresh-ccw" class="animate-spin opacity-80" />
            Masuk
            <Icon v-if="isLoading" icon="lucide-refresh-ccw" class="animate-spin opacity-80" />
        </button>
        <div class="flex items-center gap-1">
            <div class="flex-1 h-0.5 rounded-full bg-gray-300" />
            <p class="text-xs text-gray-500">Or</p>
            <div class="flex-1 h-0.5 rounded-full bg-gray-300" />
        </div>
        <LoginGoogle message="Login dengan Google" />
        <p class="text-sm">Don't have an account? <RouterLink to="/auth/register" class="text-blue-700 hover:text-blue-900">register</RouterLink></p>
    </form>  
</template>