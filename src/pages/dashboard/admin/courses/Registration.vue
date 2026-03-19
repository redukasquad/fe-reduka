<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import CourseRegistrationTable from '../../../../components/dashboard/admin/courses/CourseRegistrationTable.vue'
import { CourseRegistrationService } from '../../../../services/course.registration'
import type { CourseRegistration } from '../../../../types/entites/courseRegistration'

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()
const courseId = Number(route.params.id)

const { data, isLoading, isError } = useQuery({
  queryKey: ['course-registration', courseId],
  queryFn: async () => {
    const res = await CourseRegistrationService.getRegistration(courseId)
    return res.data
  },
})

const courseRegistrations = computed(() => data.value ?? [])

// Stats
const totalCount = computed(() => courseRegistrations.value.length)
const pendingCount = computed(() => courseRegistrations.value.filter(r => r.status === 'pending').length)
const approvedCount = computed(() => courseRegistrations.value.filter(r => r.status === 'approved').length)
const rejectedCount = computed(() => courseRegistrations.value.filter(r => r.status === 'rejected').length)

// Detail modal
const selectedReg = ref<CourseRegistration | null>(null)
const showDetail = ref(false)

function handleView(id: number) {
  selectedReg.value = courseRegistrations.value.find(r => r.id === id) ?? null
  showDetail.value = true
}

const mutation = useMutation({
  mutationFn: ({ id, action }: { id: number; action: 'APPROVE' | 'REJECT' }) =>
    action === 'APPROVE'
      ? CourseRegistrationService.approve(id)
      : CourseRegistrationService.reject(id),
  onSuccess: (_, { action }) => {
    toast.success(action === 'APPROVE' ? 'Pendaftaran disetujui' : 'Pendaftaran ditolak')
    queryClient.invalidateQueries({ queryKey: ['course-registration', courseId] })
  },
  onError: () => toast.error('Gagal memproses pendaftaran'),
})

function handleApprove(id: number) {
  mutation.mutate({ id, action: 'APPROVE' })
}

function handleReject(id: number) {
  mutation.mutate({ id, action: 'REJECT' })
}
</script>

<template>
  <DashboardLayout>
    <div class="py-6 px-4 md:px-8 space-y-6">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <button
          @click="router.back()"
          class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          <Icon icon="mdi:chevron-left" class="text-lg" />
          Kembali
        </button>
        <h1 class="text-xl font-bold text-gray-800">Daftar Registrasi Kursus</h1>
        <div class="w-20" />
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="bg-white rounded-xl border p-4 text-center">
          <p class="text-2xl font-bold text-gray-800">{{ totalCount }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Total</p>
        </div>
        <div class="bg-yellow-50 rounded-xl border border-yellow-100 p-4 text-center">
          <p class="text-2xl font-bold text-yellow-600">{{ pendingCount }}</p>
          <p class="text-xs text-yellow-500 mt-0.5">Menunggu</p>
        </div>
        <div class="bg-green-50 rounded-xl border border-green-100 p-4 text-center">
          <p class="text-2xl font-bold text-green-600">{{ approvedCount }}</p>
          <p class="text-xs text-green-500 mt-0.5">Disetujui</p>
        </div>
        <div class="bg-red-50 rounded-xl border border-red-100 p-4 text-center">
          <p class="text-2xl font-bold text-red-500">{{ rejectedCount }}</p>
          <p class="text-xs text-red-400 mt-0.5">Ditolak</p>
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div v-if="isLoading" class="p-10 text-center text-gray-500">Memuat data...</div>
        <div v-else-if="isError" class="p-10 text-center text-red-500">Gagal memuat data registrasi.</div>
        <div v-else-if="courseRegistrations.length === 0" class="p-14 text-center text-gray-400">
          <Icon icon="mdi:account-off-outline" class="text-5xl mb-2" />
          <p>Belum ada peserta yang mendaftar.</p>
        </div>
        <CourseRegistrationTable
          v-else
          :registrations="courseRegistrations"
          @view="handleView"
          @approve="handleApprove"
          @reject="handleReject"
        />
      </div>

    </div>

    <!-- Detail Modal -->
    <Dialog v-model:visible="showDetail" modal header="Detail Registrasi" :style="{ width: '560px' }">
      <div v-if="selectedReg" class="space-y-4 pt-2">
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p class="text-gray-400 text-xs mb-0.5">Nama</p>
            <p class="font-medium">{{ selectedReg.userName ?? '-' }}</p>
          </div>
          <div>
            <p class="text-gray-400 text-xs mb-0.5">Email</p>
            <p class="font-medium">{{ selectedReg.userEmail ?? '-' }}</p>
          </div>
          <div>
            <p class="text-gray-400 text-xs mb-0.5">Kursus</p>
            <p class="font-medium">{{ selectedReg.courseName ?? '-' }}</p>
          </div>
          <div>
            <p class="text-gray-400 text-xs mb-0.5">Program</p>
            <p class="font-medium">{{ selectedReg.programName ?? '-' }}</p>
          </div>
          <div>
            <p class="text-gray-400 text-xs mb-0.5">Status</p>
            <span
              :class="{
                'bg-yellow-100 text-yellow-700': selectedReg.status === 'pending',
                'bg-green-100 text-green-700': selectedReg.status === 'approved',
                'bg-red-100 text-red-600': selectedReg.status === 'rejected',
              }"
              class="px-2 py-0.5 rounded-full text-xs font-semibold"
            >
              {{ selectedReg.status }}
            </span>
          </div>
          <div>
            <p class="text-gray-400 text-xs mb-0.5">Tanggal Daftar</p>
            <p class="font-medium">{{ new Date(selectedReg.createdAt).toLocaleDateString('id-ID') }}</p>
          </div>
        </div>

        <div v-if="selectedReg.answers?.length">
          <p class="text-xs text-gray-400 mb-2">Jawaban Registrasi</p>
          <div class="space-y-2">
            <div
              v-for="ans in selectedReg.answers"
              :key="ans.questionId"
              class="bg-gray-50 rounded-lg p-3 text-sm"
            >
              <p class="text-gray-500 text-xs mb-1">{{ ans.questionText }}</p>
              <p class="font-medium text-gray-800">{{ ans.answerText }}</p>
            </div>
          </div>
        </div>
        <p v-else class="text-sm text-gray-400 italic">Tidak ada jawaban registrasi.</p>
      </div>
    </Dialog>
  </DashboardLayout>
</template>
