<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useQuery } from '@tanstack/vue-query'
import { UniversityService } from '../../../../services/university'
import type { University } from '../../../../types/entites/university'

const emit = defineEmits<{
  select: [uni: University]
  edit: [uni: University]
  delete: [id: number]
  create: []
}>()

const props = defineProps<{ selectedId?: number }>()

const searchQ = ref('')

const { data, isLoading } = useQuery({
  queryKey: computed(() => ['admin-universities', searchQ.value]),
  queryFn: () => UniversityService.findAll(searchQ.value),
  staleTime: 1000 * 60,
})
const universities = computed(() => data.value?.data ?? [])

const typeColor = (t: string) => ({
  PTN: 'bg-blue-100 text-blue-700',
  PTS: 'bg-amber-100 text-amber-700',
  PTK: 'bg-violet-100 text-violet-700',
}[t] ?? 'bg-gray-100 text-gray-600')
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <div class="relative flex-1">
        <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input v-model="searchQ" type="text" placeholder="Cari universitas..."
          class="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white" />
      </div>
      <button @click="emit('create')"
        class="shrink-0 w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm">
        <Icon icon="mdi:plus" class="text-base" />
      </button>
    </div>

    <div v-if="isLoading" class="space-y-2">
      <div v-for="n in 5" :key="n" class="bg-white rounded-xl border border-gray-100 p-3 animate-pulse flex gap-3">
        <div class="w-9 h-9 rounded-lg bg-gray-200 shrink-0" />
        <div class="flex-1 space-y-1.5 py-0.5">
          <div class="h-3.5 bg-gray-200 rounded w-3/4" />
          <div class="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
    </div>

    <div v-else-if="universities.length === 0" class="py-10 text-center text-sm text-gray-400">
      Tidak ada universitas ditemukan
    </div>

    <div v-else class="space-y-1.5 max-h-[calc(100vh-240px)] overflow-y-auto pr-0.5">
      <button
        v-for="uni in universities" :key="uni.id"
        @click="emit('select', uni)"
        :class="[
          'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all group',
          selectedId === uni.id
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-gray-100 bg-white hover:border-primary/30 hover:shadow-sm'
        ]"
      >
        <div :class="['w-9 h-9 rounded-lg flex items-center justify-center shrink-0', selectedId === uni.id ? 'bg-primary text-white' : 'bg-primary/10 text-primary']">
          <Icon icon="mdi:domain" class="text-base" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 truncate">{{ uni.name }}</p>
          <span :class="['text-[10px] font-bold px-1.5 py-0.5 rounded-full', typeColor(uni.type)]">{{ uni.type }}</span>
        </div>
        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button @click.stop="emit('edit', uni)"
            class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all">
            <Icon icon="mdi:pencil-outline" class="text-sm" />
          </button>
          <button @click.stop="emit('delete', uni.id)"
            class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
            <Icon icon="mdi:trash-can-outline" class="text-sm" />
          </button>
        </div>
      </button>
    </div>
  </div>
</template>
