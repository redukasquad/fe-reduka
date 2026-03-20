<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { Image } from '@unpic/vue'
import { CourseService } from '../../services/course'
import { useDebounceFn } from '@vueuse/core'

const router = useRouter()

const search = ref('')
const page = ref(1)
const perPage = 12
const filterFree = ref<'all' | 'free' | 'paid'>('all')

const query = computed(() => ({
  q: search.value,
  page: page.value,
  perPage,
}))

const { data, isLoading } = useQuery({
  queryKey: computed(() => ['courses', query.value]),
  queryFn: () => CourseService.findAll(query.value),
})

const courses = computed(() => data.value?.data?.data ?? [])
const totalPages = computed(() => data.value?.data?.totalPages ?? 1)

const filtered = computed(() => {
  if (filterFree.value === 'free') return courses.value.filter(c => c.isFree)
  if (filterFree.value === 'paid') return courses.value.filter(c => !c.isFree)
  return courses.value
})

const debouncedSearch = useDebounceFn(() => { page.value = 1 }, 400)
watch(search, debouncedSearch)

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-18">
    <!-- Header -->
    <div class="bg-white border-b">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-extrabold text-gray-800 mb-1">Kelas Pembelajaran</h1>
        <p class="text-sm text-gray-400">Temukan kelas yang sesuai dengan tujuanmu</p>

        <!-- Search + Filter -->
        <div class="mt-5 flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              v-model="search"
              type="text"
              placeholder="Cari nama kelas..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div class="flex gap-2">
            <button
              v-for="f in [{ key: 'all', label: 'Semua' }, { key: 'free', label: 'Gratis' }, { key: 'paid', label: 'Berbayar' }]"
              :key="f.key"
              @click="filterFree = f.key as any; page = 1"
              :class="['px-4 py-2.5 rounded-xl text-sm font-medium transition-colors', filterFree === f.key ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/40']"
            >{{ f.label }}</button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Loading skeleton -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="i in 6" :key="i" class="bg-white rounded-2xl border overflow-hidden animate-pulse">
          <div class="h-44 bg-gray-200" />
          <div class="p-4 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4" />
            <div class="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="filtered.length === 0" class="text-center py-20 text-gray-400 space-y-3">
        <Icon icon="mdi:book-open-outline" class="text-6xl mx-auto text-gray-200" />
        <p class="text-lg font-semibold">Tidak ada kelas ditemukan</p>
        <p class="text-sm">Coba ubah kata kunci pencarian</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="course in filtered"
          :key="course.id"
          @click="router.push(`/courses/${course.id}`)"
          class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
          <!-- Image -->
          <div class="relative h-44 bg-gray-100 overflow-hidden">
            <Image v-if="course.image" :src="course.image" :alt="course.nameCourse" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-200">
              <Icon icon="mdi:book-education-outline" class="text-6xl" />
            </div>
            <span :class="['absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold', course.isFree ? 'bg-green-400 text-white' : 'bg-amber-400 text-white']">
              {{ course.isFree ? 'GRATIS' : 'BERBAYAR' }}
            </span>
          </div>

          <!-- Content -->
          <div class="p-4">
            <p v-if="course.program" class="text-xs text-primary font-semibold mb-1">{{ course.program.programName }}</p>
            <h3 class="font-bold text-gray-800 text-sm leading-snug line-clamp-2 mb-2">{{ course.nameCourse }}</h3>
            <p v-if="course.description" class="text-xs text-gray-400 line-clamp-2 mb-3" v-html="course.description" />
            <div class="flex items-center justify-between text-xs text-gray-400 border-t pt-3">
              <span class="flex items-center gap-1">
                <Icon icon="mdi:calendar-range" />
                {{ formatDate(course.startDate) }}
              </span>
              <span class="flex items-center gap-1">
                <Icon icon="mdi:book-open-page-variant-outline" />
                {{ course.classes?.length ?? 0 }} kelas
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
        <button
          @click="page--"
          :disabled="page <= 1"
          class="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Icon icon="mdi:chevron-left" />
        </button>
        <button
          v-for="p in totalPages"
          :key="p"
          @click="page = p"
          :class="['w-9 h-9 rounded-lg text-sm font-medium transition-colors', page === p ? 'bg-primary text-white' : 'border border-gray-200 text-gray-600 hover:border-primary/40']"
        >{{ p }}</button>
        <button
          @click="page++"
          :disabled="page >= totalPages"
          class="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Icon icon="mdi:chevron-right" />
        </button>
      </div>
    </div>
  </div>
</template>
