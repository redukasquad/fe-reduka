<script setup lang="ts">
import { Icon } from '@iconify/vue';
import Form from '../../../../components/dashboard/admin/courses/Form.vue';
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue';
import { CreateCourseSchema } from '../../../../schemas/course';

</script>

<template>
<DashboardLayout class-name="w-full py-8 bg-whie/5-sm px-6">
    <div class="relative">
        <RouterLink 
            to="/dashboard/admin/courses"
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
        <Form :schema="CreateCourseSchema" />
    </div>
</DashboardLayout>
</template>