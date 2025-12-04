<script setup lang="ts">
import { Image } from '@unpic/vue'
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue'

const isLogin=false;

const route=useRoute()
</script>

<template>
  <header class="w-full fixed top-0 left-0 bg-primary py-2 flex justify-between items-center px-[8%] z-50">
    <RouterLink to="/" class="flex gap-2 items-center">
        <Image src="/images/core/logo.png" alt="logo-reduka" class="w-10 h-auto" />
        <h1 class="font-semibold text-primary-foreground text-xl">REDUKA</h1>
    </RouterLink>
    <nav>
        <div v-if="!route.path.includes('auth') && !isLogin" class="flex gap-2 items-center">
            <RouterLink to="/auth/login" class="px-4 py-2 rounded-sm text-primary-foreground font-semibold bg-[#1B6644] hover:bg-[#1B6644]/80 transition-all duration-200">
                Login
            </RouterLink>
            <RouterLink to="/auth/register" class="px-4 py-2 rounded-sm font-semibold text-primary-foreground ring ring-primary-foreground hover:bg-white/5 transition-all duration-200">
                Register
            </RouterLink>
        </div>
        <RouterLink v-if="route.path.includes('auth')" to="/">
            <Icon icon="majesticons:home"  width="40" class="text-white hover:scale-105 transition-all duration-200" />
        </RouterLink>
    </nav>
  </header>
</template>