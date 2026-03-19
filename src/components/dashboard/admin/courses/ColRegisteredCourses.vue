<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { CourseRegistrationService } from '../../../../services/course.registration'

const props = defineProps<{ id: number | string }>()

const { data } = useQuery({
  queryKey: ['course-registration', Number(props.id)],
  queryFn: () => CourseRegistrationService.getRegistration(Number(props.id)),
})

const count = computed(() => data.value?.data?.length ?? 0)
</script>

<template>
  <div class="flex items-center gap-1 text-gray-600">
    <Icon icon="mdi:account-group" width="14" height="14" class="text-green-500" />
    <span>{{ count }} registered</span>
    <RouterLink
      :to="`/dashboard/admin/courses/${id}/registrations`"
      class="ml-1 text-green-500 hover:text-yellow-500 transition"
    >
      <Icon icon="mdi:arrow-top-right" width="12" height="12" />
    </RouterLink>
  </div>
</template>
