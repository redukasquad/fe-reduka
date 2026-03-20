<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { User } from '../../../types/entites/user'

defineProps<{ user: User | null }>()
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div class="h-24 bg-linear-to-r from-primary to-violet-600 relative">
      <div class="absolute -bottom-10 left-6">
        <div class="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg">
          <img :src="user?.profileImage || '/profile.jpg'" :alt="user?.username" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>
    <div class="pt-14 px-6 pb-5">
      <div class="flex items-center gap-2 flex-wrap">
        <h2 class="text-base font-extrabold text-gray-900">{{ user?.username }}</h2>
        <span v-if="user?.role"
          class="text-xs font-bold bg-primary/10 text-primary rounded-full px-2.5 py-0.5 uppercase tracking-wide">
          {{ user.role }}
        </span>
        <span v-if="user?.isVerified"
          class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-full px-2.5 py-0.5">
          <Icon icon="mdi:check-circle" class="text-sm" /> Terverifikasi
        </span>
      </div>
      <p class="text-sm text-gray-500 mt-0.5">{{ user?.email }}</p>
      <div class="flex items-center gap-4 mt-2 flex-wrap">
        <span v-if="user?.noTelp" class="flex items-center gap-1 text-xs text-gray-500">
          <Icon icon="mdi:phone-outline" class="text-primary" /> {{ user.noTelp }}
        </span>
        <span v-if="user?.kelas" class="flex items-center gap-1 text-xs text-gray-500">
          <Icon icon="mdi:school-outline" class="text-primary" /> {{ user.kelas }}
        </span>
      </div>
    </div>
  </div>
</template>
