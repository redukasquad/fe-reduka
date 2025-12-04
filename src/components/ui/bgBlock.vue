<script setup lang="ts">
const blocks = Array.from({ length: 250 });
</script>

<template>
  <div class="absolute top-0 left-0 w-full h-full grid grid-cols-20 rotate-6">
    <div
      v-for="(_, i) in blocks"
      :key="i"
      class="border border-primary/10"
    />
  </div>
</template>
