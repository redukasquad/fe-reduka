<script setup lang="ts">
// My Classes — courses yang di-assign ke tutor untuk dikelola lesson-nya
// Tutor TIDAK bisa buat course baru — itu hak admin
import { computed, reactive, watch } from 'vue'
import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { Image } from '@unpic/vue'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import { CourseTutorService } from '../../../../services/course.tutor.service'

const route = useRoute()
const router = useRouter()

const query = reactive({
  q: String(route.query.q ?? ''),
  page: Number(route.query.page ?? 1),
  perPage: 12,
})

let searchTimer: ReturnType<typeof setTimeout>
const onSearch = (val: string) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    query.q = val
    query.page = 1
  }, 400)
}

watch(() => ({ q: query.q, page: query.page }), (val) => {
  router.replace({ query: { q: val.q || undefined, page: String(val.page) } })
})

const { data, isLoading, isError } = useQuery({
  queryKey: computed(() => ['my-courses', query.q, query.page, query.perPage]),
  queryFn: () => CourseTutorService.getMyCourses(query),
  placeholderData: keepPreviousData,
  staleTime: 1000 * 60 * 2,
})

const courses = computed(() => data.value?.data?.data ?? [])
const meta = computed(() => ({
  page: data.value?.data?.page ?? query.page,
  totalPages: data.value?.data?.totalPages ?? 1,
  totalItems: data.value?.data?.totalItems ?? 0,
}))

const dateFormatter = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
</script>

<template>
  <DashboardLayout>
    <div class="py-6 px-4 md:px-8 space-y-6 backdrop-blur">

      <!-- Header -->
      <div>
        <h1 class="text-xl font-bold text-gray-800">My Classes</h1>
        <p class="text-sm text-gray-500 mt-0.5">Course yang kamu ampu — kelola pertemuan & materi di sini.</p>
      </div>

      <!-- Search -->
      <div class="relative max-w-sm">
        <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        <input
          :value="query.q"
          @input="onSearch(($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Cari course..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>

      <!-- Skeleton -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="n in 6" :key="n" class="bg-white rounded-xl border overflow-hidden animate-pulse">
          <div class="h-40 bg-gray-200" />
          <div class="p-4 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4" />
            <div class="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      </div>

      <div v-else-if="isError" class="py-16 text-center text-red-500">
        <Icon icon="mdi:alert-circle-outline" class="text-5xl mb-2" />
        <p>Gagal memuat data.</p>
      </div>

      <!-- Empty — tutor tidak bisa buat course sendiri -->
      <div v-else-if="courses.length === 0" class="py-16 text-center text-gray-400 space-y-3">
        <Icon icon="mdi:book-off-outline" class="text-5xl" />
        <p class="font-medium">Belum ada course yang kamu ampu.</p>
        <p class="text-sm text-gray-400">Hubungi admin untuk di-assign ke course.</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="course in courses"
          :key="course.id"
          class="group bg-white rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
        >
          <div class="relative h-40 bg-gray-100 overflow-hidden">
            <Image
              v-if="course.image"
              :src="course.image"
              :alt="course.nameCourse"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
              <Icon icon="mdi:image-off-outline" class="text-4xl" />
            </div>
            <span
              :class="course.isFree ? 'bg-green-500' : 'bg-orange-500'"
              class="absolute top-2 right-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
            >
              {{ course.isFree ? 'GRATIS' : 'BERBAYAR' }}
            </span>
          </div>

          <div class="flex flex-col flex-1 p-4 gap-2">
            <h3 class="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">{{ course.nameCourse }}</h3>
            <p v-if="course.program" class="text-xs text-gray-400 flex items-center gap-1">
              <Icon icon="mdi:school-outline" class="text-primary" />
              {{ course.program.programName }}
            </p>
            <div class="flex items-center gap-2 text-xs text-gray-400">
              <Icon icon="mdi:book-open-variant" class="text-primary" />
              <span>{{ course.classes?.length ?? 0 }} kelas</span>
              <span class="mx-1">·</span>
              <Icon icon="mdi:calendar-range" class="text-primary" />
              <span>{{ dateFormatter.format(new Date(course.startDate)) }}</span>
            </div>

            <div class="flex items-center gap-2 mt-auto pt-3 border-t border-gray-50">
              <RouterLink
                :to="{ name: 'tutor-classes-view', params: { id: course.id } }"
                class="flex-1 text-center px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                <Icon icon="mdi:book-edit-outline" class="inline mr-1" />
                Kelola Pertemuan
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="meta.totalPages > 1" class="flex items-center justify-between flex-wrap gap-3">
        <p class="text-sm text-gray-500">
          Halaman {{ meta.page }} dari {{ meta.totalPages }} · {{ meta.totalItems }} course
        </p>
        <div class="flex items-center gap-1">
          <button :disabled="meta.page === 1" @click="query.page--"
            class="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">
            <Icon icon="mdi:chevron-left" />
          </button>
          <button v-for="p in meta.totalPages" :key="p" @click="query.page = p"
            :class="['px-3 py-1.5 border rounded-lg text-sm transition-colors', p === meta.page ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-gray-50']">
            {{ p }}
          </button>
          <button :disabled="meta.page === meta.totalPages" @click="query.page++"
            class="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">
            <Icon icon="mdi:chevron-right" />
          </button>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>
