<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '../../../stores/auth'
import { useRoute, useRouter } from 'vue-router'

const auth = useAuth()
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const token = route.query.token

  if (typeof token === 'string') {
    auth.setToken(token)
    await router.replace('/dashboard/user')
  } else {
    router.replace('/auth/login')
  }
})
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center">
    <p class="text-sm text-gray-500 animate-pulse">
      Redirecting...
    </p>
  </div>
</template>

