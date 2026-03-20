<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { ProgramService } from '../../services/program'
import ProgramCard from '../../components/programs/ProgramCard.vue'
import ProgramCardSkeleton from '../../components/programs/ProgramCardSkeleton.vue'

const route = useRoute()
const router = useRouter()

// URL sebagai source of truth untuk search
const search = ref((route.query.search as string) ?? '')

// Debounce sync ke URL
let debounceTimer: ReturnType<typeof setTimeout>
watch(search, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    router.replace({ query: val ? { search: val } : {} })
  }, 400)
})

// Fetch semua programs — backend tidak support filter, filter di client
const { data, isLoading, isError } = useQuery({
  queryKey: ['programs'],
  queryFn: ProgramService.findAll,
  staleTime: 1000 * 60 * 5, // 5 menit cache
})

const programs = computed(() => data.value?.data ?? [])

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return programs.value
  return programs.value.filter(p =>
    p.programName.toLowerCase().includes(q) ||
    p.description?.toLowerCase().includes(q)
  )
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-10">
    <!-- Hero header -->
    <div class="bg-white border-b border-gray-100 py-12 px-4">
      <div class="max-w-5xl mx-auto text-center space-y-3">
        <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900">Program Pembelajaran</h1>
        <p class="text-gray-500 text-base max-w-xl mx-auto">
          Temukan program yang sesuai dengan tujuan belajarmu dan mulai perjalananmu bersama Reduka.
        </p>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <!-- Search bar -->
      <div class="relative max-w-md">
        <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        <input
          v-model="search"
          type="text"
          placeholder="Cari program..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>

      <!-- Skeleton loading -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProgramCardSkeleton v-for="n in 6" :key="n" />
      </div>

      <!-- Error state -->
      <div v-else-if="isError" class="py-16 text-center text-red-500 space-y-2">
        <Icon icon="mdi:alert-circle-outline" class="text-5xl mx-auto" />
        <p class="font-medium">Gagal memuat program. Coba lagi nanti.</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="filtered.length === 0" class="py-16 text-center text-gray-400 space-y-2">
        <Icon icon="mdi:book-search-outline" class="text-5xl mx-auto" />
        <p class="font-medium">Tidak ada program ditemukan.</p>
        <button v-if="search" @click="search = ''" class="text-sm text-primary hover:underline">
          Hapus pencarian
        </button>
      </div>

      <!-- Program grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProgramCard v-for="program in filtered" :key="program.ID" :program="program" />
      </div>

      <!-- Result count -->
      <p v-if="!isLoading && !isError && filtered.length > 0" class="text-xs text-gray-400 text-center">
        Menampilkan {{ filtered.length }} dari {{ programs.length }} program
      </p>
    </div>
  </div>
</template>
