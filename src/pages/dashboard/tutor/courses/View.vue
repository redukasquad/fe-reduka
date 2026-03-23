<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { Image } from '@unpic/vue'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import { CourseService } from '../../../../services/course'

const route = useRoute()
const courseId = Number(route.params.id)

const { data, isLoading, isError } = useQuery({
  queryKey: ['course', courseId],
  queryFn: () => CourseService.findOne(courseId),
  enabled: !!courseId,
  staleTime: 1000 * 60 * 5,
})

const course = computed(() => data.value?.data ?? null)
const dateFormatter = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })

type Tab = 'classes' | 'info'
const activeTab = ref<Tab>('classes')
</script>

<template>
  <DashboardLayout>
    <div class="py-6 px-4 md:px-8 space-y-6 backdrop-blur">

      <!-- Loading -->
      <div v-if="isLoading" class="space-y-4 animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-1/3" />
        <div class="h-48 bg-gray-200 rounded-xl" />
      </div>

      <!-- Error -->
      <div v-else-if="isError" class="py-16 text-center text-red-500">
        <Icon icon="mdi:alert-circle-outline" class="text-5xl mb-2" />
        <p>Gagal memuat data course.</p>
      </div>

      <template v-else-if="course">
        <!-- Back -->
        <RouterLink
          :to="{ name: 'tutor-courses' }"
          class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          <Icon icon="mdi:chevron-left" class="text-lg" />
          Kembali ke Semua Courses
        </RouterLink>

        <!-- Hero card — read only -->
        <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div class="flex flex-col md:flex-row gap-0">
            <div class="md:w-64 shrink-0 bg-gray-100">
              <Image
                v-if="course.image"
                :src="course.image"
                :alt="course.nameCourse"
                class="w-full h-48 md:h-full object-cover"
              />
              <div v-else class="w-full h-48 md:h-full flex items-center justify-center text-gray-300">
                <Icon icon="mdi:image-off-outline" class="text-5xl" />
              </div>
            </div>

            <div class="flex-1 p-5 space-y-3">
              <div class="flex items-start justify-between gap-2 flex-wrap">
                <h1 class="text-xl md:text-2xl font-bold text-gray-900">{{ course.nameCourse }}</h1>
                <span
                  :class="course.isFree ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'"
                  class="px-2.5 py-1 rounded-full text-xs font-semibold shrink-0"
                >
                  {{ course.isFree ? 'Gratis' : 'Berbayar' }}
                </span>
              </div>

              <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                <span class="flex items-center gap-1.5">
                  <Icon icon="mdi:calendar-start" class="text-primary" />
                  {{ dateFormatter.format(new Date(course.startDate)) }}
                </span>
                <span class="flex items-center gap-1.5">
                  <Icon icon="mdi:calendar-end" class="text-primary" />
                  {{ dateFormatter.format(new Date(course.endDate)) }}
                </span>
                <span v-if="course.program" class="flex items-center gap-1.5">
                  <Icon icon="mdi:school-outline" class="text-primary" />
                  {{ course.program.programName }}
                </span>
                <span v-if="course.creator" class="flex items-center gap-1.5">
                  <Icon icon="mdi:account-outline" class="text-primary" />
                  {{ course.creator.username }}
                </span>
              </div>

              <div class="flex flex-wrap gap-3 pt-1">
                <div class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-sm">
                  <Icon icon="mdi:book-open-variant" class="text-primary" />
                  <span class="font-medium">{{ course.classes?.length ?? 0 }}</span>
                  <span class="text-gray-500">kelas</span>
                </div>
                <a
                  v-if="course.whatsAppGroupLink"
                  :href="course.whatsAppGroupLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg text-sm text-green-700 hover:bg-green-100 transition-colors"
                >
                  <Icon icon="mdi:whatsapp" />
                  Grup WA
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="border-b flex gap-0">
          <button
            v-for="tab in [
              { key: 'classes', label: 'Kelas', icon: 'mdi:book-open-variant' },
              { key: 'info', label: 'Deskripsi', icon: 'mdi:information-outline' },
            ]"
            :key="tab.key"
            @click="activeTab = tab.key as Tab"
            :class="[
              'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            <Icon :icon="tab.icon" />
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab: Kelas — link ke tutor-classes-view untuk kelola -->
        <div v-if="activeTab === 'classes'" class="space-y-3">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500">{{ course.classes?.length ?? 0 }} kelas dalam course ini</p>
            <RouterLink
              :to="{ name: 'tutor-classes-view', params: { id: course.id } }"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              <Icon icon="mdi:book-edit-outline" />
              Kelola Kelas & Lessons
            </RouterLink>
          </div>

          <div
            v-if="!course.classes || course.classes.length === 0"
            class="py-10 text-center text-gray-400 border border-dashed rounded-xl"
          >
            <Icon icon="mdi:book-off-outline" class="text-4xl mb-2" />
            <p class="text-sm">Belum ada kelas di course ini.</p>
            <RouterLink
              :to="{ name: 'tutor-classes-view', params: { id: course.id } }"
              class="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1"
            >
              <Icon icon="mdi:plus-circle-outline" />
              Tambah kelas sekarang
            </RouterLink>
          </div>

          <div
            v-for="cls in course.classes"
            :key="cls.id"
            class="border rounded-xl bg-white p-4 hover:border-primary/30 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon icon="mdi:book-open-page-variant" class="text-primary text-sm" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-medium text-sm text-gray-800">{{ cls.name }}</p>
                <p v-if="cls.description" v-html="cls.description" class="text-xs text-gray-400 mt-0.5 line-clamp-1"></p>
                <p class="text-xs text-gray-400">{{ cls.lessonCount ?? 0 }} lessons</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Deskripsi -->
        <div v-if="activeTab === 'info'" class="bg-white rounded-xl border p-5">
          <div v-if="course.description" class="prose prose-sm max-w-none text-gray-700" v-html="course.description" />
          <p v-else class="text-gray-400 italic text-sm">Tidak ada deskripsi.</p>
        </div>
      </template>
    </div>
  </DashboardLayout>
</template>
