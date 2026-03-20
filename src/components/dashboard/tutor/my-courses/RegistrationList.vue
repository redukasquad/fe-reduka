<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'
import { CourseRegistrationService } from '../../../../services/course.registration'

const props = defineProps<{ courseId: number }>()
const queryClient = useQueryClient()

// Decoupled fetch
const { data, isLoading, isError } = useQuery({
  queryKey: ['course-registrations', props.courseId],
  queryFn: () => CourseRegistrationService.getRegistration(props.courseId),
  staleTime: 1000 * 60,
})

const registrations = computed(() => data.value?.data ?? [])

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
}

const { mutate: approve, isPending: approving } = useMutation({
  mutationFn: (id: number) => CourseRegistrationService.approve(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['course-registrations', props.courseId] })
    toast.success('Registrasi disetujui')
  },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal menyetujui'),
})

const { mutate: reject, isPending: rejecting } = useMutation({
  mutationFn: (id: number) => CourseRegistrationService.reject(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['course-registrations', props.courseId] })
    toast.success('Registrasi ditolak')
  },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal menolak'),
})

const expandedId = ref<number | null>(null)
const dateFormatter = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
</script>

<template>
  <div class="space-y-3">
    <div v-if="isLoading" class="space-y-2">
      <div v-for="n in 4" :key="n" class="h-14 bg-gray-100 rounded-lg animate-pulse" />
    </div>

    <div v-else-if="isError" class="py-8 text-center text-red-500 text-sm">
      Gagal memuat data registrasi.
    </div>

    <div v-else-if="registrations.length === 0" class="py-10 text-center text-gray-400 border border-dashed rounded-xl">
      <Icon icon="mdi:account-off-outline" class="text-4xl mb-2" />
      <p class="text-sm">Belum ada registrasi.</p>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="reg in registrations"
        :key="reg.id"
        class="border rounded-xl bg-white overflow-hidden"
      >
        <div class="flex items-center gap-3 p-4">
          <div class="size-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <Icon icon="mdi:account-outline" class="text-gray-500" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm text-gray-800">{{ reg.userName ?? `User #${reg.userId}` }}</p>
            <p class="text-xs text-gray-400">{{ reg.userEmail }} · {{ dateFormatter.format(new Date(reg.createdAt)) }}</p>
          </div>

          <span :class="statusColor[reg.status]" class="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase shrink-0">
            {{ reg.status }}
          </span>

          <!-- Actions for pending -->
          <div v-if="reg.status === 'pending'" class="flex items-center gap-1.5 shrink-0">
            <button
              @click="approve(reg.id)"
              :disabled="approving"
              class="px-2.5 py-1 rounded-md bg-green-500 text-white text-xs font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              Setujui
            </button>
            <button
              @click="reject(reg.id)"
              :disabled="rejecting"
              class="px-2.5 py-1 rounded-md bg-red-100 text-red-600 text-xs font-medium hover:bg-red-200 disabled:opacity-50 transition-colors"
            >
              Tolak
            </button>
          </div>

          <!-- Expand answers -->
          <button
            v-if="reg.answers?.length"
            @click="expandedId = expandedId === reg.id ? null : reg.id"
            class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
          >
            <Icon :icon="expandedId === reg.id ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
          </button>
        </div>

        <!-- Answers -->
        <div v-if="expandedId === reg.id && reg.answers?.length" class="border-t px-4 pb-4 pt-3 bg-gray-50/50 space-y-2">
          <div v-for="ans in reg.answers" :key="ans.questionId" class="text-sm">
            <p class="text-xs font-semibold text-gray-500">{{ ans.questionText }}</p>
            <p class="text-gray-700 mt-0.5">{{ ans.answerText }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
