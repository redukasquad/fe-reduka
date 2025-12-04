<script setup lang="ts">
import { useForm, useField } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { RegisterSchema } from "../../schemas/auth.schema"
import { Icon } from "@iconify/vue"
import LoginGoogle from "../../components/ui/LoginGoogle.vue"

const form = useForm({
  validationSchema: toTypedSchema(RegisterSchema),
})

const { value: username, errorMessage: usernameError } = useField("username")
const { value: email, errorMessage: emailError } = useField("email")
const { value: password, errorMessage: passwordError } = useField("password")
const { value: confirmPassword, errorMessage: confirmPasswordError } = useField("confirmPassword")
const { value: acceptPolicy, errorMessage: acceptPolicyError } = useField("acceptPolicy")

const onSubmit = form.handleSubmit(values => {
  console.log("Register berhasil:", values)
})
</script>

<template>
  <div class="w-full h-full flex justify-center lg:justify-end items-center md:px-8 sm:px-6 px-4 pt-28">
    <div class="space-y-6 w-full max-w-md">
      <h1 class="text-center text-2xl md:text-3xl font-semibold">
        Daftar <span class="italic px-4 py-2 bg-primary/90 rounded text-white font-semibold">Akun Baru</span>
      </h1>

      <form @submit="onSubmit" class="space-y-2">

        <div class="space-y-1">
          <div class="relative">
            <input
              v-model="username"
              type="text"
              placeholder="Username"
              class="w-full border pl-10 pr-4 py-2 text-xs rounded bg-[#D2D4C8] text-foreground outline-none focus:ring-2 focus:ring-primary peer"
            />
            <Icon icon="lucide:user" class="absolute top-1/2 left-2 -translate-y-1/2 text-primary h-6 w-6 opacity-70 peer-focus:opacity-100" />
          </div>
          <p v-if="usernameError" class="text-red-600 text-xs">{{ usernameError }}</p>
        </div>

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
          <p v-if="emailError" class="text-red-600 text-xs">{{ emailError }}</p>
        </div>

        <div class="space-y-1">
          <div class="relative">
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="w-full border pl-10 pr-4 py-2 text-xs rounded outline-none bg-[#D2D4C8] text-foreground focus:ring-2 focus:ring-primary peer"
            />
            <Icon icon="lucide:lock" class="absolute top-1/2 left-2 -translate-y-1/2 text-primary h-6 w-6 opacity-70 peer-focus:opacity-100" />
          </div>
          <p v-if="passwordError" class="text-red-600 text-xs">{{ passwordError }}</p>
        </div>

        <div class="space-y-1">
          <div class="relative">
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Konfirmasi Password"
              class="w-full border pl-10 pr-4 py-2 text-xs rounded outline-none bg-[#D2D4C8] text-foreground focus:ring-2 focus:ring-primary peer"
            />
            <Icon icon="lucide:shield-check" class="absolute top-1/2 left-2 -translate-y-1/2 text-primary h-6 w-6 opacity-70 peer-focus:opacity-100" />
          </div>
          <p v-if="confirmPasswordError" class="text-red-600 text-xs">{{ confirmPasswordError }}</p>
        </div>

        <div class="flex items-center gap-2 text-xs px-1">
          <input v-model="acceptPolicy" type="checkbox" class="size-4 bg-[#D2D4C8]" />
          <p>Menyetujui syarat & ketentuan</p>
        </div>
        <p v-if="acceptPolicyError" class="text-red-600 text-xs px-1">{{ acceptPolicyError }}</p>

        <button
          type="submit"
          class="w-full cursor-pointer py-2 text-white rounded-md bg-primary hover:bg-primary/80 transition-all duration-200"
        >
          Daftar
        </button>

        <div class="flex items-center gap-1">
          <div class="flex-1 h-0.5 rounded-full bg-gray-300" />
          <p class="text-xs text-gray-500">Or</p>
          <div class="flex-1 h-0.5 rounded-full bg-gray-300" />
        </div>

        <LoginGoogle message="Daftar dengan Google" />
      </form>
    </div>
  </div>
</template>
