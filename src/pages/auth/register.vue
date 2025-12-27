<script setup lang="ts">
import RegisterForm from '../../components/auth/RegisterForm.vue'
</script>

<template>
  <div class="w-full flex h-screen justify-center lg:justify-end 2xl:justify-center items-center md:px-8 sm:px-6 px-4 md:pt-10">
    <div class="space-y-6 w-full backdrop-blur-sm max-w-md md:p-0 p-4 rounded-md border-2 md:border-primary/80 bg-primary/20 md:bg-transparent md:border-0">
      <h1 class="text-center text-xl md:text-2xl xl:text-3xl font-semibold">
        Selamat
        <span class="italic px-4 py-2 bg-primary/90 rounded text-white font-semibold">
          Datang!
        </span>
      </h1>

      <RegisterForm />
    </div>
  </div>
</template>
