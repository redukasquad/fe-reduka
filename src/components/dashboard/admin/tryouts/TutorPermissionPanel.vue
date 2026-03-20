<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'
import { TryoutService } from '../../../../services/tryout'
import { UserService } from '../../../../services/user'

const props = defineProps<{ tryoutId: number }>()
const queryClient = useQueryClient()

// ── Fetch current permissions ──────────────────────────────────────────────
const { data: permData, isLoading: permLoading } = useQuery({
  queryKey: ['tryout-tutors', props.tryoutId],
  queryFn: () => TryoutService.getTutorPermissions(props.tryoutId),
})
const permissions = computed(() => permData.value?.data ?? [])

// ── Fetch all users ────────────────────────────────────────────────────────
const { data: usersData, isLoading: usersLoading } = useQuery({
  queryKey: ['users'],
  queryFn: UserService.findAll,
})

// Backend returns raw gorm.Model entity — ID can be uppercase or lowercase
function getUserId(u: any): number {
  return u.id ?? u.ID ?? 0
}

// Only TUTOR role, exclude already-granted (active) ones
const tutorOptions = computed(() => {
  const grantedIds = new Set(permissions.value.map(p => p.user?.id))
  return (usersData.value?.data ?? []).filter(
    (u: any) => u.role === 'TUTOR' && !grantedIds.has(getUserId(u))
  )
})

// ── Search & select ────────────────────────────────────────────────────────
const selectedUser = ref<any | null>(null)
const searchQuery = ref('')
const showDropdown = ref(false)

