<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query'
import { ProgramService } from '../../../../services/program'
import ProgramTable from '../../../../components/dashboard/admin/programs/ProgramTable.vue'
import { computed } from 'vue'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'

const router = useRouter()

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
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to delete program')
    }
})

const handleDelete=async(id:number)=>{
    if(confirm('Apakah Anda yakin ingin menghapus program ini?')) {
        mutate.mutate(id)
    }
}

const handleView = (id: number) => {
  router.push(`/dashboard/admin/programs/view/${id}`)
}

const handleUpdate = (id: number) => {
  router.push(`/dashboard/admin/programs/update/${id}`)
}
</script>

<template>
    <DashboardLayout>
        <div class="backdrop-blur px-4">
            <div class="bg-white/20 rounded-lg shadow overflow-hidden">
            <h1 class="text-2xl font-bold p-4 text-gray-800">Daftar Programs</h1>

            <div v-if="isLoading" class="p-8 text-center text-gray-600">
                Memuat data...
            </div>

            <div v-else-if="isError" class="p-8 text-center text-red-600">
                Gagal memuat data program.
            </div>

            <div v-else>
                <ProgramTable 
                    :programs="programs" 
                    @delete="handleDelete" 
                    @view="handleView"
                    @update="handleUpdate"
                />
            </div>
            </div>
        </div>
    </DashboardLayout>
</template>
