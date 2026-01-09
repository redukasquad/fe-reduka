<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useTool } from '../../../stores/tool'

const route = useRoute()

const isAdminRoot = computed(() => route.path === '/dashboard/admin')

const tool=useTool()

</script>

<template>
  <div :class="['h-screen overflow-auto transition-all duration-500',tool.isSidebarOpen?'pl-72':'pl-24']">
    <template v-if="isAdminRoot">
      <div class="text-8xl">hallo</div>
    </template>

    <template v-else>
      <RouterView />
    </template>
  </div>
</template>
