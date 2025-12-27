<script setup lang="ts">
import LoginForm from '../../components/auth/LoginForm.vue';

</script>



<template>
  <div class="w-full h-screen flex justify-center lg:justify-end 2xl:justify-center items-center md:px-8 sm:px-6 px-4 md:pt-0">
    <div class="space-y-8 py-4 w-full max-w-md">
      <h1 class="text-center text-2xl md:text-3xl font-semibold">
        Selamat <span class="italic px-4 py-2 bg-primary/90 rounded text-white font-semibold">Kembali!</span>
      </h1>
      <LoginForm />
    </div>
  </div>
</template>
