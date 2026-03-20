<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useQuery } from '@tanstack/vue-query'
import { UniversityService } from '../../../../services/university'
import type { UniversityMajor } from '../../../../types/entites/university'

const props = defineProps<{ universityId: number }>()
const emit = defineEmits<{
  create: []
  edit: [major: UniversityMajor]
  delete: [id: number]
}>()

const { data, isLoading } = useQuery({
  queryKey: computed(() => ['admin-majors', props.universityId]),
  queryFn: () => UniversityService.getMajors(props.universityId),
  staleTime: 1000 * 60,
})
const majors = computed(() => data.value?.data ?? [])
</script>

<template>
  <div class="space-y-3">
    <div class="flex justify-end">
      <button @click="emit('create')"
        class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm">
        <Icon icon="mdi:plus" /> Tambah Jurusan
      </button>
    </div>

    <div v-if="isLoading" class="space-y-2">
      <div v-for="n in 3" :key="n" class="rounded-xl border border-gray-100 p-3 animate-pulse flex gap-3">
        <div class="flex-1 space-y-1.5">
          <div class="h-3.5 bg-gray-200 rounded w-1/2" />
          <div class="h-3 bg-gray-100 rounded w-1/4" />
        </div>
      </div>
    </div>

    <div v-else-if="majors.length === 0" class="py-10 text-center text-sm text-gray-400">
      Belum ada jurusan. Tambahkan jurusan pertama.
    </div>

    <div v-else class="space-y-2">
      <div v-for="major in majors" :key="major.id"
        class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-primary/2 transition-all group">
        <div class="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
          <Icon icon="mdi:book-education-outline" class="text-violet-500 text-sm" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 truncate">{{ major.name }}</p>
          <p class="text-xs text-gray-400">Passing Grade: <span class="font-semibold text-gray-600">{{ major.passingGrade }}%</span></p>
        </div>
        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button @click="emit('edit', major)"
            class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all">
            <Icon icon="mdi:pencil-outline" class="text-sm" />
          </button>
          <button @click="emit('delete', major.id)"
            class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
            <Icon icon="mdi:trash-can-outline" class="text-sm" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
