<script setup lang="ts">
import { ref } from 'vue';
import OtpForm from '../../components/auth/OtpForm.vue';
import ResendForm from '../../components/auth/ResendForm.vue';


const showResendForm=ref(false)

</script>


<template>
  <div class="w-full h-screen flex flex-col items-center lg:items-end xl:items-center justify-center px-6 text-center">
    <div class="max-w-md w-full space-y-6">
      <div class="space-y-3">
        <h1 class="text-2xl font-semibold font-heading">
          Verify Your Email
        </h1>
        <p class="text-gray-600 text-sm font-ubuntu">
          Enter the 6-digit verification code sent to your email.
        </p>
      </div>

      <OtpForm v-if="!showResendForm" />
      <ResendForm v-if="showResendForm" v-model="showResendForm" />

      <button @click="showResendForm=!showResendForm" class="text-sm ml-auto text-primary/70 w-fit block px-4 py-2 rounded bg-primary/20 border border-primary/80 cursor-pointer hover:bg-primary/80 hover:text-white transition-all duration-100">
        {{ showResendForm ? 'Back':'Resend' }}
      </button>
    </div>
  </div>
</template>
