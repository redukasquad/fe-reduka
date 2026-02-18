<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps<{
  id: number | string
}>()
</script>

<template>
  <div class="flex items-center gap-1 text-gray-600">
    <Icon
      icon="mdi:account-group"
      width="14"
      height="14"
      class="text-green-500 text-xs"
    />

    <span>{{ 10 }} registered</span>

    <RouterLink
      :to="`/dashboard/admin/courses/${id}/registrations`"
      class="ml-1 text-green-500 hover:text-yellow-500 transition"
    >
      <Icon icon="mdi:arrow-top-right" width="12" height="12" />
    </RouterLink>
  </div>
</template>
