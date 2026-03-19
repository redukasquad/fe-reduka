<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { Image } from '@unpic/vue'
import { toast } from 'vue3-toastify'
import DashboardLayout from '../../../../components/layout/DashboardLayout.vue'
import FormSubject from '../../../../components/dashboard/admin/courses/FormSubject.vue'
import ListQuestionView from '../../../../components/dashboard/admin/courses/ListQuestionView.vue'
import { CourseService } from '../../../../services/course'
import { CourseSubjectService } from '../../../../services/course.subject'
import { CourseRegistrationService } from '../../../../services/course.registration'

const route = useRoute()
const router = useRouter()
const courseId = Number(route.params.id)
const queryClient = useQueryClient()

const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ['course', courseId],
  queryFn: () => CourseService.findOne(courseId),
  enabled: !!courseId,
})

const course = computed(() => data.value?.data ?? null)

// Registration count
const { data: regData } = useQuery({
  queryKey: ['course-registration', courseId],
  queryFn: () => CourseRegistrationService.getRegistration(courseId),
  enabled: !!courseId,
})
const registrationCount = computed(() => regData.value?.data?.length ?? 0)

// Subjects
const showAddSubject = ref(false)
const activeSubjectId = ref<number | null>(null)
const activeSubject = computed(() =>
  course.value?.subjects?.find(s => s.id === activeSubjectId.value) ?? null
)

const deleteSubjectMutation = useMutation({
  mutationFn: (id: number) => CourseSubjectService.remove(id),
  onSuccess: () => {
    refetch()
    activeSubjectId.value = null
    toast.success('Subject dihapus')
  },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal menghapus subject'),
})

// Delete course
const confirmDelete = ref(false)
const deleteMutation = useMutation({
  mutationFn: () => CourseService.delete(courseId),
  onSuccess: () => {
    toast.success('Course berhasil dihapus')
    router.push({ name: 'admin-courses' })
  },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal menghapus course'),
})

const dateFormatter = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })

// Active tab
const activeTab = ref<'subjects' | 'questions' | 'info'>('subjects')
</script>

<template>
  <DashboardLayout class="backdrop-blur">
    <div v-if="isLoading" class="p-8 text-center text-gray-500">Memuat data...</div>
    <div v-else-if="isError" class="p-8 text-center text-red-500">Gagal memuat data course.</div>

    <div v-else-if="course" class="py-6 px-4 md:px-8 space-y-6">

      <!-- Top nav -->
      <div class="flex items-center justify-between">
        <RouterLink
          :to="{ name: 'admin-courses' }"
          class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          <Icon icon="mdi:chevron-left" class="text-lg" />
          Kembali
        </RouterLink>

        <div class="flex items-center gap-2">
          <RouterLink
            :to="{ name: 'admin-courses-update', params: { id: course.id } }"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            <Icon icon="mdi:pencil-outline" />
            Edit
          </RouterLink>

          <button
            v-if="!confirmDelete"
            @click="confirmDelete = true"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-50 text-red-500 text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <Icon icon="mdi:delete-outline" />
            Hapus
          </button>
          <div v-else class="flex items-center gap-2">
            <span class="text-xs text-red-500">Yakin?</span>
            <button @click="deleteMutation.mutate()" class="px-3 py-1.5 rounded-md bg-red-500 text-white text-xs hover:bg-red-600 transition-colors">Ya</button>
            <button @click="confirmDelete = false" class="px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 text-xs hover:bg-gray-200 transition-colors">Batal</button>
          </div>
        </div>
      </div>

      <!-- Hero card -->
      <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div class="flex flex-col md:flex-row gap-0">
          <!-- Image -->
          <div class="md:w-72 shrink-0 bg-gray-100">
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

          <!-- Info -->
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

            <!-- Stats row -->
            <div class="flex flex-wrap gap-3 pt-1">
              <div class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-sm">
                <Icon icon="mdi:book-open-variant" class="text-primary" />
                <span class="font-medium">{{ course.subjects?.length ?? 0 }}</span>
                <span class="text-gray-500">subjects</span>
              </div>
              <RouterLink
                :to="{ name: 'admin-courses-registration', params: { id: course.id } }"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-sm hover:bg-primary/5 transition-colors"
              >
                <Icon icon="mdi:account-group-outline" class="text-primary" />
                <span class="font-medium">{{ registrationCount }}</span>
                <span class="text-gray-500">registrasi</span>
                <Icon icon="mdi:arrow-top-right" class="text-gray-400 text-xs" />
              </RouterLink>
              <a
                v-if="course.whatsappGroupLink"
                :href="course.whatsappGroupLink"
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
            { key: 'subjects', label: 'Subjects', icon: 'mdi:book-open-variant' },
            { key: 'questions', label: 'Pertanyaan Registrasi', icon: 'mdi:help-circle-outline' },
            { key: 'info', label: 'Deskripsi', icon: 'mdi:information-outline' },
          ]"
          :key="tab.key"
          @click="activeTab = tab.key as any"
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

      <!-- Tab: Subjects -->
      <div v-if="activeTab === 'subjects'" class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-gray-800">
            Subjects
            <span class="ml-1.5 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {{ course.subjects?.length ?? 0 }}
            </span>
          </h2>
          <button
            @click="showAddSubject = true"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Icon icon="mdi:plus" />
            Tambah Subject
          </button>
        </div>

        <div v-if="!course.subjects?.length" class="py-10 text-center text-gray-400">
          <Icon icon="mdi:book-off-outline" class="text-4xl mb-2" />
          <p>Belum ada subject</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="subject in course.subjects"
            :key="subject.id"
            class="border rounded-lg bg-white hover:shadow-sm transition-shadow"
          >
            <div class="flex items-center justify-between p-4">
              <button
                @click="activeSubjectId = activeSubjectId === subject.id ? null : subject.id"
                class="flex items-center gap-2 text-left flex-1 min-w-0"
              >
                <div class="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon icon="mdi:book-open-page-variant" class="text-primary text-sm" />
                </div>
                <div class="min-w-0">
                  <p class="font-medium text-sm text-gray-800 truncate">{{ subject.name }}</p>
                  <p class="text-xs text-gray-400">{{ subject.lessons?.length ?? 0 }} lessons</p>
                </div>
              </button>
              <button
                @click="deleteSubjectMutation.mutate(subject.id)"
                :disabled="deleteSubjectMutation.isPending.value"
                class="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-2 shrink-0"
                title="Hapus subject"
              >
                <Icon icon="mdi:delete-outline" />
              </button>
            </div>

            <!-- Subject description expand -->
            <div
              v-if="activeSubjectId === subject.id"
              class="px-4 pb-4 border-t pt-3"
            >
              <div v-if="subject.description" class="text-sm text-gray-600 prose prose-sm max-w-none" v-html="subject.description" />
              <p v-else class="text-sm text-gray-400 italic">Tidak ada deskripsi</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Registration Questions -->
      <div v-if="activeTab === 'questions'">
        <ListQuestionView :courseId="course.id" />
      </div>

      <!-- Tab: Description -->
      <div v-if="activeTab === 'info'" class="bg-white rounded-xl border p-5">
        <div v-if="course.description" class="prose prose-sm max-w-none text-gray-700" v-html="course.description" />
        <p v-else class="text-gray-400 italic">Tidak ada deskripsi</p>
      </div>
    </div>

    <FormSubject v-model:visible="showAddSubject" :courseId="courseId" />
  </DashboardLayout>
</template>
