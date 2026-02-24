<script setup lang="ts">
import { useMutation, useQuery, keepPreviousData } from '@tanstack/vue-query'
import { computed, reactive, watch } from 'vue'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import { CourseService } from '../../../../services/course'

import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import CardCourses from '../../../../components/dashboard/tutor/courses/CardCourses.vue'

const router = useRouter()
const route = useRoute()

const query = reactive({
  q: String(route.query.q ?? ''),
  page: Number(route.query.page ?? 1),
  perPage: Number(route.query.perPage ?? 10),
})

watch(
  () => route.query,
  (val) => {
    query.q = String(val.q ?? '')
    query.page = Number(val.page ?? 1)
    query.perPage = Number(val.perPage ?? 10)
  }
)

watch(
  () => ({ ...query }),
  (val) => {
    router.replace({
      query: {
        q: val.q || undefined,
        page: String(val.page),
        perPage: String(val.perPage),
      },
    })
  },
  { deep: true }
)

const { data, refetch, isLoading, isError } = useQuery({
  queryKey: ['courses', query.q, query.page, query.perPage],
  queryFn: () => CourseService.findAll(query),
  placeholderData: keepPreviousData,
})

const courses = computed(
  () => data.value?.data?.data ?? []
)


const metaData = computed(() => {
  const m = data.value?.data
  return {
    page: m?.page ?? query.page,
    perPage: m?.perPage ?? query.perPage,
    totalItems: m?.totalItems ?? 0,
    totalPages: m?.totalPages ?? 1,
  }
})


const courseMutation = useMutation({
  mutationFn: async (id: number) => {
    await CourseService.delete(id)
  },
  onSuccess: () => {
    refetch()
    toast('Sucessfully deleted', { type: 'success' })
  },
})

const handleView = (id: number) => {
  router.push({ name: 'admin-courses-view', params: { id: id } })
}

const handleDelete = (id: number) => {
  courseMutation.mutate(id)
}

const handlePageChange = (page: number) => {
  query.page = page
  refetch()
}

const handlePerPageChange = (perPage: number) => {
  query.perPage = perPage
  query.page = 1
  refetch()
}

let searchTimeout: any

const handleSearch = (q: string) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    query.q = q
    query.page = 1
    refetch()
  }, 400)
}

const pages = computed(() => {
  const arr = []
  for (let i = 1; i <= metaData.value.totalPages; i++) arr.push(i)
  return arr
})
</script>

<template>
  <DashboardLayout>
    <div class="backdrop-blur min-h-screen px-4">
      <div class="bg-white/20 rounded-lg shadow overflow-hidden">

        <div class="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 class="text-2xl font-bold text-gray-800">
            Daftar Courses
          </h1>

          <input
            type="text"
            :value="query.q"
            @input="handleSearch(($event.target as HTMLInputElement).value)"
            placeholder="Cari course..."
            class="px-3 py-2 border rounded w-full md:w-72"
          />
        </div>

        <div v-if="isLoading" class="p-8 text-center text-gray-600">
          Memuat data...
        </div>

        <div v-else-if="isError" class="p-8 text-center text-red-600">
          Gagal memuat data courses.
        </div>

        <div v-else class="p-4">

          <div class="grid gap-4 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            <CardCourses
              v-for="course in courses"
              :key="course.id"
              :data="course"
            />
          </div>

          <div
            v-if="courses.length === 0"
            class="text-center text-gray-500 py-10"
          >
            Tidak ada data course.
          </div>

          <div
            v-if="metaData.totalPages > 1"
            class="mt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          >

            <div class="text-sm text-gray-600">
              Halaman {{ metaData.page }} dari {{ metaData.totalPages }}
              • Total {{ metaData.totalItems }} data
            </div>

            <select
              :value="metaData.perPage"
              @change="handlePerPageChange(Number(($event.target as HTMLSelectElement).value))"
              class="border rounded px-2 py-1"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>

            <div class="flex items-center gap-1">

              <button
                :disabled="metaData.page === 1"
                @click="handlePageChange(metaData.page - 1)"
                class="px-3 py-1 border rounded disabled:opacity-40"
              >
                Prev
              </button>

              <button
                v-for="p in pages"
                :key="p"
                @click="handlePageChange(p)"
                :class="[
                  'px-3 py-1 border rounded',
                  p === metaData.page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white'
                ]"
              >
                {{ p }}
              </button>

              <button
                :disabled="metaData.page === metaData.totalPages"
                @click="handlePageChange(metaData.page + 1)"
                class="px-3 py-1 border rounded disabled:opacity-40"
              >
                Next
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  </DashboardLayout>
</template>