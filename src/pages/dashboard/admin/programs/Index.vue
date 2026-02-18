<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query'
import { ProgramService } from '../../../../services/program'
import ProgramTable from '../../../../components/dashboard/admin/programs/ProgramTable.vue'
import { computed } from 'vue'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import { toast } from 'vue3-toastify'

const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ['programs'],
  queryFn: ProgramService.findAll,
})

const programs = computed(() => data.value?.data || [])

const mutate=useMutation({
    mutationFn:async(id:number)=>{
        await ProgramService.delete(id)
    },
    onSuccess:()=>{
        refetch()
        toast.success('Successfully deleted')
    }
})

const handleDelete=async(id:number)=>{
    mutate.mutate(id)
}
</script>

<template>
    <DashboardLayout>
        <div class="backdrop-blur px-4">
            <div class="bg-white rounded-lg shadow overflow-hidden">
            <h1 class="text-2xl font-bold p-4 text-gray-800">Daftar Programs</h1>

            <div v-if="isLoading" class="p-8 text-center text-gray-600">
                Memuat data...
            </div>

            <div v-else-if="isError" class="p-8 text-center text-red-600">
                Gagal memuat data program.
            </div>

            <div v-else>
                <ProgramTable :programs="programs" @delete="handleDelete" />
            </div>
            </div>
        </div>
    </DashboardLayout>
</template>
