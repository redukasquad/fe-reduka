<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { LoginSchema } from "../../schemas/auth";
import { Icon } from "@iconify/vue";
import LoginGoogle from "../../components/ui/LoginGoogle.vue";
import { computed, watch } from "vue";
import { useApi } from "../../composable/useApi";
import { AuthService } from "../../services/auth";


const form = useForm({
  validationSchema: toTypedSchema(LoginSchema),
});

const { value: email, errorMessage: emailError } = useField("email");
const { value: password, errorMessage: passwordError } = useField("password");

const { call, isLoading, data }=useApi(AuthService.login)

const onSubmit = form.handleSubmit((values) => {
  call({
    ...values
  })
});

const isDisabled = computed(() => {
  return !form.meta.value.valid || form.isSubmitting.value;
});


watch(data, (newval)=>{
  console.log(newval)
})
</script>

<template>
  <div class="w-full h-screen flex justify-center lg:justify-end 2xl:justify-center items-center md:px-8 sm:px-6 px-4 md:pt-0">
    <div class="space-y-8 py-4 w-full max-w-md">
      <h1 class="text-center text-2xl md:text-3xl font-semibold">
        Selamat <span class="italic px-4 py-2 bg-primary/90 rounded text-white font-semibold">Kembali!</span>
      </h1>

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
            class="w-full cursor-pointer py-2 disabled:cursor-not-allowed text-white rounded-md bg-primary hover:bg-primary/80 transition-all duration-200"
        >
            Masuk
        </button>
        <div class="flex items-center gap-1">
            <div class="flex-1 h-0.5 rounded-full bg-gray-300" />
            <p class="text-xs text-gray-500">Or</p>
            <div class="flex-1 h-0.5 rounded-full bg-gray-300" />
        </div>
        <LoginGoogle message="Login dengan Google" />
      </form>
    </div>
  </div>
</template>
