<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useQuery } from '@tanstack/vue-query';
import { CourseRegistrationService } from '../../../../services/course.registration';
import { onMounted } from 'vue';

const props = defineProps<{
  id: number | string
}>()

const { data } = useQuery({
  queryKey: ['course-registration', Number(props.id)],
  queryFn: async () => {
    const res = await CourseRegistrationService.getRegistration(Number(props.id))
    return res.data
  },
})

const countRegister = onMounted(()=>(
  data.value?.length
))
</script>

<template>
  <div class="flex items-center gap-1 text-gray-600">
    <Icon
      icon="mdi:account-group"
      width="14"
      height="14"
      class="text-green-500 text-xs"
    />

    <span>{{ countRegister }} registered</span>

    <RouterLink
      :to="`/dashboard/admin/courses/${id}/registrations`"
      class="ml-1 text-green-500 hover:text-yellow-500 transition"
    >
      <Icon icon="mdi:arrow-top-right" width="12" height="12" />
    </RouterLink>
  </div>
</template>
