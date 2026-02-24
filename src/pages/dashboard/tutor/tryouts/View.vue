<script setup lang="ts">
import { useRoute } from 'vue-router';
import CardCountSubtest from '../../../../components/dashboard/tutor/tryouts/CardCountSubtest.vue';
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue';

const route=useRoute()

</script>

<template>
  <DashboardLayout class="px-4 space-y-2">
      <div>
        Grafik view
      </div> 
      
      <div class="h-1 w-full block bg-gray-200 rounded-full shadow-sm" />
      <CardCountSubtest :tryout-id="Number(route.params.id)" />
      <div class="h-1 w-full block bg-gray-200 rounded-full shadow-sm" />
      <h2>All Question</h2>
  </DashboardLayout>
</template>