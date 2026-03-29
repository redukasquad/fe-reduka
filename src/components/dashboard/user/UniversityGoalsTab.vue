<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { UniversityService, UserTargetService } from '../../../services/university'
import { useToast } from '../../../composables/useToast'
import type { University, UniversityMajor } from '../../../types/entites/university'

const qc = useQueryClient()
const toast = useToast()

// ── My targets ────────────────────────────────────────────────────────────────
const { data: targetsData, isLoading: loadingTargets } = useQuery({
  queryKey: ['my-targets'],
  queryFn: () => UserTargetService.getMyTargets(),
  staleTime: 1000 * 60,
})
const targets = computed(() => targetsData.value?.data ?? [])

const { mutate: removeTarget, isPending: removing } = useMutation({
  mutationFn: (id: number) => UserTargetService.deleteTarget(id),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['my-targets'] })
    toast.success('Target dihapus.')
  },
  onError: () => toast.error('Gagal menghapus target.'),
})

// ── Add target flow ───────────────────────────────────────────────────────────
const showPicker = ref(false)
const searchQ = ref('')
const selectedUni = ref<University | null>(null)
const selectedMajor = ref<UniversityMajor | null>(null)
const priority = ref(1)

const { data: unisData, isLoading: loadingUnis } = useQuery({
  queryKey: computed(() => ['universities', searchQ.value]),
  queryFn: () => UniversityService.findAll(searchQ.value),
  staleTime: 1000 * 60 * 5,
  enabled: computed(() => showPicker.value),
})
const universities = computed(() => unisData.value?.data ?? [])

const { data: majorsData, isLoading: loadingMajors } = useQuery({
  queryKey: computed(() => ['majors', selectedUni.value?.id]),
  queryFn: () => UniversityService.getMajors(selectedUni.value!.id),
  enabled: computed(() => !!selectedUni.value),
  staleTime: 1000 * 60 * 5,
})
const majors = computed(() => majorsData.value?.data ?? [])

watch(selectedUni, () => { selectedMajor.value = null })

const { mutate: addTarget, isPending: adding } = useMutation({
  mutationFn: () => UserTargetService.addTarget(selectedMajor.value!.id, priority.value),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['my-targets'] })
    toast.success('Target universitas ditambahkan!')
    showPicker.value = false
    selectedUni.value = null
    selectedMajor.value = null
    priority.value = 1
    searchQ.value = ''
  },
  onError: (e: any) => toast.error(e?.response?.data?.error ?? 'Gagal menambahkan target.'),
})

const typeColor = (type: string) => ({ PTN: 'bg-blue-100 text-blue-700', PTS: 'bg-orange-100 text-orange-700', PTK: 'bg-purple-100 text-purple-700' }[type] ?? 'bg-gray-100 text-gray-600')

