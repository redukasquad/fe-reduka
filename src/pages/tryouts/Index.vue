<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { Image } from '@unpic/vue'
import { TryoutService } from '../../services/tryout'

const router = useRouter()

const search = ref('')
const filter = ref<'all' | 'free' | 'paid'>('all')
const page = ref(1)
const perPage = 9

// debounce search
const debouncedSearch = ref('')
let debounceTimer: ReturnType<typeof setTimeout>
watch(search, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedSearch.value = val
    page.value = 1
  }, 400)
})

const { data, isLoading } = useQuery({
  queryKey: ['tryouts', debouncedSearch, page],
  queryFn: () => TryoutService.findAll({ q: debouncedSearch.value, page: page.value, perPage }),
  staleTime: 1000 * 60 * 2,
})

const allItems = computed(() => data.value?.data?.data ?? [])
const pagination = computed(() => data.value?.data)

const items = computed(() => {
  if (filter.value === 'free') return allItems.value.filter(t => t.isFree)
  if (filter.value === 'paid') return allItems.value.filter(t => !t.isFree)
  return allItems.value
})

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatPrice(p: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p)
}

function isOpen(item: any) {
  const now = new Date()
  return now >= new Date(item.registrationStart) && now <= new Date(item.registrationEnd)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-20">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 py-10">
        <h1 class="text-3xl font-extrabold text-gray-900">Tryout</h1>
        <p class="text-gray-500 mt-1">Uji kemampuanmu dengan tryout resmi sebelum ujian sesungguhnya.</p>

        <!-- Search + Filter -->
        <div class="mt-6 flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              v-model="search"
              type="text"
              placeholder="Cari tryout..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div class="flex gap-2">
            <button
              v-for="f in [{ key: 'all', label: 'Semua' }, { key: 'free', label: 'Gratis' }, { key: 'paid', label: 'Berbayar' }]"
              :key="f.key"
              @click="filter = f.key as any; page = 1"
              :class="[
                'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                filter === f.key
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
              ]"
            >
              {{ f.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Loading -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="i in 6" :key="i" class="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
          <div class="h-44 bg-gray-200" />
          <div class="p-4 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4" />
            <div class="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="items.length === 0" class="py-20 text-center text-gray-400 space-y-3">
        <Icon icon="mdi:clipboard-search-outline" class="text-6xl mx-auto" />
        <p class="text-lg font-medium">Tidak ada tryout ditemukan.</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="item in items"
          :key="item.id"
          @click="router.push({ name: 'tryouts-view', params: { id: item.id } })"
          class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <!-- Image -->
          <div class="relative h-44 bg-gray-100 overflow-hidden">
            <Image
              v-if="item.imageUrl"
              :src="item.imageUrl"
              :alt="item.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
              <Icon icon="mdi:file-document-outline" class="text-5xl" />
            </div>

            <!-- Badges -->
            <div class="absolute top-3 left-3 flex gap-2">
              <span
                :class="[
                  'px-2.5 py-0.5 rounded-full text-xs font-semibold',
                  item.isFree ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                ]"
              >
                {{ item.isFree ? 'Gratis' : formatPrice(item.price ?? 0) }}
              </span>
              <span
                v-if="isOpen(item)"
                class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"
              >
                Buka
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4 space-y-2">
            <h3 class="font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
              {{ item.name }}
            </h3>
            <div class="flex items-center gap-1.5 text-xs text-gray-400">
              <Icon icon="mdi:calendar-range" />
              <span>{{ formatDate(item.registrationStart) }} – {{ formatDate(item.registrationEnd) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.totalPages > 1" class="mt-8 flex justify-center items-center gap-2">
        <button
          @click="page--"
          :disabled="page <= 1"
          class="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
        >
          <Icon icon="mdi:chevron-left" />
        </button>
        <span class="text-sm text-gray-600">Halaman {{ page }} dari {{ pagination.totalPages }}</span>
        <button
          @click="page++"
          :disabled="page >= pagination.totalPages"
          class="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
        >
          <Icon icon="mdi:chevron-right" />
        </button>
      </div>
    </div>
  </div>
</template>
