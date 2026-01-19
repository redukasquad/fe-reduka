<script setup lang="ts">
import { Icon } from '@iconify/vue';
import Form from '../../../../components/dashboard/admin/programs/Form.vue'
import { UpdateProgramSchema } from '../../../../schemas/programs';
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue';
</script>

<template>
  <DashboardLayout class-name="w-full py-8 backdrop-blur-sm px-6 relative">
    <RouterLink 
        to="/dashboard/admin/programs"
        class="group inline-flex items-center gap-2 rounded-lg px-3 py-2
                text-gray-600 hover:text-primary
                hover:bg-primary/10
                transition-all duration-200 absolute left-4 top-6"
        >
        <Icon
            icon="heroicons:chevron-left"
            class="text-xl transition-transform duration-200 group-hover:-translate-x-0.5"
        />
        <span class="text-sm font-medium hidden sm:inline">
            Back
        </span>
    </RouterLink>
    <h1 class="text-3xl font-bold text-center mb-4 text-primary">Update Program</h1>
    <Form :schema="UpdateProgramSchema" />
  </DashboardLayout>
</template>