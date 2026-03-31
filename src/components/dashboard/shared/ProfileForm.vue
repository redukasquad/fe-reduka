<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useAuth } from '../../../stores/auth'
import { UserService } from '../../../services/user'
import { useToast } from '../../../composables/useToast'

const auth = useAuth()
const qc = useQueryClient()
const toast = useToast()

const kelasOptions = ['Kelas 10', 'Kelas 11', 'Kelas 12', 'Gapyear (Alumni)']

const form = ref({
  username: '',
  no_telp: '',
  kelas: '',
  jenis_kelamin: undefined as boolean | undefined,
})

watch(() => auth.user, (u) => {
  if (u) form.value = {
    username: u.username,
    no_telp: u.noTelp ?? '',
    kelas: u.kelas ?? '',
    jenis_kelamin: u.jenisKelamin,
  }
}, { immediate: true })

const { mutate: save, isPending: saving } = useMutation({
  mutationFn: () => UserService.update(auth.user?.id!, {
    username: form.value.username || undefined,
    no_telp: form.value.no_telp || undefined,
    kelas: form.value.kelas || undefined,
    jenis_kelamin: form.value.jenis_kelamin,
  }),
  onSuccess: (res) => {
    if (res.data) auth.setUser(res.data)
    qc.invalidateQueries({ queryKey: ['me'] })
    toast.success('Profil berhasil diperbarui!')
  },
  onError: () => toast.error('Gagal memperbarui profil.'),
})
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
    <h3 class="font-bold text-gray-800 text-sm">Edit Informasi</h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nama Lengkap</label>
        <div class="relative">
          <Icon icon="mdi:account-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input v-model="form.username" type="text" placeholder="Nama lengkap"
            class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nomor Telepon</label>
        <div class="relative">
          <Icon icon="mdi:phone-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input v-model="form.no_telp" type="tel" placeholder="08xxxxxxxxxx"
            class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Kelas</label>
        <div class="relative">
          <Icon icon="mdi:school-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm z-10" />
          <select v-model="form.kelas"
            class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none bg-white">
            <option value="">Pilih kelas</option>
            <option v-for="k in kelasOptions" :key="k" :value="k">{{ k }}</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Jenis Kelamin</label>
        <div class="flex gap-2">
          <button @click="form.jenis_kelamin = true"
            :class="['flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-medium transition-all', form.jenis_kelamin === true ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300']">
            <Icon icon="mdi:gender-male" /> Laki-laki
          </button>
          <button @click="form.jenis_kelamin = false"
            :class="['flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-medium transition-all', form.jenis_kelamin === false ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300']">
            <Icon icon="mdi:gender-female" /> Perempuan
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-end pt-1">
      <button @click="save()" :disabled="saving"
        class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60 transition-all shadow-sm">
        <Icon v-if="saving" icon="mdi:loading" class="animate-spin" />
        {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
      </button>
    </div>
  </div>
</template>
