<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { UserService } from '../../../services/user'
import { useAuth } from '../../../stores/auth'
import { useToast } from '../../../composables/useToast'
import { useRouter } from 'vue-router'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [boolean] }>()

const auth = useAuth()
const qc = useQueryClient()
const toast = useToast()
const router = useRouter()

const kelasOptions = ['Kelas 10', 'Kelas 11', 'Kelas 12', 'Gapyear (Alumni)']
const showDeleteConfirm = ref(false)

const form = ref({
  username: '',
  no_telp: '',
  kelas: '',
  jenis_kelamin: undefined as boolean | undefined,
})

watch(() => props.open, (val) => {
  if (val) {
    form.value = {
      username: auth.user?.username ?? '',
      no_telp: auth.user?.noTelp ?? '',
      kelas: auth.user?.kelas ?? '',
      jenis_kelamin: auth.user?.jenisKelamin,
    }
    showDeleteConfirm.value = false
  }
})

const { mutate: save, isPending: saving } = useMutation({
  mutationFn: () => UserService.update(auth.user?.id!, {
    username: form.value.username || undefined,
    no_telp: form.value.no_telp || undefined,
    kelas: form.value.kelas || undefined,
    jenis_kelamin: form.value.jenis_kelamin,
  }),
  onSuccess: (res) => {
    if (res.data) auth.setUser(res.data)
    emit('update:open', false)
    qc.invalidateQueries({ queryKey: ['me'] })
    toast.success('Profil berhasil diperbarui!')
  },
  onError: () => toast.error('Gagal memperbarui profil.'),
})

const { mutate: deleteAccount, isPending: deleting } = useMutation({
  mutationFn: () => UserService.delete(auth.user?.id!),
  onSuccess: () => {
    auth.logout()
    router.push('/auth/login')
    toast.success('Akun berhasil dihapus.')
  },
  onError: () => toast.error('Gagal menghapus akun.'),
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="emit('update:open', false)" />

        <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 class="font-bold text-gray-900">Edit Profil</h2>
            <button @click="emit('update:open', false)" class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
              <Icon icon="mdi:close" />
            </button>
          </div>

          <!-- Form -->
          <div class="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nama Lengkap</label>
              <div class="relative">
                <Icon icon="mdi:account-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input v-model="form.username" type="text" placeholder="Nama lengkap"
                  class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nomor Telepon</label>
              <div class="relative">
                <Icon icon="mdi:phone-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input v-model="form.no_telp" type="tel" placeholder="08xxxxxxxxxx"
                  class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Kelas</label>
              <div class="relative">
                <Icon icon="mdi:school-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <select v-model="form.kelas"
                  class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none bg-white">
                  <option value="">Pilih kelas</option>
                  <option v-for="k in kelasOptions" :key="k" :value="k">{{ k }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1.5">Jenis Kelamin</label>
              <div class="flex gap-2">
                <button @click="form.jenis_kelamin = true"
                  :class="['flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all', form.jenis_kelamin === true ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300']">
                  <Icon icon="mdi:gender-male" /> Laki-laki
                </button>
                <button @click="form.jenis_kelamin = false"
                  :class="['flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all', form.jenis_kelamin === false ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300']">
                  <Icon icon="mdi:gender-female" /> Perempuan
                </button>
              </div>
            </div>

            <!-- Danger zone -->
            <div class="pt-2 border-t border-gray-100">
              <p class="text-xs font-semibold text-gray-500 mb-2">Zona Berbahaya</p>
              <button @click="showDeleteConfirm = true"
                class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors">
                <Icon icon="mdi:delete-outline" /> Hapus Akun
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-5 pb-5 flex gap-2">
            <button @click="emit('update:open', false)"
              class="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button @click="save()" :disabled="saving"
              class="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
              <Icon v-if="saving" icon="mdi:loading" class="animate-spin" />
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete confirm dialog -->
    <Transition name="modal">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-60 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteConfirm = false" />
        <div class="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center">
          <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Icon icon="mdi:alert-outline" class="text-red-500 text-2xl" />
          </div>
          <h3 class="font-bold text-gray-900 text-base mb-1">Hapus Akun?</h3>
          <p class="text-sm text-gray-500 mb-5 leading-relaxed">
            Tindakan ini tidak dapat dibatalkan. Semua data kamu akan dihapus secara permanen.
          </p>
          <div class="flex gap-2">
            <button @click="showDeleteConfirm = false"
              class="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button @click="deleteAccount()" :disabled="deleting"
              class="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
              <Icon v-if="deleting" icon="mdi:loading" class="animate-spin" />
              {{ deleting ? 'Menghapus...' : 'Ya, Hapus' }}
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
.modal-enter-from .relative { transform: translateY(24px) scale(0.97); }
.modal-enter-active .relative { transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
</style>
