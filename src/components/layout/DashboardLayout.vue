<script setup lang="ts">
import { useTool } from "../../stores/tool";

const props = defineProps<{
  className?: string;
}>();

const tool = useTool();
</script>

<template>
  <div
    :class="[
      'h-screen overflow-auto transition-all duration-500',
      tool.isSidebarOpen ? 'pl-64' : 'pl-20',
      props.className
    ]"
  >
    <slot />
  </div>
</template>
