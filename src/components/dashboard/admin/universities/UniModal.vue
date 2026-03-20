<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from '../../../../composables/useToast'
import api from '../../../../services/api'
import type { University } from '../../../../types/entites/university'

const props = defineProps<{ open: boolean; editing: University | null }>()
const emit = defineEmits<{ 'update:open': [boolean] }>()

const qc = useQueryClient()
const toast = useToast()

const form = ref({ name: '', type: 'PTN' as 'PTN' | 'PTS' | 'PTK' })

watch(() => props.open, (v) => {
  if (v) form.value = { name: props.editing?.name ?? '', type: props.editing?.type ?? 'PTN' }
})

const { mutate: save, isPending: saving } = useMutation({
  mutationFn: () => props.editing
    ? api.put(`/universities/${props.editing.id}`, form.value)
    : api.post('/universities', form.value),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['admin-universities'] })
    emit('update:open', false)
    toast.success(props.editing ? 'Universitas diperbarui!' : 'Universitas ditambahkan!')
  },
  onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Gagal menyimpan.'),
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="emit('update:open', false)" />
        <div class="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 class="font-bold text-gray-900 text-sm">{{ editing ? 'Edit Universitas' : 'Tambah Universitas' }}</h2>
            <button @click="emit('update:open', false)" class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
              <Icon icon="mdi:close" />
            </button>
          </div>
          <div class="p-5 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nama Universitas</label>
              <input v-model="form.name" type="text" placeholder="Contoh: Universitas Indonesia"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Tipe</label>
              <div class="flex gap-2">
                <button v-for="t in ['PTN', 'PTS', 'PTK']" :key="t" @click="form.type = t as any"
                  :class="['flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all', form.type === t ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-600 hover:border-primary/40']">
                  {{ t }}
                </button>
              </div>
            </div>
          </div>
          <div class="px-5 pb-5 flex gap-2">
            <button @click="emit('update:open', false)"
              class="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button @click="save()" :disabled="saving || !form.name"
              class="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              <Icon v-if="saving" icon="mdi:loading" class="animate-spin" />
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
