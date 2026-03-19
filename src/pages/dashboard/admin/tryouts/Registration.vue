<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import { TryoutRegistrationService } from '../../../../services/tryouts.registration'
import { computed, ref } from 'vue'
import TryoutRegistrationTable from '../../../../components/dashboard/admin/tryouts/TryoutRegistrationTable.vue'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'

const route = useRoute()
const tryoutId = Number(route.params.id)

const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ['tryout-registration', tryoutId],
  queryFn: async () => {
    const res = await TryoutRegistrationService.getRegistration(tryoutId)
    return res.data
  },
})

const tryoutRegistration = computed(() => data.value ?? [])

const rejectModal = ref<{ visible: boolean; id: number | null; reason: string }>({
  visible: false,
  id: null,
  reason: '',
})

const approveMutation = useMutation({
  mutationFn: (id: number) => TryoutRegistrationService.approvePayment(id),
  onSuccess: () => {
    refetch()
    toast.success('Pembayaran disetujui')
  },
  onError: (err: any) => {
    toast.error(err?.response?.data?.message ?? 'Gagal menyetujui pembayaran')
  },
})

const rejectMutation = useMutation({
  mutationFn: ({ id, reason }: { id: number; reason: string }) =>
    TryoutRegistrationService.rejectPayment(id, reason),
  onSuccess: () => {
    refetch()
    rejectModal.value = { visible: false, id: null, reason: '' }
    toast.success('Pembayaran ditolak')
  },
  onError: (err: any) => {
    toast.error(err?.response?.data?.message ?? 'Gagal menolak pembayaran')
  },
})

function handleApprove(id: number) {
  approveMutation.mutate(id)
}

function handleReject(id: number) {
  rejectModal.value = { visible: true, id, reason: '' }
}

function submitReject() {
  if (rejectModal.value.id !== null) {
    rejectMutation.mutate({ id: rejectModal.value.id, reason: rejectModal.value.reason })
  }
}
</script>

<template>
  <DashboardLayout>
    <div class="backdrop-blur min-h-screen px-4 py-6">
      <div class="bg-white/20 rounded-lg shadow overflow-hidden relative">
        <RouterLink
          to="/dashboard/admin/tryouts"
          class="group absolute left-4 top-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 hover:text-primary hover:bg-primary/10 transition-all"
        >
          <Icon icon="heroicons:chevron-left" class="text-xl" />
          <span class="text-sm font-medium hidden sm:inline">Back</span>
        </RouterLink>

        <h1 class="text-2xl font-bold p-4 text-gray-800 text-center">
          Daftar Registrasi Tryout
        </h1>

        <div class="p-4">
          <div v-if="isLoading" class="p-8 text-center text-gray-600">Memuat data...</div>
          <div v-else-if="isError" class="p-8 text-center text-red-600">Gagal memuat data registrasi.</div>
          <div v-else-if="tryoutRegistration.length === 0" class="p-12 text-center text-gray-500">
            Belum ada peserta yang mendaftar pada tryout ini.
          </div>
          <div v-else>
            <TryoutRegistrationTable
              :registrations="tryoutRegistration"
              @approve="handleApprove"
              @reject="handleReject"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div
      v-if="rejectModal.visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h2 class="text-lg font-semibold mb-4">Tolak Pembayaran</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Alasan Penolakan
          </label>
          <textarea
            v-model="rejectModal.reason"
            rows="3"
            placeholder="Masukkan alasan penolakan..."
            class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div class="flex justify-end gap-2">
          <button
            @click="rejectModal = { visible: false, id: null, reason: '' }"
            class="px-4 py-2 rounded-md bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button
            @click="submitReject"
            :disabled="rejectMutation.isPending.value"
            class="px-4 py-2 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            Tolak
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
