<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import { TryoutRegistrationService } from '../../../../services/tryouts.registration'
import { computed, ref } from 'vue'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import { Icon } from '@iconify/vue'
import { Image } from '@unpic/vue'
import { toast } from 'vue3-toastify'
import type { TryOutRegistration } from '../../../../types/entites/tryout.registration'

const route = useRoute()
const tryoutId = Number(route.params.id)

const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ['tryout-registration', tryoutId],
  queryFn: async () => {
    const res = await TryoutRegistrationService.getRegistration(tryoutId)
    return res.data
  },
})

const registrations = computed(() => data.value ?? [])

// Stats
const totalCount = computed(() => registrations.value.length)
const approvedCount = computed(() => registrations.value.filter(r => r.paymentStatus === 'approved').length)
const pendingCount = computed(() => registrations.value.filter(r => r.paymentStatus === 'pending').length)
const rejectedCount = computed(() => registrations.value.filter(r => r.paymentStatus === 'rejected').length)

// Search & filter
const search = ref('')
const statusFilter = ref<'all' | 'pending' | 'approved' | 'rejected'>('all')

const filtered = computed(() => {
  let list = registrations.value
  if (statusFilter.value !== 'all') list = list.filter(r => r.paymentStatus === statusFilter.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(r =>
      r.user?.username?.toLowerCase().includes(q) ||
      r.user?.email?.toLowerCase().includes(q)
    )
  }
  return list
})

// Detail modal
const detailModal = ref<{ visible: boolean; reg: TryOutRegistration | null }>({ visible: false, reg: null })
function openDetail(reg: TryOutRegistration) {
  detailModal.value = { visible: true, reg }
}

// Reject modal
const rejectModal = ref<{ visible: boolean; id: number | null; reason: string }>({
  visible: false, id: null, reason: '',
})

const approveMutation = useMutation({
  mutationFn: (id: number) => TryoutRegistrationService.approvePayment(id),
  onSuccess: () => { refetch(); toast.success('Pembayaran disetujui') },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal menyetujui'),
})

const rejectMutation = useMutation({
  mutationFn: ({ id, reason }: { id: number; reason: string }) =>
    TryoutRegistrationService.rejectPayment(id, reason),
  onSuccess: () => {
    refetch()
    rejectModal.value = { visible: false, id: null, reason: '' }
    toast.success('Pembayaran ditolak')
  },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal menolak'),
})

const deleteMutation = useMutation({
  mutationFn: (id: number) => TryoutRegistrationService.deleteRegistration(id),
  onSuccess: () => {
    refetch()
    detailModal.value = { visible: false, reg: null }
    toast.success('Registrasi dihapus')
  },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal menghapus'),
})

function handleApprove(id: number) { approveMutation.mutate(id) }
function handleReject(id: number) { rejectModal.value = { visible: true, id, reason: '' } }
function submitReject() {
  if (rejectModal.value.id !== null)
    rejectMutation.mutate({ id: rejectModal.value.id, reason: rejectModal.value.reason })
}
function handleDelete(id: number) {
  if (confirm('Hapus registrasi ini?')) deleteMutation.mutate(id)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const statusStyle: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  rejected: 'bg-red-100 text-red-700',
}
const statusLabel: Record<string, string> = {
  approved: 'Approved', pending: 'Pending', rejected: 'Rejected',
}
</script>

