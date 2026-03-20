<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import DashboardLayout from '../../../components/layout/DashboardLayout.vue'
import { useAuth } from '../../../stores/auth'
import { CourseTutorService } from '../../../services/course.tutor.service'
import { TryoutService } from '../../../services/tryout'

const auth = useAuth()
const user = computed(() => auth.user)

const { data: coursesData, isLoading: loadingCourses } = useQuery({
  queryKey: ['my-courses-dashboard'],
  queryFn: () => CourseTutorService.getMyCourses({ page: 1, perPage: 5 }),
  staleTime: 1000 * 60 * 2,
})

const { data: tryoutsData, isLoading: loadingTryouts } = useQuery({
  queryKey: ['tryouts-dashboard'],
  queryFn: () => TryoutService.findAll({ q: '', page: 1, perPage: 5 }),
  staleTime: 1000 * 60 * 2,
})

const recentCourses = computed(() => coursesData.value?.data?.data?.slice(0, 4) ?? [])
const totalCourses = computed(() => coursesData.value?.data?.totalItems ?? 0)
const totalTryouts = computed(() => tryoutsData.value?.data?.totalItems ?? 0)
const recentTryouts = computed(() => tryoutsData.value?.data?.data?.slice(0, 4) ?? [])

const dateFormatter = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Selamat pagi'
  if (h < 15) return 'Selamat siang'
  if (h < 18) return 'Selamat sore'
  return 'Selamat malam'
})
</script>

<template>
  <DashboardLayout>
    <div class="py-6 px-4 md:px-8 space-y-6 backdrop-blur">

      <!-- Greeting -->
      <div class="bg-linear-to-r from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/10">
        <p class="text-sm text-primary font-medium">{{ greeting }},</p>
        <h1 class="text-2xl font-bold text-gray-800 mt-0.5">{{ user?.username ?? 'Tutor' }} 👋</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola pertemuan, materi, dan soal tryout kamu dari sini.</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl border p-4 space-y-1">
          <div class="flex items-center gap-2 text-primary">
            <Icon icon="mdi:book-open-variant" class="text-xl" />
            <span class="text-xs font-medium text-gray-500">My Classes</span>
          </div>
          <p class="text-2xl font-bold text-gray-800">
            <span v-if="loadingCourses" class="inline-block h-7 w-10 bg-gray-200 rounded animate-pulse" />
            <span v-else>{{ totalCourses }}</span>
          </p>
          <p class="text-xs text-gray-400">course diampu</p>
        </div>

        <div class="bg-white rounded-xl border p-4 space-y-1">
          <div class="flex items-center gap-2 text-blue-500">
            <Icon icon="mdi:clipboard-text-outline" class="text-xl" />
            <span class="text-xs font-medium text-gray-500">Tryouts</span>
          </div>
          <p class="text-2xl font-bold text-gray-800">
            <span v-if="loadingTryouts" class="inline-block h-7 w-10 bg-gray-200 rounded animate-pulse" />
            <span v-else>{{ totalTryouts }}</span>
          </p>
          <p class="text-xs text-gray-400">paket tryout</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div>
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Aksi Cepat</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <RouterLink
            :to="{ name: 'tutor-classes' }"
            class="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <div class="size-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Icon icon="mdi:book-edit-outline" class="text-primary text-xl" />
            </div>
            <span class="text-xs font-medium text-gray-700 text-center">Kelola Kelas</span>
          </RouterLink>

          <RouterLink
            :to="{ name: 'tutor-tryouts' }"
            class="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border hover:border-blue-400/40 hover:bg-blue-50 transition-all group"
          >
            <div class="size-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <Icon icon="mdi:clipboard-text-outline" class="text-blue-500 text-xl" />
            </div>
            <span class="text-xs font-medium text-gray-700 text-center">Tryouts</span>
          </RouterLink>

          <RouterLink
            :to="{ name: 'tutor-courses' }"
            class="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border hover:border-green-400/40 hover:bg-green-50 transition-all group"
          >
            <div class="size-10 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <Icon icon="mdi:school-outline" class="text-green-600 text-xl" />
            </div>
            <span class="text-xs font-medium text-gray-700 text-center">Semua Courses</span>
          </RouterLink>
        </div>
      </div>

      <!-- Recent My Classes -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Kelas Terbaru</h2>
          <RouterLink :to="{ name: 'tutor-classes' }" class="text-xs text-primary hover:underline flex items-center gap-1">
            Lihat semua <Icon icon="mdi:arrow-right" />
          </RouterLink>
        </div>

        <div v-if="loadingCourses" class="space-y-2">
          <div v-for="n in 3" :key="n" class="h-16 bg-gray-100 rounded-xl animate-pulse" />
        </div>

        <div v-else-if="recentCourses.length === 0" class="py-8 text-center text-gray-400 border border-dashed rounded-xl">
          <Icon icon="mdi:book-off-outline" class="text-3xl mb-1" />
          <p class="text-sm">Belum ada course yang kamu ampu.</p>
        </div>

        <div v-else class="space-y-2">
          <RouterLink
            v-for="course in recentCourses"
            :key="course.id"
            :to="{ name: 'tutor-classes-view', params: { id: course.id } }"
            class="flex items-center gap-3 p-3 bg-white rounded-xl border hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            <div class="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Icon icon="mdi:book-open-page-variant" class="text-primary" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">{{ course.nameCourse }}</p>
              <p class="text-xs text-gray-400">
                {{ course.classes?.length ?? 0 }} kelas ·
                {{ dateFormatter.format(new Date(course.startDate)) }}
              </p>
            </div>
            <Icon icon="mdi:chevron-right" class="text-gray-400 shrink-0" />
          </RouterLink>
        </div>
      </div>

      <!-- Recent Tryouts -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Tryout Terbaru</h2>
          <RouterLink :to="{ name: 'tutor-tryouts' }" class="text-xs text-primary hover:underline flex items-center gap-1">
            Lihat semua <Icon icon="mdi:arrow-right" />
          </RouterLink>
        </div>

        <div v-if="loadingTryouts" class="space-y-2">
          <div v-for="n in 3" :key="n" class="h-16 bg-gray-100 rounded-xl animate-pulse" />
        </div>

        <div v-else-if="recentTryouts.length === 0" class="py-8 text-center text-gray-400 border border-dashed rounded-xl">
          <Icon icon="mdi:clipboard-off-outline" class="text-3xl mb-1" />
          <p class="text-sm">Belum ada tryout.</p>
        </div>

        <div v-else class="space-y-2">
          <RouterLink
            v-for="tryout in recentTryouts"
            :key="tryout.id"
            :to="{ name: 'tutor-tryouts-view', params: { id: tryout.id } }"
            class="flex items-center gap-3 p-3 bg-white rounded-xl border hover:border-blue-300 hover:bg-blue-50/50 transition-all"
          >
            <div class="size-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Icon icon="mdi:clipboard-text-outline" class="text-blue-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">{{ tryout.name }}</p>
              <div class="flex items-center gap-2 text-xs text-gray-400">
                <span :class="tryout.isFree ? 'text-green-600' : 'text-orange-500'">
                  {{ tryout.isFree ? 'Gratis' : 'Berbayar' }}
                </span>
                <span>·</span>
                <span :class="tryout.isPublished ? 'text-green-600' : 'text-gray-400'">
                  {{ tryout.isPublished ? 'Published' : 'Draft' }}
                </span>
              </div>
            </div>
            <Icon icon="mdi:chevron-right" class="text-gray-400 shrink-0" />
          </RouterLink>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>
