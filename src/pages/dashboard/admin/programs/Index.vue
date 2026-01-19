<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { ProgramService } from '../../../../services/program'
import ProgramTable from '../../../../components/dashboard/admin/programs/ProgramTable.vue'
import { computed } from 'vue'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'

const { data, isLoading, isError } = useQuery({
  queryKey: ['programs'],
  queryFn: ProgramService.findAll,
})

const programs = computed(() => data.value?.data || [])

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
                <ProgramTable :programs="programs" />
            </div>
            </div>
        </div>
    </DashboardLayout>
</template>
