<script setup lang="ts">
// My Classes View — tutor manages Classes & Lessons for their own course
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { Image } from '@unpic/vue'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import ClassPanel from '../../../../components/dashboard/classes/ClassPanel.vue'
import RegistrationList from '../../../../components/dashboard/classes/RegistrationList.vue'
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

type Tab = 'classes' | 'registrations' | 'info'
const activeTab = ref<Tab>('classes')

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'classes',       label: 'Kelas & Lessons', icon: 'mdi:book-open-variant' },
  { key: 'registrations', label: 'Registrasi',       icon: 'mdi:account-group-outline' },
  { key: 'info',          label: 'Deskripsi',        icon: 'mdi:information-outline' },
]
</script>

<template>
  <DashboardLayout>
    <div class="py-6 px-4 md:px-8 space-y-6 backdrop-blur">

      <div v-if="isLoading" class="space-y-4 animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-1/3" />
        <div class="h-48 bg-gray-200 rounded-xl" />
      </div>

      <div v-else-if="isError" class="py-16 text-center text-red-500">
        <Icon icon="mdi:alert-circle-outline" class="text-5xl mb-2" />
        <p>Gagal memuat data course.</p>
      </div>

      <template v-else-if="course">
        <!-- Back -->
        <div class="flex items-center justify-between">
          <RouterLink
            :to="{ name: 'tutor-classes' }"
            class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
          >
            <Icon icon="mdi:chevron-left" class="text-lg" />
            Kembali ke My Classes
          </RouterLink>
          <RouterLink
            :to="{ name: 'tutor-courses-update', params: { id: courseId } }"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            <Icon icon="mdi:pencil-outline" />
            Edit Course
          </RouterLink>
        </div>

        <!-- Course info card -->
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
        <div class="border-b flex gap-0 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            <Icon :icon="tab.icon" />
            {{ tab.label }}
          </button>
        </div>

        <!-- ClassPanel — tutor: add/delete lessons & resources only, not classes -->
        <ClassPanel v-if="activeTab === 'classes'" :course-id="courseId" :can-manage-classes="false" />

        <!-- RegistrationList — approve/reject -->
        <RegistrationList v-if="activeTab === 'registrations'" :course-id="courseId" />

        <!-- Info -->
        <div v-if="activeTab === 'info'" class="bg-white rounded-xl border p-5">
          <div v-if="course.description" class="prose prose-sm max-w-none text-gray-700" v-html="course.description" />
          <p v-else class="text-gray-400 italic text-sm">Tidak ada deskripsi.</p>
        </div>
      </template>
    </div>
  </DashboardLayout>
</template>
