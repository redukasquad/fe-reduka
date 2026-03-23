<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { Image } from '@unpic/vue'
import { toast } from 'vue3-toastify'
import { TryoutService } from '../../services/tryout'
import { TryoutRegistrationService } from '../../services/tryouts.registration'
import { uploadImage } from '../../services/uploads'
import { useAuth } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuth()
const qc = useQueryClient()
const id = Number(route.params.id)

const { data: tryoutData, isLoading, isError } = useQuery({
  queryKey: ['tryout', id],
  queryFn: () => TryoutService.findOne(id),
  enabled: !!id,
})

const { data: subtestsData } = useQuery({
  queryKey: ['tryout-subtests', id],
  queryFn: () => TryoutService.getSubtests(id),
  enabled: !!id && !!auth.user,
  retry: false,
})

const { data: myRegsData, refetch: refetchMyRegs } = useQuery({
  queryKey: ['my-tryout-registrations'],
  queryFn: () => TryoutRegistrationService.getMyRegistrations(),
  enabled: !!auth.user,
})

const tryout = computed(() => tryoutData.value?.data ?? null)
const subtests = computed(() => subtestsData.value?.data ?? [])
const myRegistration = computed(() =>
  myRegsData.value?.data?.find(r => r.tryOutId === id) ?? null
)

const isRegistrationOpen = computed(() => {
  if (!tryout.value) return false
  const now = new Date()
  return now >= new Date(tryout.value.registrationStart) && now <= new Date(tryout.value.registrationEnd)
})

// Paid flow: show form inline before registering
const showPaidForm = ref(false)
const proofFile = ref<File | null>(null)
const proofPreview = ref<string | null>(null)
const submitting = ref(false)

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  proofFile.value = file
  proofPreview.value = URL.createObjectURL(file)
}

function resetProofForm() {
  showPaidForm.value = false
  proofFile.value = null
  proofPreview.value = null
}

// Free register
const { mutate: doRegister, isPending: registering } = useMutation({
  mutationFn: () => TryoutRegistrationService.register(id),
  onSuccess: () => {
    toast.success('Pendaftaran berhasil! Kamu sudah terdaftar.')
    refetchMyRegs()
    qc.invalidateQueries({ queryKey: ['my-tryout-registrations'] })
  },
  onError: (err: any) => {
    const status = err?.response?.status
    const msg = err?.response?.data?.message ?? 'Gagal mendaftar'
    if (status === 409) {
      toast.info('Kamu sudah terdaftar di tryout ini.')
      refetchMyRegs()
    } else {
      toast.error(msg)
    }
  },
})

// Paid: register then upload proof in one flow
async function submitPaidRegistration() {
  if (!auth.user) { router.push('/auth/login'); return }
  if (!proofFile.value) { toast.error('Pilih gambar bukti pembayaran terlebih dahulu'); return }
  submitting.value = true
  try {
    // 1. Register
    const regRes = await TryoutRegistrationService.register(id)
    const regId = regRes.data?.id
    if (!regId) throw new Error('Gagal mendapatkan ID registrasi')

    // 2. Upload proof
    const { url } = await uploadImage(proofFile.value)
    await TryoutRegistrationService.uploadPaymentProof(regId, url)

    toast.success('Pendaftaran berhasil! Bukti pembayaran terkirim, menunggu verifikasi admin.')
    resetProofForm()
    refetchMyRegs()
    qc.invalidateQueries({ queryKey: ['my-tryout-registrations'] })
  } catch (err: any) {
    const status = err?.response?.status
    const msg = err?.response?.data?.message ?? 'Gagal mendaftar'
    if (status === 409) {
      toast.info('Kamu sudah terdaftar. Silakan upload bukti pembayaran.')
      refetchMyRegs()
      resetProofForm()
    } else {
      toast.error(msg)
    }
  } finally {
    submitting.value = false
  }
}

// Re-upload proof (after rejection)
const showReuploadForm = ref(false)
const reuploadFile = ref<File | null>(null)
const reuploadPreview = ref<string | null>(null)
const reuploading = ref(false)

function onReuploadChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  reuploadFile.value = file
  reuploadPreview.value = URL.createObjectURL(file)
}

