<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useTool } from '../../stores/tool'

const { path }=defineProps<{ path:string }>()

const route = useRoute()

const isActive = computed(() => route.path === path)

const tool=useTool()

</script>

<template>
  <div :class="['h-screen overflow-auto transition-all duration-500', path==='/dashboard/admin'?tool.isSidebarOpen?'pl-64':'pl-20':'']">
    <template v-if="isActive">
       <slot />
    </template>

    <template v-else>
      <RouterView />
    </template>
  </div>
</template>
