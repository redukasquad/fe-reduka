<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Image } from "@unpic/vue";
</script>

<template>
  <div class="w-full flex flex-col justify-between relative">
    <Image src="/images/core/maskot.png" class="md:w-96 w-64 absolute bottom-16 md:left-1/6 left-[35%] z-20" />
    <div class="w-full h-full z-30">
        <RouterView />
    </div>
    <div class="w-fit absolute bottom-0 left-0">
      <Image src="/images/auth/auth_bg.png" class="h-48 w-auto" />

      <div class="absolute top-1/2 -translate-y-1/4 left-4 space-y-3">
        <RouterLink to="/" class="flex items-center gap-4">
          <Icon icon="lucide:instagram" class="text-white w-6 h-6" />
          <p to="/instagram" class="text-white text-sm hover:underline hover:text-gray-100 transition-all duration-200">
            @RedukaInstagram
          </p>
        </RouterLink>

        <RouterLink to="/" class="flex items-center gap-4">
          <Icon icon="lucide:mail" class="text-white w-6 h-6" />
          <p to="/email" class="text-white text-sm hover:underline hover:text-gray-100 transition-all duration-200">
            @RedukaEmail
          </p>
        </RouterLink>

        <RouterLink to="/" class="flex items-center gap-4">
          <Icon icon="lucide:message-circle" class="text-white w-6 h-6" />
          <p to="/whatsapp" class="text-white text-sm hover:underline hover:text-gray-100 transition-all duration-200">
            @RedukaWhatsapp
          </p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
