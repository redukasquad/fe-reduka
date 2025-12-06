<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Image } from '@unpic/vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'

const isLogin = false
const showAuthLinks = ref(false)

const onScroll = () => {
  showAuthLinks.value = window.scrollY > 80 // threshold scroll
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

const route = useRoute()
</script>


<template>
  <header class="w-full fixed top-0 left-0 bg-primary py-2 flex justify-between items-center px-[8%] z-50 transition-all duration-300">
    <RouterLink to="/" class="flex gap-2 items-center">
      <Image src="/images/core/logo.png"
             alt="logo-reduka"
             class="w-10 h-auto" />
      <h1 class="font-semibold text-primary-foreground text-xl">REDUKA</h1>
    </RouterLink>

    <nav>
      <div 
        v-if="!isLogin && showAuthLinks" 
        class="flex gap-2 items-center transition-opacity duration-300 opacity-100"
      >
        <RouterLink to="/auth/login" class="px-4 py-2 rounded-sm text-primary-foreground font-semibold bg-[#1B6644] hover:bg-[#1B6644]/80 transition-all duration-200">
          Login
        </RouterLink>
        <RouterLink to="/auth/register" class="px-4 py-2 rounded-sm font-semibold text-primary-foreground ring ring-primary-foreground hover:bg-white/5 transition-all duration-200">
          Register
        </RouterLink>
      </div>
    </nav>
  </header>
</template>
