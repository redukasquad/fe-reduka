<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useMutation } from '@tanstack/vue-query'
import { useAuth } from '../../../stores/auth'
import { UserService } from '../../../services/user'
import { useToast } from '../../../composables/useToast'
import { useRouter } from 'vue-router'

const auth = useAuth()
const toast = useToast()
const router = useRouter()

const showConfirm = ref(false)

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
  <div class="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
    <h3 class="font-bold text-red-600 text-sm mb-1">Zona Berbahaya</h3>
    <p class="text-xs text-gray-500 mb-4">Tindakan di bawah ini tidak dapat dibatalkan.</p>
    <button @click="showConfirm = true"
      class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors">
      <Icon icon="mdi:delete-outline" /> Hapus Akun
    </button>
  </div>

  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showConfirm = false" />
        <div class="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center">
          <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Icon icon="mdi:alert-outline" class="text-red-500 text-2xl" />
          </div>
          <h3 class="font-bold text-gray-900 text-base mb-1">Hapus Akun?</h3>
          <p class="text-sm text-gray-500 mb-5 leading-relaxed">
            Tindakan ini tidak dapat dibatalkan. Semua data akan dihapus permanen.
          </p>
          <div class="flex gap-2">
            <button @click="showConfirm = false"
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
</style>