async function submitReupload() {
  if (!reuploadFile.value || !myRegistration.value) return
  reuploading.value = true
  try {
    const { url } = await uploadImage(reuploadFile.value)
    await TryoutRegistrationService.uploadPaymentProof(myRegistration.value.id, url)
    toast.success('Bukti pembayaran berhasil dikirim ulang.')
    showReuploadForm.value = false
    reuploadFile.value = null
    reuploadPreview.value = null
    refetchMyRegs()
    qc.invalidateQueries({ queryKey: ['my-tryout-registrations'] })
  } catch (err: any) {
    toast.error(err?.response?.data?.message ?? 'Gagal upload')
  } finally {
    reuploading.value = false
  }
}

function handleFreeRegister() {
  if (!auth.user) { router.push('/auth/login'); return }
  doRegister()
}

function handlePaidClick() {
  if (!auth.user) { router.push('/auth/login'); return }
  showPaidForm.value = true
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
function formatPrice(p: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p)
}
function formatDuration(s: number) {
  return `${Math.floor(s / 60)} menit`
}

const statusCfg: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: 'Menunggu Verifikasi', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: 'mdi:clock-outline' },
  approved: { label: 'Terdaftar', color: 'text-green-700 bg-green-50 border-green-200', icon: 'mdi:check-circle' },
  rejected: { label: 'Ditolak', color: 'text-red-700 bg-red-50 border-red-200', icon: 'mdi:close-circle' },
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-20">
    <div v-if="isLoading" class="max-w-4xl mx-auto px-4 py-10 space-y-6 animate-pulse">
      <div class="h-72 bg-gray-200 rounded-2xl" />
      <div class="h-6 bg-gray-200 rounded w-1/2" />
    </div>

    <div v-else-if="isError" class="max-w-4xl mx-auto px-4 py-20 text-center text-red-500 space-y-3">
      <Icon icon="mdi:alert-circle-outline" class="text-6xl mx-auto" />
      <p class="text-xl font-semibold">Gagal memuat tryout.</p>
      <button @click="router.go(0)" class="text-sm text-primary hover:underline">Coba lagi</button>
    </div>

    <template v-else-if="tryout">
      <!-- Hero -->
      <div class="relative w-full h-64 md:h-80 max-w-[90%] mx-auto shadow-md bg-gray-200 overflow-hidden rounded-b-2xl">
        <Image v-if="tryout.imageUrl" :src="tryout.imageUrl" :alt="tryout.name" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
          <Icon icon="mdi:file-document-outline" class="text-7xl" />
        </div>
        <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        <button @click="router.back()" class="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
          <Icon icon="mdi:arrow-left" class="text-xl" />
        </button>
        <div class="absolute bottom-6 left-6 right-6">
          <div class="flex items-center gap-2 mb-2">
            <span :class="['px-3 py-0.5 rounded-full text-xs font-bold', tryout.isFree ? 'bg-green-400 text-white' : 'bg-amber-400 text-white']">
              {{ tryout.isFree ? 'GRATIS' : formatPrice(tryout.price ?? 0) }}
            </span>
            <span v-if="isRegistrationOpen" class="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-400 text-white">PENDAFTARAN BUKA</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">{{ tryout.name }}</h1>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <!-- Info bar -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-wrap gap-6">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <Icon icon="mdi:calendar-start" class="text-primary text-lg" />
            <div>
              <p class="text-xs text-gray-400">Pendaftaran Dibuka</p>
              <p class="font-semibold">{{ formatDate(tryout.registrationStart) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <Icon icon="mdi:calendar-end" class="text-red-400 text-lg" />
            <div>
              <p class="text-xs text-gray-400">Pendaftaran Ditutup</p>
              <p class="font-semibold">{{ formatDate(tryout.registrationEnd) }}</p>
            </div>
          </div>
          <div v-if="tryout.creator" class="flex items-center gap-2 text-sm text-gray-600">
            <Icon icon="mdi:account-circle" class="text-gray-400 text-lg" />
            <div>
              <p class="text-xs text-gray-400">Dibuat oleh</p>
              <p class="font-semibold">{{ tryout.creator.username }}</p>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div v-if="tryout.description" class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 class="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Icon icon="mdi:text-box-outline" class="text-primary" />
            Tentang Tryout
          </h2>
          <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed" v-html="tryout.description" />
        </div>

        <!-- Subtests -->
        <div v-if="subtests.length > 0" class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 class="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Icon icon="mdi:format-list-bulleted" class="text-primary" />
            Subtes
            <span class="ml-auto text-sm font-normal text-gray-400">{{ subtests.length }} subtes</span>
          </h2>
          <div class="divide-y divide-gray-50">
            <div v-for="sub in subtests" :key="sub.id" class="py-3 flex items-center justify-between">
              <div>
                <p class="font-semibold text-gray-800 text-sm">{{ sub.name }}</p>
                <p class="text-xs text-gray-400">{{ sub.code }}</p>
              </div>
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <span class="flex items-center gap-1"><Icon icon="mdi:help-circle-outline" />{{ sub.questionCount }} soal</span>
                <span class="flex items-center gap-1"><Icon icon="mdi:clock-outline" />{{ formatDuration(sub.timeLimitSeconds) }}</span>
                <span class="flex items-center gap-1"><Icon icon="mdi:star-outline" />{{ sub.maxScore }} poin</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Registration Section -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 class="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Icon icon="mdi:clipboard-check-outline" class="text-primary" />
            Pendaftaran
          </h2>

          <!-- SUDAH DAFTAR -->
          <template v-if="myRegistration">
            <div :class="['border rounded-xl p-4 mb-4 text-sm font-medium flex items-center gap-2', statusCfg[myRegistration.paymentStatus]?.color]">
              <Icon :icon="statusCfg[myRegistration.paymentStatus]?.icon ?? 'mdi:information'" class="text-lg shrink-0" />
              <div>
                <p class="font-semibold">{{ statusCfg[myRegistration.paymentStatus]?.label }}</p>
                <p v-if="myRegistration.rejectionReason" class="text-xs opacity-80 mt-0.5">
                  Alasan: {{ myRegistration.rejectionReason }}
                </p>
              </div>
            </div>

            <!-- Tombol daftar disabled -->
            <button disabled class="w-full py-3 rounded-xl bg-gray-100 text-gray-400 font-semibold cursor-not-allowed text-sm mb-4">
              Sudah Terdaftar
            </button>

            <!-- Re-upload jika ditolak atau belum upload (paid only) -->
            <template v-if="!tryout.isFree && myRegistration.paymentStatus !== 'approved'">
              <div v-if="tryout.qrisImageUrl || tryout.paymentLink" class="mb-4 space-y-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p class="text-sm font-medium text-amber-800">Info Pembayaran</p>
                <div v-if="tryout.qrisImageUrl" class="flex justify-center">
                  <Image :src="tryout.qrisImageUrl" alt="QRIS" class="max-w-[180px] rounded-xl border" />
                </div>
                <a v-if="tryout.paymentLink" :href="tryout.paymentLink" target="_blank" class="flex items-center gap-1.5 text-sm text-primary hover:underline">
                  <Icon icon="mdi:open-in-new" />Buka Link Pembayaran
                </a>
              </div>

              <div v-if="!showReuploadForm">
                <button @click="showReuploadForm = true" class="w-full py-2.5 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors">
                  {{ myRegistration.paymentStatus === 'rejected' ? 'Upload Ulang Bukti Pembayaran' : 'Upload Bukti Pembayaran' }}
                </button>
              </div>
              <div v-else class="space-y-3">
                <label class="block cursor-pointer">
                  <div :class="['border-2 border-dashed rounded-xl p-5 text-center transition-colors', reuploadPreview ? 'border-primary/40 bg-primary/5' : 'border-gray-200 hover:border-primary/40']">
                    <img v-if="reuploadPreview" :src="reuploadPreview" class="max-h-40 mx-auto rounded-lg object-contain mb-1" />
                    <div v-else class="space-y-1">
                      <Icon icon="mdi:cloud-upload-outline" class="text-3xl text-gray-300 mx-auto" />
                      <p class="text-sm text-gray-500">Klik untuk pilih gambar</p>
                    </div>
                    <p v-if="reuploadPreview" class="text-xs text-primary mt-1">{{ reuploadFile?.name }}</p>
                  </div>
                  <input type="file" accept="image/*" class="hidden" @change="onReuploadChange" />
                </label>
                <div class="flex gap-2">
                  <button @click="submitReupload" :disabled="!reuploadFile || reuploading"
                    class="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <Icon v-if="reuploading" icon="mdi:loading" class="animate-spin" />
                    {{ reuploading ? 'Mengupload...' : 'Kirim Bukti' }}
                  </button>
                  <button @click="showReuploadForm = false; reuploadFile = null; reuploadPreview = null"
                    class="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-300 transition-colors">
                    Batal
                  </button>
                </div>
              </div>
            </template>
          </template>

          <!-- BELUM DAFTAR -->
          <template v-else>
            <div v-if="!isRegistrationOpen" class="text-center py-6 text-gray-400 space-y-2">
              <Icon icon="mdi:calendar-clock" class="text-4xl mx-auto text-gray-200" />
              <p class="text-sm">Pendaftaran belum dibuka atau sudah ditutup.</p>
            </div>

            <template v-else>
              <!-- FREE -->
              <template v-if="tryout.isFree">
                <p class="text-sm text-gray-500 mb-4">Tryout ini gratis. Daftar sekarang untuk mendapatkan akses.</p>
                <button @click="handleFreeRegister" :disabled="registering"
                  class="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  <Icon v-if="registering" icon="mdi:loading" class="animate-spin" />
                  {{ registering ? 'Mendaftar...' : 'Daftar Sekarang — Gratis' }}
                </button>
              </template>

              <!-- PAID -->
              <template v-else>
                <!-- Info harga -->
                <div class="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100 mb-4">
                  <span class="text-sm text-gray-700 font-medium">Biaya Pendaftaran</span>
                  <span class="text-lg font-extrabold text-amber-600">{{ formatPrice(tryout.price ?? 0) }}</span>
                </div>

                <!-- Form daftar + upload bukti (muncul setelah klik Daftar) -->
                <div v-if="showPaidForm" class="space-y-4">
                  <!-- Payment info -->
                  <div v-if="tryout.qrisImageUrl || tryout.paymentLink" class="p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-3">
                    <p class="text-sm font-medium text-amber-800">Lakukan pembayaran terlebih dahulu:</p>
                    <div v-if="tryout.qrisImageUrl" class="flex justify-center">
                      <Image :src="tryout.qrisImageUrl" alt="QRIS" class="max-w-[180px] rounded-xl border" />
                    </div>
                    <a v-if="tryout.paymentLink" :href="tryout.paymentLink" target="_blank" class="flex items-center gap-1.5 text-sm text-primary hover:underline">
                      <Icon icon="mdi:open-in-new" />Buka Link Pembayaran
                    </a>
                  </div>

                  <!-- Upload area -->
                  <div>
                    <p class="text-sm font-medium text-gray-700 mb-2">Upload Bukti Pembayaran</p>
                    <label class="block cursor-pointer">
                      <div :class="['border-2 border-dashed rounded-xl p-5 text-center transition-colors', proofPreview ? 'border-primary/40 bg-primary/5' : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50']">
                        <img v-if="proofPreview" :src="proofPreview" class="max-h-48 mx-auto rounded-lg object-contain mb-1" />
                        <div v-else class="space-y-2">
                          <Icon icon="mdi:cloud-upload-outline" class="text-4xl text-gray-300 mx-auto" />
                          <p class="text-sm text-gray-500">Klik untuk pilih gambar bukti pembayaran</p>
                          <p class="text-xs text-gray-400">JPG, PNG, WEBP</p>
                        </div>
                        <p v-if="proofPreview" class="text-xs text-primary mt-1">{{ proofFile?.name }}</p>
                      </div>
                      <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
                    </label>
                  </div>

                  <div class="flex gap-2">
                    <button @click="submitPaidRegistration" :disabled="!proofFile || submitting"
                      class="flex-1 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                      <Icon v-if="submitting" icon="mdi:loading" class="animate-spin" />
                      {{ submitting ? 'Mendaftar...' : 'Daftar & Kirim Bukti' }}
                    </button>
                    <button @click="resetProofForm"
                      class="px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-300 transition-colors">
                      Batal
                    </button>
                  </div>
                </div>

                <!-- Tombol awal sebelum form muncul -->
                <button v-else @click="handlePaidClick"
                  class="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
                  Daftar Sekarang
                </button>
              </template>
            </template>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>
