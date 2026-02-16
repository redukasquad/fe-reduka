<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import { CourseService } from '../../../../services/course'
import CoursesTable from '../../../../components/dashboard/admin/courses/CourseTable.vue'
import type { Course } from '../../../../types/entites/course'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ['courses'],
  queryFn: CourseService.findAll,
})



const courses = computed(() => data.value?.data || [])
const router=useRouter()

const courseMutation=useMutation({
    mutationFn:async(id:number)=>{
        await CourseService.delete(id)
    },
    onSuccess: () => {

        refetch()

        toast('Sucessfully deleted', {
            type:'success'
        })
    },
})


const handleView = (course: Course) => {
    router.push({ name: 'admin-courses-view', params: { id: course.id } })
}

const handleDelete=(id:number)=>{
 courseMutation.mutate(id)
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
                <CoursesTable @view="handleView" @delete="handleDelete"  :courses="courses" />
            </div>
            </div>
        </div>
    </DashboardLayout>
</template>
