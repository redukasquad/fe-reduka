<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useQuery } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { CourseRegistrationService } from '../../../services/course.registration'

const router = useRouter()

const { data, isLoading } = useQuery({
  queryKey: ['my-course-registrations'],
  queryFn: () => CourseRegistrationService.getMyRegistrations(),
  staleTime: 1000 * 60,
})
const regs = computed(() => data.value?.data ?? [])

const statusColor = (s: string) => ({ approved: 'bg-emerald-100 text-emerald-700', pending: 'bg-amber-100 text-amber-700', rejected: 'bg-red-100 text-red-700' }[s] ?? 'bg-gray-100 text-gray-600')
const statusLabel = (s: string) => ({ approved: 'Disetujui', pending: 'Menunggu', rejected: 'Ditolak' }[s] ?? s)
</script>

<template>
  <div>
    <div v-if="isLoading" class="space-y-3">
      <div v-for="n in 3" :key="n" class="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse flex gap-4">
        <div class="w-11 h-11 rounded-xl bg-gray-200 shrink-0" />
        <div class="flex-1 space-y-2 py-1">
          <div class="h-4 bg-gray-200 rounded w-2/3" />
          <div class="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
    </div>

    <div v-else-if="regs.length === 0" class="py-16 text-center space-y-3">
      <div class="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto">
        <Icon icon="mdi:book-off-outline" class="text-3xl text-primary/40" />
      </div>
      <p class="font-semibold text-gray-500">Belum ada course yang didaftarkan</p>
      <RouterLink to="/courses" class="inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
        <Icon icon="mdi:plus" /> Jelajahi Course
      </RouterLink>
    </div>

    <div v-else class="space-y-3">
      <div v-for="reg in regs" :key="reg.id"
        class="bg-white rounded-2xl border border-gray-100 p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200">
        <div class="flex items-start gap-4">
          <div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon icon="mdi:book-open-variant" class="text-primary text-lg" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">{{ reg.courseName || `Course #${reg.courseId}` }}</h3>
                <p v-if="reg.programName" class="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <Icon icon="mdi:school-outline" class="text-primary/60" />{{ reg.programName }}
                </p>
              </div>
              <span :class="['text-xs font-bold px-2.5 py-1 rounded-full shrink-0', statusColor(reg.status)]">
                {{ statusLabel(reg.status) }}
              </span>
            </div>
            <div v-if="reg.status === 'approved'" class="mt-3 flex flex-wrap items-center gap-2">
              <button @click="router.push(`/courses/${reg.courseId}/learn`)"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg transition-colors">
                <Icon icon="mdi:play-circle-outline" class="text-base" /> Mulai Belajar
              </button>
              <a v-if="reg.whatsappGroupLink" :href="reg.whatsappGroupLink" target="_blank"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                <Icon icon="mdi:whatsapp" class="text-base" /> Grup WhatsApp
              </a>
            </div>
            <p v-else-if="reg.status === 'pending'" class="mt-2 text-xs text-amber-600 flex items-center gap-1">
              <Icon icon="mdi:clock-outline" /> Menunggu persetujuan admin
            </p>
            <p v-else-if="reg.status === 'rejected'" class="mt-2 text-xs text-red-500 flex items-center gap-1">
              <Icon icon="mdi:close-circle-outline" /> Pendaftaran ditolak
            </p>
            <p class="text-[10px] text-gray-400 mt-2">
              Didaftarkan {{ new Date(reg.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