const filteredOptions = computed(() =>
  tutorOptions.value.filter((u: any) =>
    u.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

function onSearchInput() {
  selectedUser.value = null
  showDropdown.value = true
}

function selectUser(u: any) {
  selectedUser.value = u
  searchQuery.value = u.username
  showDropdown.value = false
}

function clearSelection() {
  selectedUser.value = null
  searchQuery.value = ''
  showDropdown.value = false
}

// ── Grant ──────────────────────────────────────────────────────────────────
const grantMutation = useMutation({
  mutationFn: (userId: number) => TryoutService.grantTutorPermission(props.tryoutId, userId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tryout-tutors', props.tryoutId] })
    clearSelection()
    toast.success('Tutor berhasil ditambahkan')
  },
  onError: (err: any) => {
    const status = err?.response?.status
    const msg = err?.response?.data?.message ?? ''
    // 409 = already has permission (active) — just refresh list
    if (status === 409) {
      queryClient.invalidateQueries({ queryKey: ['tryout-tutors', props.tryoutId] })
      clearSelection()
      toast.info('Tutor sudah memiliki akses')
    } else {
      toast.error(msg || 'Gagal menambahkan tutor')
    }
  },
})

// ── Revoke ─────────────────────────────────────────────────────────────────
const revokingId = ref<number | null>(null)

const revokeMutation = useMutation({
  mutationFn: (userId: number) => TryoutService.revokeTutorPermission(props.tryoutId, userId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tryout-tutors', props.tryoutId] })
    revokingId.value = null
    toast.success('Akses tutor dicabut')
  },
  onError: (err: any) => {
    revokingId.value = null
    toast.error(err?.response?.data?.message ?? 'Gagal mencabut akses tutor')
  },
})

function handleRevoke(userId: number) {
  revokingId.value = userId
  revokeMutation.mutate(userId)
}

function hideDropdown() {
  setTimeout(() => (showDropdown.value = false), 150)
}

function handleGrant() {
  if (selectedUser.value) {
    grantMutation.mutate(getUserId(selectedUser.value))
  }
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit', month: 'short', year: 'numeric',
})
</script>

<template>
  <div class="mt-8 rounded-xl border border-gray-200 overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-3 px-5 py-4 bg-gray-50 border-b border-gray-200">
      <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon icon="mdi:shield-account-outline" class="text-primary" />
      </div>
      <div class="flex-1">
        <h2 class="font-semibold text-gray-800 text-sm">Tutor Permissions</h2>
        <p class="text-xs text-gray-400">Tutor yang bisa mengakses tryout ini</p>
      </div>
      <span class="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">
        {{ permissions.length }} tutor
      </span>
    </div>

    <div class="p-5 space-y-5">
      <!-- Grant form -->
      <div class="flex gap-2 items-start">
        <div class="relative flex-1">
          <div class="relative">
            <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari tutor berdasarkan nama atau email..."
              class="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
              @input="onSearchInput"
              @focus="showDropdown = true"
              @blur="hideDropdown"
            />
            <button
              v-if="selectedUser"
              @click="clearSelection"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Icon icon="mdi:close-circle" class="text-base" />
            </button>
          </div>

          <!-- Dropdown -->
          <div
            v-if="showDropdown && searchQuery && !selectedUser"
            class="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-52 overflow-y-auto"
          >
            <div v-if="usersLoading" class="px-4 py-3 text-sm text-gray-400 text-center flex items-center justify-center gap-2">
              <Icon icon="mdi:loading" class="animate-spin" /> Memuat...
            </div>
            <template v-else-if="filteredOptions.length > 0">
              <button
                v-for="user in filteredOptions"
                :key="getUserId(user)"
                type="button"
                @mousedown.prevent="selectUser(user)"
                class="w-full text-left px-4 py-2.5 hover:bg-primary/5 flex items-center gap-3 transition-colors"
              >
                <img
                  v-if="user.profileImage"
                  :src="user.profileImage"
                  class="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div v-else class="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                  <Icon icon="mdi:account" class="text-violet-500" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-800 truncate">{{ user.username }}</p>
                  <p class="text-xs text-gray-400 truncate">{{ user.email }}</p>
                </div>
              </button>
            </template>
            <div v-else class="px-4 py-3 text-sm text-gray-400 text-center">
              Tidak ada tutor ditemukan
            </div>
          </div>
        </div>

        <button
          @click="handleGrant"
          :disabled="!selectedUser || grantMutation.isPending.value"
          class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium disabled:opacity-40 hover:bg-primary/90 transition-colors shrink-0 h-[38px]"
        >
          <Icon v-if="grantMutation.isPending.value" icon="mdi:loading" class="animate-spin" />
          <Icon v-else icon="mdi:plus" />
          Tambah
        </button>
      </div>

      <!-- Selected user preview -->
      <div v-if="selectedUser" class="flex items-center gap-2.5 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
        <img
          v-if="selectedUser.profileImage"
          :src="selectedUser.profileImage"
          class="w-7 h-7 rounded-full object-cover shrink-0"
        />
        <div v-else class="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Icon icon="mdi:account" class="text-primary text-sm" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-primary truncate">{{ selectedUser.username }}</p>
          <p class="text-xs text-primary/60 truncate">{{ selectedUser.email }}</p>
        </div>
        <button @click="clearSelection" class="text-primary/50 hover:text-primary shrink-0">
          <Icon icon="mdi:close" class="text-sm" />
        </button>
      </div>

      <!-- Permissions list -->
      <div v-if="permLoading" class="py-10 text-center space-y-2">
        <Icon icon="mdi:loading" class="animate-spin text-3xl text-gray-300 mx-auto block" />
        <p class="text-sm text-gray-400">Memuat daftar tutor...</p>
      </div>

      <div v-else-if="permissions.length === 0" class="py-10 text-center space-y-2">
        <div class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto">
          <Icon icon="mdi:account-off-outline" class="text-2xl text-gray-300" />
        </div>
        <p class="text-sm text-gray-400">Belum ada tutor yang diberikan akses</p>
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="perm in permissions"
          :key="perm.id"
          class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-primary/20 hover:bg-primary/5 transition-all group"
        >
          <!-- Avatar -->
          <div class="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
            <Icon icon="mdi:account" class="text-violet-500 text-lg" />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 truncate">{{ perm.user?.username ?? '-' }}</p>
            <p class="text-xs text-gray-400 truncate">{{ perm.user?.email ?? '-' }}</p>
          </div>

          <!-- Meta + revoke -->
          <div class="flex items-center gap-3 shrink-0">
            <div class="text-right hidden sm:block">
              <p class="text-xs text-gray-400">
                oleh <span class="font-medium text-gray-600">{{ perm.grantedBy?.username ?? '-' }}</span>
              </p>
              <p class="text-xs text-gray-400">{{ dateFormatter.format(new Date(perm.grantedAt)) }}</p>
            </div>
            <button
              @click="perm.user && handleRevoke(perm.user.id)"
              :disabled="revokingId === perm.user?.id"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 group-hover:text-gray-400"
              title="Cabut akses"
            >
              <Icon
                :icon="revokingId === perm.user?.id ? 'mdi:loading' : 'mdi:trash-can-outline'"
                :class="revokingId === perm.user?.id ? 'animate-spin' : ''"
                class="text-base"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
