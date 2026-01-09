<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useTool } from '../../../stores/tool'

const route = useRoute()

const isUserRoot = computed(() => route.path === '/dashboard/user')

const tool=useTool()

</script>

<template>
  <div :class="['h-screen overflow-auto',]">
    <template v-if="isUserRoot">
      <div class="text-8xl">hallo</div>
    </template>

    <template v-else>
      <RouterView />
    </template>
  </div>
</template>
