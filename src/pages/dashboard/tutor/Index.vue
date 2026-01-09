<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useTool } from '../../../stores/tool'

const route = useRoute()

const isTutorRoot = computed(() => route.path === '/dashboard/tutor')

const tool=useTool()

</script>

<template>
  <div :class="['h-screen overflow-auto',]">
    <template v-if="isTutorRoot">
      <div class="text-8xl">hallo</div>
    </template>

    <template v-else>
      <RouterView />
    </template>
  </div>
</template>
