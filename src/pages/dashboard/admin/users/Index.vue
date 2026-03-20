<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import UserTable from '../../../../components/dashboard/admin/users/UserTable.vue'
import { UserService } from '../../../../services/user'
import type { User, UserRole } from '../../../../types/entites/user'

const queryClient = useQueryClient()

const { data, isLoading, isError } = useQuery({
  queryKey: ['users'],
  queryFn: UserService.findAll,
})

const users = computed(() => data.value?.data ?? [])

// Stats
const totalCount = computed(() => users.value.length)
const adminCount = computed(() => users.value.filter(u => u.role === 'ADMIN').length)
const tutorCount = computed(() => users.value.filter(u => u.role === 'TUTOR').length)
const studentCount = computed(() => users.value.filter(u => u.role === 'STUDENT').length)

// Change role
const { mutate: changeRole } = useMutation({
  mutationFn: ({ user, role }: { user: User; role: UserRole }) =>
    UserService.setRole(user.id, role),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
    toast.success('Role berhasil diubah')
  },
  onError: () => toast.error('Gagal mengubah role'),
})

// Delete user
const { mutate: deleteUser } = useMutation({
  mutationFn: (user: User) => UserService.delete(user.id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
    toast.success('User berhasil dihapus')
  },
  onError: () => toast.error('Gagal menghapus user'),
})

// Create user modal
const showCreate = ref(false)

const CreateUserSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: toTypedSchema(CreateUserSchema),
})

const { value: username, errorMessage: usernameError } = useField<string>('username')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError } = useField<string>('password')

const { mutate: createUser, isPending: isCreating } = useMutation({
  mutationFn: UserService.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
    toast.success('User berhasil dibuat')
    showCreate.value = false
    resetForm()
  },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal membuat user'),
})

const onSubmit = handleSubmit(values => createUser(values))
</script>

<template>
  <DashboardLayout>
    <div class="py-6 px-4 md:px-8 space-y-6 z-20 backdrop-blur-lg">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-800">Manajemen Pengguna</h1>
        <button
          @click="showCreate = true"
          class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Icon icon="mdi:plus" />
          Tambah User
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="bg-white rounded-xl border p-4 text-center">
          <p class="text-2xl font-bold text-gray-800">{{ totalCount }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Total User</p>
        </div>
        <div class="bg-purple-50 rounded-xl border border-purple-100 p-4 text-center">
          <p class="text-2xl font-bold text-purple-600">{{ adminCount }}</p>
          <p class="text-xs text-purple-400 mt-0.5">Admin</p>
        </div>
        <div class="bg-blue-50 rounded-xl border border-blue-100 p-4 text-center">
          <p class="text-2xl font-bold text-blue-600">{{ tutorCount }}</p>
          <p class="text-xs text-blue-400 mt-0.5">Tutor</p>
        </div>
        <div class="bg-gray-50 rounded-xl border p-4 text-center">
          <p class="text-2xl font-bold text-gray-600">{{ studentCount }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Student</p>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div v-if="isLoading" class="p-10 text-center text-gray-500">Memuat data...</div>
        <div v-else-if="isError" class="p-10 text-center text-red-500">Gagal memuat data user.</div>
        <div v-else-if="users.length === 0" class="p-14 text-center text-gray-400">
          <Icon icon="mdi:account-off-outline" class="text-5xl mb-2" />
          <p>Belum ada pengguna.</p>
        </div>
        <UserTable
          v-else
          :users="users"
          @change-role="(user, role) => changeRole({ user, role })"
          @delete="deleteUser"
        />
      </div>

    </div>

    <!-- Create User Modal -->
    <Dialog v-model:visible="showCreate" modal header="Tambah User Baru" :style="{ width: '460px' }">
      <form @submit.prevent="onSubmit" class="space-y-4 pt-2">
        <div>
          <label class="text-sm font-medium text-gray-700 mb-1 block">Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Masukkan username"
            class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p v-if="usernameError" class="text-red-500 text-xs mt-1">{{ usernameError }}</p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700 mb-1 block">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Masukkan email"
            class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700 mb-1 block">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Minimal 6 karakter"
            class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p v-if="passwordError" class="text-red-500 text-xs mt-1">{{ passwordError }}</p>
        </div>

        <div class="flex justify-end gap-2 pt-1">
          <button
            type="button"
            @click="showCreate = false; resetForm()"
            class="px-4 py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="isSubmitting || isCreating"
            class="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {{ isCreating ? 'Menyimpan...' : 'Buat User' }}
          </button>
        </div>
      </form>
    </Dialog>
  </DashboardLayout>
</template>
