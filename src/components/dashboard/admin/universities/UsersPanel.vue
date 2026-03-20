<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useQuery } from '@tanstack/vue-query'
import api from '../../../../services/api'
import type { ApiResponse } from '../../../../types/api'
import type { User } from '../../../../types/entites/user'

const props = defineProps<{ universityId: number }>()

const { data, isLoading } = useQuery({
  queryKey: computed(() => ['admin-uni-users', props.universityId]),
  queryFn: async (): Promise<ApiResponse<User[]>> => {
    const res = await api.get(`/universities/${props.universityId}/users`)
    return res.data
  },
  staleTime: 1000 * 60,
})
const users = computed(() => data.value?.data ?? [])
</script>

<template>
  <div>
    <div v-if="isLoading" class="space-y-2">
      <div v-for="n in 3" :key="n" class="rounded-xl border border-gray-100 p-3 animate-pulse flex gap-3">
        <div class="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
        <div class="flex-1 space-y-1.5 py-0.5">
          <div class="h-3.5 bg-gray-200 rounded w-1/2" />
          <div class="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
    </div>

    <div v-else-if="users.length === 0" class="py-12 text-center">
      <div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-2">
        <Icon icon="mdi:account-off-outline" class="text-2xl text-gray-300" />
      </div>
      <p class="text-sm text-gray-400">Belum ada siswa yang menargetkan universitas ini</p>
    </div>

    <div v-else class="space-y-2">
      <p class="text-xs text-gray-400 mb-3">{{ users.length }} siswa menargetkan universitas ini</p>
      <div v-for="user in users" :key="user.id"
        class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all">
        <div class="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-gray-100 ring-2 ring-white shadow-sm">
          <img :src="user.profileImage || '/profile.jpg'" :alt="user.username" class="w-full h-full object-cover" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 truncate">{{ user.username }}</p>
          <p class="text-xs text-gray-400 truncate">{{ user.email }}</p>
        </div>
        <span v-if="user.kelas" class="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5 shrink-0">{{ user.kelas }}</span>
      </div>
    </div>
  </div>
</template>
