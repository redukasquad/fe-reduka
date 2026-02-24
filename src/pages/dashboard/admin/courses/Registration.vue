<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { CourseRegistrationService } from '../../../../services/course.registration'
import CourseRegistrationTable from '../../../../components/dashboard/admin/courses/CourseRegistrationTable.vue'

const route = useRoute()
const courseId = Number(route.params.id)

const { data, isLoading, isError } = useQuery({
  queryKey: ['course-registration', courseId],
  queryFn: async () => {
    const res = await CourseRegistrationService.getRegistration(courseId)
    return res.data
  },
})

const courseRegistrations = computed(() => data.value ?? [])

function handleView(id: number) {
  console.log('view', id)
}

function handleApprove(id: number) {
  console.log('approve', id)
}

function handleReject(id: number) {
  console.log('reject', id)
}
</script>

<template>
  <DashboardLayout>
    <div class="backdrop-blur min-h-screen px-4">
      <div class="bg-white/20 rounded-lg shadow overflow-hidden">

        <h1 class="text-2xl font-bold p-4 text-gray-800">
          Daftar Registrasi Kursus
        </h1>

        <!-- Loading -->
        <div v-if="isLoading" class="p-8 text-center text-gray-600">
          Memuat data...
        </div>

        <!-- Error -->
        <div v-else-if="isError" class="p-8 text-center text-red-600">
          Gagal memuat data registrasi.
        </div>

        <!-- Empty -->
        <div
          v-else-if="courseRegistrations.length === 0"
          class="p-12 text-center text-gray-500"
        >
          Belum ada peserta yang mendaftar pada kursus ini.
        </div>

        <!-- Table -->
        <div v-else>
          <CourseRegistrationTable
            :registrations="courseRegistrations"
            @view="handleView"
            @approve="handleApprove"
            @reject="handleReject"
          />
        </div>

      </div>
    </div>
  </DashboardLayout>
</template>