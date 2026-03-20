<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'
import { TryoutService } from '../../../../services/tryout'
import { UserService } from '../../../../services/user'
import type { User } from '../../../../types/entites/user'

const props = defineProps<{ tryoutId: number }>()

const queryClient = useQueryClient()

// ── Fetch current permissions ──────────────────────────────────────────────
const { data: permData, isLoading: permLoading } = useQuery({
  queryKey: ['tryout-tutors', props.tryoutId],
  queryFn: () => TryoutService.getTutorPermissions(props.tryoutId),
})

const permissions = computed(() => permData.value?.data ?? [])

// ── Fetch all users to pick tutors from ───────────────────────────────────
const { data: usersData, isLoading: usersLoading } = useQuery({
  queryKey: ['users'],
  queryFn: UserService.findAll,
})

// Only show TUTOR role users, exclude already-granted ones
const tutorOptions = computed<User[]>(() => {
  const grantedIds = new Set(permissions.value.map(p => p.user?.id))
  return (usersData.value?.data ?? []).filter(
    u => u.role === 'TUTOR' && !grantedIds.has(u.id)
  )
})

// ── Grant ──────────────────────────────────────────────────────────────────
const selectedUserId = ref<number | null>(null)
const searchQuery = ref('')

const filteredOptions = computed(() =>
  tutorOptions.value.filter(u =>
    u.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const grantMutation = useMutation({
  mutationFn: (userId: number) =>
    TryoutService.grantTutorPermission(props.tryoutId, userId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tryout-tutors', props.tryoutId] })
    selectedUserId.value = null
    searchQuery.value = ''
    toast.success('Tutor berhasil ditambahkan')
  },
  onError: (err: any) => {
    toast.error(err?.response?.data?.message ?? 'Gagal menambahkan tutor')
  },
})

// ── Revoke ─────────────────────────────────────────────────────────────────
const revokeMutation = useMutation({
  mutationFn: (userId: number) =>
    TryoutService.revokeTutorPermission(props.tryoutId, userId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tryout-tutors', props.tryoutId] })
    toast.success('Akses tutor dicabut')
  },
  onError: (err: any) => {
    toast.error(err?.response?.data?.message ?? 'Gagal mencabut akses tutor')
  },
})

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function handleGrant() {
  if (selectedUserId.value !== null) {
    grantMutation.mutate(selectedUserId.value)
  }
}

function selectUser(id: number) {
  selectedUserId.value = id
  const user = tutorOptions.value.find(u => u.ID === id)
  searchQuery.value = user ? `${user.username} (${user.email})` : ''
}
</script>

<template>
  <div class="mt-8 border rounded-lg overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
      <div class="flex items-center gap-2">
        <Icon icon="mdi:shield-account-outline" class="text-primary text-xl" />
        <h2 class="font-semibold text-gray-800">Tutor Permissions</h2>
        <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {{ permissions.length }} tutor
        </span>
      </div>
    </div>

    <div class="p-4 space-y-4">
      <!-- Grant form -->
      <div class="flex gap-2 items-start">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari tutor berdasarkan nama atau email..."
            class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            @input="selectedUserId = null"
          />

          <!-- Dropdown suggestions -->
          <div
            v-if="searchQuery && !selectedUserId && filteredOptions.length > 0"
            class="absolute z-20 top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto"
          >
            <div v-if="usersLoading" class="px-3 py-2 text-sm text-gray-500">Memuat...</div>
            <button
              v-for="user in filteredOptions"
              :key="user.id"
              type="button"
              @click="selectUser(user.id)"
              class="w-full text-left px-3 py-2 text-sm hover:bg-primary/5 flex items-center gap-2 transition-colors"
            >
              <Icon icon="mdi:account-circle-outline" class="text-gray-400 shrink-0" />
              <div>
                <p class="font-medium text-gray-800">{{ user.username }}</p>
                <p class="text-xs text-gray-500">{{ user.email }}</p>
              </div>
            </button>
            <div
              v-if="filteredOptions.length === 0 && !usersLoading"
              class="px-3 py-2 text-sm text-gray-400"
            >
              Tidak ada tutor ditemukan
            </div>
          </div>
        </div>

        <button
          @click="handleGrant"
          :disabled="!selectedUserId || grantMutation.isPending.value"
          class="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors shrink-0"
        >
          <Icon icon="mdi:plus" />
          Tambah
        </button>
      </div>

      <!-- Permissions list -->
      <div v-if="permLoading" class="py-6 text-center text-gray-500 text-sm">
        Memuat daftar tutor...
      </div>

      <div v-else-if="permissions.length === 0" class="py-6 text-center text-gray-400 text-sm">
        <Icon icon="mdi:account-off-outline" class="text-3xl mb-1" />
        <p>Belum ada tutor yang diberikan akses</p>
      </div>

      <div v-else class="divide-y rounded-md border overflow-hidden">
        <div
          v-for="perm in permissions"
          :key="perm.id"
          class="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Icon icon="mdi:account" class="text-primary" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-800">{{ perm.user?.username ?? '-' }}</p>
              <p class="text-xs text-gray-500">{{ perm.user?.email ?? '-' }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block">
              <p class="text-xs text-gray-400">Diberikan oleh</p>
              <p class="text-xs text-gray-600">{{ perm.grantedBy?.username ?? '-' }}</p>
              <p class="text-xs text-gray-400">{{ dateFormatter.format(new Date(perm.grantedAt)) }}</p>
            </div>

            <button
              @click="perm.user && revokeMutation.mutate(perm.user.id)"
              :disabled="revokeMutation.isPending.value"
              class="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              title="Cabut akses"
            >
              <Icon icon="mdi:close-circle-outline" class="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
