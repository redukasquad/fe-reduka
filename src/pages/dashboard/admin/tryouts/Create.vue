<script setup lang="ts">
import { Icon } from '@iconify/vue';
import Form from '../../../../components/dashboard/admin/tryouts/FormTryout.vue';
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue';
import { createTryOutInputSchema } from '../../../../schemas/tryout';

</script>

<template>
  <DashboardLayout class="pb-2 pt-8 backdrop-blur-sm">
    <div class="relative">
        <RouterLink 
            to="/dashboard/admin/tryouts"
            class="group inline-flex items-center gap-2 rounded-lg px-3 py-2
                    text-gray-600 hover:text-primary
                    hover:bg-primary/10
                    transition-all duration-200 absolute left-4 top-0"
            >
            <Icon
                icon="heroicons:chevron-left"
                class="text-xl transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            <span class="text-sm font-medium hidden sm:inline">
                Back
            </span>
        </RouterLink>
        <h1 class="text-3xl font-bold text-center mb-4 text-primary">New Tryout</h1>
        <Form :schema="createTryOutInputSchema" />
    </div>
  </DashboardLayout>
</template>