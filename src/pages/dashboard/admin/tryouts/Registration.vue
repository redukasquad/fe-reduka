<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import { TryoutRegistrationService } from '../../../../services/tryouts.registration'
import { computed } from 'vue'
import TryoutRegistrationTable from '../../../../components/dashboard/admin/tryouts/TryoutRegistrationTable.vue'

const route = useRoute()
const tryoutId = Number(route.params.id)

const { data, isLoading, isError } = useQuery({
  queryKey: ['tryout-registration', tryoutId],
  queryFn: async () => {
    const res = await TryoutRegistrationService.getRegistration(tryoutId)
    return res.data
  },
})

const tryoutRegistration = computed(() => data.value ?? [])

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
          Daftar Registrasi Tryout
        </h1>

        <div v-if="isLoading" class="p-8 text-center text-gray-600">
          Memuat data...
        </div>

        <div v-else-if="isError" class="p-8 text-center text-red-600">
          Gagal memuat data registrasi.
        </div>

        <div
          v-else-if="tryoutRegistration.length === 0"
          class="p-12 text-center text-gray-500"
        >
          Belum ada peserta yang mendaftar pada tryout ini.
        </div>

        <div v-else>
          <TryoutRegistrationTable
            :registrations="tryoutRegistration"
            @view="handleView"
            @approve="handleApprove"
            @reject="handleReject"
          />
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>