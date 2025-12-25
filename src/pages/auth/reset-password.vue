<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
import { ForgotPassword } from '../../schemas/auth';


const form=useForm({
  validationSchema:toTypedSchema(ForgotPassword)
})

const { value: email, errorMessage: emailError } = useField("email");

const onSubmit = form.handleSubmit((values) => {
  console.log("sending berhasil:", values);
});

const isDisabled = computed(() => {
  return !form.meta.value.valid || form.isSubmitting.value;
});

</script>

<template>
  <div class="flex flex-col h-screen justify-center items-end 2xl:items-center px-4 md:pr-10">
      <div class="space-y-4 py-4 w-full max-w-md xl:max-w-lg backdrop-blur-md rounded-md border-secondary border p-4">
        <div class="space-y-2">
            <h1 class="text-center text-xl md:text-2xl xl:text-3xl font-semibold">
              Reset <span class="italic px-4 py-1 bg-primary/90 rounded text-white">Password</span>
            </h1>

            <p class="text-center text-sm text-muted-foreground">
              Masukkan email yang terdaftar, kami akan mengirimkan instruksi reset password.
            </p>
        </div>


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
          <div class="flex items-center justify-between">
            <RouterLink to="/auth/login" class="px-4 font-semibold flex justify-center gap-1 items-center py-1.5 bg-primary/10 text-primary hover:bg-primary/30 border border-primary/30 rounded">
              <Icon icon="lucide-chevron-left" />
              Back
            </RouterLink>
            <button
                type="submit"
                :disabled="isDisabled"
                class="w-fit block ml-auto px-6 cursor-pointer py-1.5 font-semibold disabled:cursor-not-allowed text-white rounded bg-primary hover:bg-primary/80 transition-all duration-200"
            >
                Reset
            </button>
          </div>
        </form>
      </div>
  </div>
</template>