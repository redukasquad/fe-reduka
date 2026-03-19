<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { Image } from '@unpic/vue'
import { toast } from 'vue3-toastify'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import TutorPermissionPanel from '../../../../components/dashboard/admin/tryouts/TutorPermissionPanel.vue'
import { TryoutService } from '../../../../services/tryout'

const route = useRoute()
const router = useRouter()
const tryoutId = Number(route.params.id)

const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ['tryout', tryoutId],
  queryFn: () => TryoutService.findOne(tryoutId),
  enabled: !!tryoutId,
})

const tryout = computed(() => data.value?.data ?? null)

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
})

const publishMutation = useMutation({
  mutationFn: (isPublished: boolean) => TryoutService.togglePublish(tryoutId, isPublished),
  onSuccess: () => {
    refetch()
    toast.success('Status publikasi diperbarui')
  },
  onError: (err: any) => {
    toast.error(err?.response?.data?.message ?? 'Gagal memperbarui status')
  },
})

const deleteMutation = useMutation({
  mutationFn: () => TryoutService.delete(tryoutId),
  onSuccess: () => {
    toast.success('Tryout berhasil dihapus')
    router.push({ name: 'admin-tryouts' })
  },
  onError: (err: any) => {
    toast.error(err?.response?.data?.message ?? 'Gagal menghapus tryout')
  },
})

const confirmDelete = ref(false)
</script>

<template>
  <DashboardLayout class="backdrop-blur">
    <div v-if="isLoading" class="p-8 text-center text-gray-600">Memuat data...</div>
    <div v-else-if="isError" class="p-8 text-center text-red-600">Gagal memuat data tryout.</div>

    <div v-else-if="tryout" class="py-4 px-8 relative">
      <!-- Back button -->
      <RouterLink
        :to="{ name: 'admin-tryouts' }"
        class="p-1 rounded-full shadow bg-gray-500 text-white text-2xl absolute top-5 left-4 z-30"
      >
        <Icon icon="mdi:chevron-left" />
      </RouterLink>

      <!-- Edit button -->
      <RouterLink
        :to="{ name: 'admin-tryouts-update', params: { id: tryout.id } }"
        class="p-2 rounded-full group shadow-xl shadow-blue-400/40 hover:scale-105 bg-blue-400 text-white text-2xl absolute top-5 right-7 z-30"
      >
        <div class="relative">
          <p class="absolute top-[250%] left-1/2 -translate-x-1/2 text-[10px] bg-gray-800 text-white p-1 rounded-sm scale-0 group-hover:scale-100 transition-all duration-500 text-nowrap">
            Edit Tryout
          </p>
          <Icon icon="mdi:pen" class="size-2" />
        </div>
      </RouterLink>

      <!-- Header -->
      <div class="flex md:flex-row flex-col gap-4 items-center border-b-2 border-b-gray-300 pb-4 rounded-b-md">
        <div class="flex-1">
          <Image
            v-if="tryout.imageUrl"
            :src="tryout.imageUrl"
            class="w-full h-auto rounded-md shadow-md"
            :alt="tryout.name + '-image'"
          />
          <div v-else class="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
            <Icon icon="mdi:image-off-outline" class="text-5xl" />
          </div>
        </div>
        <div class="flex-1 space-y-2">
          <h1 class="lg:text-3xl md:text-2xl sm:text-xl text-lg font-bold">{{ tryout.name }}</h1>

          <div class="flex items-center gap-2 flex-wrap">
            <!-- Publish toggle -->
            <button
              @click="publishMutation.mutate(!tryout.isPublished)"
              :class="tryout.isPublished ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'"
              class="text-white px-3 py-1 rounded text-xs transition-colors"
            >
              {{ tryout.isPublished ? 'Published' : 'Unpublished' }}
            </button>

            <!-- Free/Paid badge -->
            <span
              :class="tryout.isFree ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'"
              class="px-3 py-1 rounded text-xs font-semibold"
            >
              {{ tryout.isFree ? 'Gratis' : currencyFormatter.format(tryout.price ?? 0) }}
            </span>
          </div>

          <div class="text-sm text-gray-600 space-y-1">
            <p>
              <span class="font-medium">Pendaftaran:</span>
              {{ dateFormatter.format(new Date(tryout.registrationStart)) }}
              &ndash;
              {{ dateFormatter.format(new Date(tryout.registrationEnd)) }}
            </p>
            <p v-if="tryout.creator">
              <span class="font-medium">Dibuat oleh:</span>
              {{ tryout.creator.username }}
            </p>
          </div>

          <div v-if="tryout.description" class="text-sm text-justify opacity-90" v-html="tryout.description" />
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-6 flex flex-wrap gap-3">
        <RouterLink
          :to="{ name: 'admin-tryouts-registration', params: { id: tryout.id } }"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Icon icon="mdi:account-group-outline" />
          Lihat Registrasi
        </RouterLink>

        <a
          v-if="tryout.driveLink"
          :href="tryout.driveLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
        >
          <Icon icon="mdi:google-drive" />
          Pembahasan Soal
        </a>

        <!-- Delete -->
        <div class="ml-auto">
          <button
            v-if="!confirmDelete"
            @click="confirmDelete = true"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-100 text-red-600 text-sm font-medium hover:bg-red-200 transition-colors"
          >
            <Icon icon="mdi:delete-outline" />
            Hapus
          </button>
          <div v-else class="flex items-center gap-2">
            <span class="text-sm text-red-600">Yakin hapus tryout ini?</span>
            <button
              @click="deleteMutation.mutate()"
              class="px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 transition-colors"
            >
              Ya, Hapus
            </button>
            <button
              @click="confirmDelete = false"
              class="px-3 py-1 rounded-md bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>

      <!-- Tutor Permissions -->
      <TutorPermissionPanel :tryout-id="tryout.id" />
    </div>
  </DashboardLayout>
</template>
