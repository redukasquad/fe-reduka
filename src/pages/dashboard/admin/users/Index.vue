<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import { UserService } from '../../../../services/user'
import UserTable from '../../../../components/dashboard/admin/users/UserTable.vue'
import type { User, UserRole } from '../../../../types/entites/user'
import { toast } from 'vue3-toastify'

const queryClient = useQueryClient()

const { data, isLoading, isError } = useQuery({
  queryKey: ['users'],
  queryFn: UserService.findAll,
})

const users = computed(() => data.value?.data || [])

const { mutate: changeRole } = useMutation({
  mutationFn: (payload: { user: User; role: string }) =>
    UserService.changeRole({ ...payload.user, role: (payload.role) as UserRole }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] }),
    toast('Success change a role', {
        type:'success'
    })
  },
  onError: ()=>{
    toast('Error when change a role', {
        type:'error'
    })
  }
})

const handleChangeRole = (user: User, role: string) => {
  changeRole({ user, role })
}
</script>

<template>
  <DashboardLayout>
    <div class="backdrop-blur px-4">
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <h1 class="text-2xl font-bold p-4 text-gray-800">Daftar Pengguna</h1>

        <div v-if="isLoading" class="p-8 text-center text-gray-600">
          Memuat data...
        </div>

        <div v-else-if="isError" class="p-8 text-center text-red-600">
          Gagal memuat data user.
        </div>

        <div v-else>
          <UserTable :users="users" @change-role="handleChangeRole" />
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
