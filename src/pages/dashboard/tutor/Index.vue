<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useTool } from '../../../stores/tool'
import DashboardLayout from '../../../components/layout/DashboardLayout.vue'

const route = useRoute()

const isTutorRoot = computed(() => route.path === '/dashboard/tutor')

const tool=useTool()

</script>

<template>
  <DashboardLayout>
    hallo
  </DashboardLayout>
</template>