<template>
  <DashboardLayout>
    <div class="min-h-screen px-4 py-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <RouterLink
          to="/dashboard/admin/tryouts"
          class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors"
        >
          <Icon icon="heroicons:chevron-left" class="text-xl" />
        </RouterLink>
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Registrasi Tryout</h1>
          <p class="text-sm text-gray-400">Kelola semua pendaftar tryout ini</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl border p-4 text-center">
          <p class="text-2xl font-bold text-gray-800">{{ totalCount }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Total</p>
        </div>
        <div class="bg-green-50 rounded-xl border border-green-100 p-4 text-center">
          <p class="text-2xl font-bold text-green-600">{{ approvedCount }}</p>
          <p class="text-xs text-green-500 mt-0.5">Approved</p>
        </div>
        <div class="bg-amber-50 rounded-xl border border-amber-100 p-4 text-center">
          <p class="text-2xl font-bold text-amber-600">{{ pendingCount }}</p>
          <p class="text-xs text-amber-500 mt-0.5">Pending</p>
        </div>
        <div class="bg-red-50 rounded-xl border border-red-100 p-4 text-center">
          <p class="text-2xl font-bold text-red-600">{{ rejectedCount }}</p>
          <p class="text-xs text-red-400 mt-0.5">Rejected</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl border p-4 flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="search"
            type="text"
            placeholder="Cari nama / email peserta..."
            class="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div class="flex gap-2">
          <button
            v-for="f in [{ key: 'all', label: 'Semua' }, { key: 'pending', label: 'Pending' }, { key: 'approved', label: 'Approved' }, { key: 'rejected', label: 'Rejected' }]"
            :key="f.key"
            @click="statusFilter = f.key as any"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              statusFilter === f.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >{{ f.label }}</button>
        </div>
      </div>

      <!-- Loading / Error / Empty -->
      <div v-if="isLoading" class="bg-white rounded-xl border p-12 text-center text-gray-400 animate-pulse">
        Memuat data...
      </div>
      <div v-else-if="isError" class="bg-white rounded-xl border p-12 text-center text-red-500">
        Gagal memuat data registrasi.
      </div>
      <div v-else-if="filtered.length === 0" class="bg-white rounded-xl border p-12 text-center text-gray-400 space-y-2">
        <Icon icon="mdi:account-off-outline" class="text-5xl mx-auto" />
        <p>Tidak ada registrasi ditemukan.</p>
      </div>

      <!-- Table -->
      <div v-else class="bg-white rounded-xl border overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">No</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Peserta</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Bukti Bayar</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tanggal Daftar</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(reg, i) in filtered" :key="reg.id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-4 py-3 text-sm text-gray-500">{{ i + 1 }}</td>
                <td class="px-4 py-3">
                  <div>
                    <p class="text-sm font-semibold text-gray-800">{{ reg.user?.username ?? '-' }}</p>
                    <p class="text-xs text-gray-400">{{ reg.user?.email ?? '' }}</p>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <a
                    v-if="reg.paymentProofUrl"
                    :href="reg.paymentProofUrl"
                    target="_blank"
                    class="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Icon icon="mdi:image-outline" />
                    Lihat Bukti
                  </a>
                  <span v-else class="text-xs text-gray-300">—</span>
                </td>
                <td class="px-4 py-3">
                  <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold', statusStyle[reg.paymentStatus]]">
                    {{ statusLabel[reg.paymentStatus] ?? reg.paymentStatus }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs text-gray-500">{{ formatDate(reg.registeredAt) }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <button @click="openDetail(reg)" class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Detail">
                      <Icon icon="mdi:eye-outline" width="18" />
                    </button>
                    <button
                      v-if="reg.paymentStatus === 'pending'"
                      @click="handleApprove(reg.id)"
                      :disabled="approveMutation.isPending.value"
                      class="p-1.5 rounded-lg hover:bg-green-50 text-green-500 transition-colors disabled:opacity-50"
                      title="Approve"
                    >
                      <Icon icon="mdi:check-circle-outline" width="18" />
                    </button>
                    <button
                      v-if="reg.paymentStatus === 'pending'"
                      @click="handleReject(reg.id)"
                      class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      title="Reject"
                    >
                      <Icon icon="mdi:close-circle-outline" width="18" />
                    </button>
                    <button
                      @click="handleDelete(reg.id)"
                      :disabled="deleteMutation.isPending.value"
                      class="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors disabled:opacity-50"
                      title="Hapus"
                    >
                      <Icon icon="mdi:delete-outline" width="18" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="detailModal.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div class="flex items-center justify-between p-5 border-b">
          <h2 class="text-lg font-bold text-gray-800">Detail Registrasi</h2>
          <button @click="detailModal.visible = false" class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <Icon icon="mdi:close" />
          </button>
        </div>
        <div v-if="detailModal.reg" class="p-5 space-y-4">
          <!-- User info -->
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {{ detailModal.reg.user?.username?.[0]?.toUpperCase() ?? '?' }}
            </div>
            <div>
              <p class="font-semibold text-gray-800">{{ detailModal.reg.user?.username }}</p>
              <p class="text-xs text-gray-400">{{ detailModal.reg.user?.email }}</p>
            </div>
          </div>

          <!-- Status -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Status Pembayaran</span>
            <span :class="['px-3 py-1 rounded-full text-xs font-semibold', statusStyle[detailModal.reg.paymentStatus]]">
              {{ statusLabel[detailModal.reg.paymentStatus] }}
            </span>
          </div>

          <!-- Rejection reason -->
          <div v-if="detailModal.reg.rejectionReason" class="p-3 bg-red-50 rounded-xl border border-red-100">
            <p class="text-xs font-semibold text-red-600 mb-1">Alasan Penolakan</p>
            <p class="text-sm text-red-700">{{ detailModal.reg.rejectionReason }}</p>
          </div>

          <!-- Dates -->
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-xs text-gray-400">Tanggal Daftar</p>
              <p class="font-medium text-gray-700">{{ formatDate(detailModal.reg.registeredAt) }}</p>
            </div>
            <div v-if="detailModal.reg.approvedAt">
              <p class="text-xs text-gray-400">Disetujui Pada</p>
              <p class="font-medium text-gray-700">{{ formatDate(detailModal.reg.approvedAt as string) }}</p>
            </div>
          </div>

          <!-- Payment proof -->
          <div v-if="detailModal.reg.paymentProofUrl">
            <p class="text-xs text-gray-400 mb-2">Bukti Pembayaran</p>
            <a :href="detailModal.reg.paymentProofUrl" target="_blank">
              <Image
                :src="detailModal.reg.paymentProofUrl"
                alt="Bukti Pembayaran"
                class="w-full max-h-64 object-contain rounded-xl border"
              />
            </a>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 pt-2">
            <button
              v-if="detailModal.reg.paymentStatus === 'pending'"
              @click="handleApprove(detailModal.reg.id); detailModal.visible = false"
              class="flex-1 py-2.5 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
            >
              Approve
            </button>
            <button
              v-if="detailModal.reg.paymentStatus === 'pending'"
              @click="handleReject(detailModal.reg.id); detailModal.visible = false"
              class="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
            >
              Reject
            </button>
            <button
              @click="handleDelete(detailModal.reg.id)"
              class="px-4 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              <Icon icon="mdi:delete-outline" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="rejectModal.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 class="text-lg font-bold mb-4 text-gray-800">Tolak Pembayaran</h2>
        <textarea
          v-model="rejectModal.reason"
          rows="3"
          placeholder="Masukkan alasan penolakan..."
          class="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 mb-4"
        />
        <div class="flex justify-end gap-2">
          <button
            @click="rejectModal = { visible: false, id: null, reason: '' }"
            class="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors"
          >Batal</button>
          <button
            @click="submitReject"
            :disabled="rejectMutation.isPending.value"
            class="px-4 py-2 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
          >Tolak</button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
