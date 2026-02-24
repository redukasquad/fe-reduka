<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { TryoutRegistrationService } from '../../../../services/tryouts.registration';
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';

const props = defineProps<{
  id: number | string
}>()


const { data, isLoading, isError } = useQuery({
  queryKey: ['tryout-registration', props.id],
  queryFn: async () => {
    const res = await TryoutRegistrationService.getRegistration(props.id ? Number(props.id) : 0)
    return res.data
  },
})

const tryoutRegistration = computed(() => data.value ?? [])

</script>

<template>
  <div class="flex items-center gap-1 text-gray-600">
    <Icon
      icon="mdi:account-group"
      width="14"
      height="14"
      class="text-green-500 text-xs"
    />

    <span>{{ tryoutRegistration.length }} registered</span>

    <RouterLink
      :to="`/dashboard/admin/tryouts/${id}/registrations`"
      class="ml-1 text-green-500 hover:text-yellow-500 transition"
    >
      <Icon icon="mdi:arrow-top-right" width="12" height="12" />
    </RouterLink>
  </div>
</template>
