<script setup lang="ts">
import { computed } from 'vue'
import { CourseService } from '../../../../services/course'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'

const route = useRoute()

const { data, isLoading, isError } = useQuery({
  queryKey: ['course', route.params.id],
  queryFn: () => CourseService.findOne(String(route.params.id)),
  enabled: computed(() => !!route.params.id),
})

const course = computed(() => data.value?.data || null)

console.log(course.value)
</script>

<template>
    <DashboardLayout>
        <div v-if="isLoading">Loading...</div>
        <div v-else-if="isError">Error loading course</div>
        <div v-else-if="course">
            <h1>{{ course.nameCourse }}</h1>
            <p>{{ course.description }}</p>
        </div>
    </DashboardLayout>
</template>
