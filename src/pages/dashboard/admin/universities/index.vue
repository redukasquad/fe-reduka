<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from '../../../../composables/useToast'
import UniList from '../../../../components/dashboard/admin/universities/UniList.vue'
import MajorsPanel from '../../../../components/dashboard/admin/universities/MajorsPanel.vue'
import UsersPanel from '../../../../components/dashboard/admin/universities/UsersPanel.vue'
import UniModal from '../../../../components/dashboard/admin/universities/UniModal.vue'
import MajorModal from '../../../../components/dashboard/admin/universities/MajorModal.vue'
import ToastNotification from '../../../../components/dashboard/user/ToastNotification.vue'
import type { University, UniversityMajor } from '../../../../types/entites/university'
import api from '../../../../services/api'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'

const qc = useQueryClient()
const toast = useToast()

// ── State ─────────────────────────────────────────────────────────────────────
const selectedUni = ref<University | null>(null)
const activePanel = ref<'majors' | 'users'>('majors')

// University modal
const showUniModal = ref(false)
const editingUni = ref<University | null>(null)

// Major modal
const showMajorModal = ref(false)
const editingMajor = ref<UniversityMajor | null>(null)
const majorModalUniId = ref(0)

// Delete confirm
const deleteTarget = ref<{ type: 'uni' | 'major'; id: number } | null>(null)

// ── Handlers ──────────────────────────────────────────────────────────────────
function onCreateUni() { editingUni.value = null; showUniModal.value = true }
function onEditUni(u: University) { editingUni.value = u; showUniModal.value = true }
function onSelectUni(u: University) {
  // normalize: handle both lowercase id (new DTO) and uppercase ID (legacy)
  const normalized = { ...u, id: u.id ?? (u as any).ID }
  selectedUni.value = normalized
  activePanel.value = 'majors'
}

function onCreateMajor() {
  editingMajor.value = null
  majorModalUniId.value = selectedUni.value?.id ?? 0
  showMajorModal.value = true
}
function onEditMajor(m: UniversityMajor) {
  editingMajor.value = m
  majorModalUniId.value = m.universityId ?? (m as any).UniversityID ?? selectedUni.value?.id ?? 0
  showMajorModal.value = true
}

const { mutate: deleteUni } = useMutation({
  mutationFn: (id: number) => api.delete(`/universities/${id}`),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['admin-universities'] })
    if (selectedUni.value?.id === deleteTarget.value?.id) selectedUni.value = null
    toast.success('Universitas dihapus.')
  },
  onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Gagal menghapus.'),
})

const { mutate: deleteMajor } = useMutation({
  mutationFn: (id: number) => api.delete(`/majors/${id}`),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['admin-majors', selectedUni.value?.id] })
    toast.success('Jurusan dihapus.')
  },
  onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Gagal menghapus jurusan.'),
})

function doDelete() {
  if (!deleteTarget.value) return
  if (deleteTarget.value.type === 'uni') deleteUni(deleteTarget.value.id)
  else deleteMajor(deleteTarget.value.id)
  deleteTarget.value = null
}

const typeColor = (t: string) => ({
  PTN: 'bg-blue-100 text-blue-700',
  PTS: 'bg-amber-100 text-amber-700',
  PTK: 'bg-violet-100 text-violet-700',
}[t] ?? 'bg-gray-100 text-gray-600')
</script>

<template>
  <DashboardLayout class="p-6 space-y-5">
    <!-- Header -->
    <div>
      <h1 class="text-xl font-extrabold text-gray-900">Manajemen Universitas</h1>
      <p class="text-sm text-gray-500 mt-0.5">Kelola data universitas, jurusan, dan target siswa</p>
    </div>

    <div class="flex gap-5 items-start">
      <!-- List -->
      <div class="w-72 shrink-0">
        <UniList
          :selected-id="selectedUni?.id"
          @select="onSelectUni"
          @create="onCreateUni"
          @edit="onEditUni"
          @delete="(id) => { deleteTarget = { type: 'uni', id } }"
        />
      </div>

      <!-- Detail -->
      <div class="flex-1 min-w-0">
        <div v-if="!selectedUni" class="bg-white rounded-2xl border border-gray-100 py-24 text-center">
          <div class="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-3">
            <Icon icon="mdi:domain" class="text-3xl text-primary/30" />
          </div>
          <p class="text-sm font-semibold text-gray-400">Pilih universitas untuk melihat detail</p>
        </div>

        <div v-else class="space-y-4">
          <!-- Uni header card -->
          <div class="bg-white rounded-2xl border border-gray-100 p-5">
            <div class="flex items-center gap-4">
              <div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon icon="mdi:domain" class="text-primary text-lg" />
              </div>
              <div class="flex-1 min-w-0">
                <h2 class="font-extrabold text-gray-900">{{ selectedUni.name }}</h2>
                <div class="flex items-center gap-2 mt-0.5">
                  <span :class="['text-xs font-bold px-2 py-0.5 rounded-full', typeColor(selectedUni.type)]">{{ selectedUni.type }}</span>
                </div>
              </div>
              <button @click="onEditUni(selectedUni)"
                class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <Icon icon="mdi:pencil-outline" /> Edit
              </button>
            </div>
          </div>

          <!-- Tabs -->
          <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div class="flex border-b border-gray-100">
              <button @click="activePanel = 'majors'"
                :class="['flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold transition-all border-b-2', activePanel === 'majors' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:bg-gray-50']">
                <Icon icon="mdi:book-education-outline" /> Jurusan
              </button>
              <button @click="activePanel = 'users'"
                :class="['flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold transition-all border-b-2', activePanel === 'users' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:bg-gray-50']">
                <Icon icon="mdi:account-multiple-outline" /> Siswa Terdaftar
              </button>
            </div>
            <div class="p-4">
              <MajorsPanel
                v-if="activePanel === 'majors'"
                :university-id="selectedUni.id"
                @create="onCreateMajor"
                @edit="onEditMajor"
                @delete="(id) => { deleteTarget = { type: 'major', id } }"
              />
              <UsersPanel v-else :university-id="selectedUni.id" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <UniModal v-model:open="showUniModal" :editing="editingUni" />
    <MajorModal
      v-model:open="showMajorModal"
      :editing="editingMajor"
      :university-id="majorModalUniId"
    />

    <!-- Delete confirm -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="deleteTarget = null" />
          <div class="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center">
            <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:alert-outline" class="text-red-500 text-2xl" />
            </div>
            <h3 class="font-bold text-gray-900 mb-1">
              Hapus {{ deleteTarget.type === 'uni' ? 'Universitas' : 'Jurusan' }}?
            </h3>
            <p class="text-sm text-gray-500 mb-5">Tindakan ini tidak dapat dibatalkan.</p>
            <div class="flex gap-2">
              <button @click="deleteTarget = null"
                class="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button @click="doDelete()"
                class="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <ToastNotification />
  </DashboardLayout>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
