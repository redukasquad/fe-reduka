<script setup lang="ts">
import { useMutation, useQuery, keepPreviousData } from '@tanstack/vue-query'
import { computed, reactive, watch } from 'vue'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import { CourseService } from '../../../../services/course'
import CoursesTable from '../../../../components/dashboard/admin/courses/CourseTable.vue'
import type { Course } from '../../../../types/entites/course'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'

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

const handleView = (course: Course) => {
  router.push({ name: 'admin-courses-view', params: { id: course.id } })
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

const handleSearch = (q: string) => {
  query.q = q
  query.page = 1
  refetch()

}
</script>

<template>
  <DashboardLayout>
    <div class="backdrop-blur min-h-screen px-4">
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <h1 class="text-2xl font-bold p-4 text-gray-800">Daftar Courses</h1>

        <div v-if="isLoading" class="p-8 text-center text-gray-600">
          Memuat data...
        </div>

        <div v-else-if="isError" class="p-8 text-center text-red-600">
          Gagal memuat data program.
        </div>

        <div v-else>
          <CoursesTable
            :courses="courses"
            :meta="metaData"
            :q="query.q"
            @view="handleView"
            @delete="handleDelete"
            @page-change="handlePageChange"
            @per-page-change="handlePerPageChange"
            @search="handleSearch"
          />
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