let searchTimer: ReturnType<typeof setTimeout>
const onSearch = (val: string) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { searchQ.value = val }, 350)
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header row -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="font-bold text-gray-900 text-sm">Target Universitas</h3>
        <p class="text-xs text-gray-500 mt-0.5">Tambahkan jurusan yang ingin kamu tuju</p>
      </div>
      <button @click="showPicker = true"
        class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm">
        <Icon icon="mdi:plus" /> Tambah Target
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loadingTargets" class="space-y-3">
      <div v-for="n in 2" :key="n" class="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse flex gap-4">
        <div class="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
        <div class="flex-1 space-y-2 py-1">
          <div class="h-4 bg-gray-200 rounded w-1/2" />
          <div class="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="targets.length === 0" class="py-12 text-center space-y-3">
      <div class="w-16 h-16 rounded-2xl bg-linear-to-br from-primary/10 to-violet-100 flex items-center justify-center mx-auto">
        <Icon icon="mdi:school-outline" class="text-3xl text-primary" />
      </div>
      <p class="font-semibold text-gray-500 text-sm">Belum ada target universitas</p>
      <p class="text-xs text-gray-400">Tambahkan jurusan impianmu untuk mulai mempersiapkan diri</p>
    </div>

    <!-- Target list -->
    <div v-else class="space-y-3">
      <div v-for="(target) in targets" :key="target.id"
        class="bg-white rounded-2xl border border-gray-100 p-4 hover:border-primary/30 hover:shadow-sm transition-all group">
        <div class="flex items-center gap-4">
          <!-- Priority badge -->
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 font-extrabold text-primary text-sm">
            #{{ target.priority }}
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-gray-900 text-sm truncate">
              {{ target.universityProgram?.name ?? `Jurusan #${target.universityMajorId}` }}
            </h4>
            <div class="flex items-center gap-2 mt-0.5 flex-wrap">
              <p class="text-xs text-gray-500">
                {{ target.universityProgram?.university?.name ?? '—' }}
              </p>
              <span v-if="target.universityProgram?.university?.type"
                :class="['text-[10px] font-bold px-1.5 py-0.5 rounded-full', typeColor(target.universityProgram.university.type)]">
                {{ target.universityProgram.university.type }}
              </span>
            </div>
            <p v-if="target.universityProgram?.passingGrade" class="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <Icon icon="mdi:chart-line" class="text-primary/60" />
              Passing Grade: {{ target.universityProgram.passingGrade }}
            </p>
          </div>
          <button @click="removeTarget(target.id)" :disabled="removing"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
            <Icon icon="mdi:trash-can-outline" />
          </button>
        </div>
      </div>
    </div>

    <!-- ── Picker Modal ──────────────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showPicker" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showPicker = false" />
          <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 class="font-bold text-gray-900">Tambah Target Universitas</h2>
              <button @click="showPicker = false" class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                <Icon icon="mdi:close" />
              </button>
            </div>

            <div class="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <!-- Step 1: Pick university -->
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1.5">
                  <span class="inline-flex items-center gap-1">
                    <span class="w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">1</span>
                    Pilih Universitas
                  </span>
                </label>
                <div class="relative mb-2">
                  <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    :value="searchQ"
                    @input="onSearch(($event.target as HTMLInputElement).value)"
                    type="text" placeholder="Cari universitas..."
                    class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div v-if="loadingUnis" class="text-xs text-gray-400 text-center py-4">Memuat...</div>
                <div v-else-if="universities.length === 0" class="text-xs text-gray-400 text-center py-4">Tidak ada universitas ditemukan</div>
                <div v-else class="space-y-1.5 max-h-48 overflow-y-auto">
                  <button
                    v-for="uni in universities" :key="uni.id"
                    @click="selectedUni = uni"
                    :class="[
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all text-sm',
                      selectedUni?.id === uni.id ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-700'
                    ]"
                  >
                    <Icon icon="mdi:school" class="shrink-0 text-base" />
                    <span class="flex-1 truncate font-medium">{{ uni.name }}</span>
                    <span :class="['text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0', typeColor(uni.type)]">{{ uni.type }}</span>
                    <Icon v-if="selectedUni?.id === uni.id" icon="mdi:check-circle" class="text-primary shrink-0" />
                  </button>
                </div>
              </div>

              <!-- Step 2: Pick major -->
              <div v-if="selectedUni">
                <label class="block text-xs font-semibold text-gray-600 mb-1.5">
                  <span class="inline-flex items-center gap-1">
                    <span class="w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">2</span>
                    Pilih Jurusan — {{ selectedUni.name }}
                  </span>
                </label>
                <div v-if="loadingMajors" class="text-xs text-gray-400 text-center py-4">Memuat jurusan...</div>
                <div v-else-if="majors.length === 0" class="text-xs text-gray-400 text-center py-4">Belum ada jurusan tersedia</div>
                <div v-else class="space-y-1.5 max-h-48 overflow-y-auto">
                  <button
                    v-for="major in majors" :key="major.id"
                    @click="selectedMajor = major"
                    :class="[
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all text-sm',
                      selectedMajor?.id === major.id ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-700'
                    ]"
                  >
                    <Icon icon="mdi:book-education-outline" class="shrink-0 text-base" />
                    <span class="flex-1 truncate font-medium">{{ major.name }}</span>
                    <span class="text-xs text-gray-400 shrink-0">PG: {{ major.passingGrade }}</span>
                    <Icon v-if="selectedMajor?.id === major.id" icon="mdi:check-circle" class="text-primary shrink-0" />
                  </button>
                </div>
              </div>

              <!-- Step 3: Priority -->
              <div v-if="selectedMajor">
                <label class="block text-xs font-semibold text-gray-600 mb-1.5">
                  <span class="inline-flex items-center gap-1">
                    <span class="w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">3</span>
                    Prioritas (1 = utama)
                  </span>
                </label>
                <div class="flex gap-2">
                  <button v-for="p in 5" :key="p" @click="priority = p"
                    :class="['flex-1 py-2 rounded-xl border text-sm font-bold transition-all', priority === p ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-600 hover:border-primary/40']">
                    {{ p }}
                  </button>
                </div>
              </div>
            </div>

            <div class="px-5 pb-5 flex gap-2 border-t border-gray-100 pt-4">
              <button @click="showPicker = false"
                class="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button @click="addTarget()" :disabled="!selectedMajor || adding"
                class="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                <Icon v-if="adding" icon="mdi:loading" class="animate-spin" />
                {{ adding ? 'Menambahkan...' : 'Tambahkan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative { transform: translateY(24px) scale(0.97); }
.modal-enter-active .relative { transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
</style>
