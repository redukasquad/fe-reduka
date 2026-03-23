<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { CourseService } from '../../services/course'
import { CourseLessonService } from '../../services/course.lesson'
import type { ClassLesson, ClassLessonResource } from '../../types/entites/classLesson'
import type { Class } from '../../types/entites/class'

const route = useRoute()
const router = useRouter()
const courseId = Number(route.params.id)

// ── Course ────────────────────────────────────────────────────────────────────
const { data: courseData, isLoading: courseLoading } = useQuery({
  queryKey: ['course', courseId],
  queryFn: () => CourseService.findOne(courseId),
})
const course = computed(() => courseData.value?.data ?? null)
const classes = computed<Class[]>(() => course.value?.classes ?? [])

// ── Lessons per class (lazy load per class) ───────────────────────────────────
const expandedClassId = ref<number | null>(null)
const lessonsCache = ref<Record<number, ClassLesson[]>>({})
const loadingClass = ref<number | null>(null)

async function toggleClass(cls: Class) {
  if (expandedClassId.value === cls.id) {
    expandedClassId.value = null
    return
  }
  expandedClassId.value = cls.id
  if (!lessonsCache.value[cls.id]) {
    loadingClass.value = cls.id
    try {
      const res = await CourseLessonService.findByClass(cls.id)
      const sorted = (res.data ?? []).sort((a, b) => a.lessonOrder - b.lessonOrder)
      // Replace entire object to trigger Vue reactivity on nested key
      lessonsCache.value = { ...lessonsCache.value, [cls.id]: sorted }
    } finally {
      loadingClass.value = null
    }
  }
  // Auto-select first lesson if none selected
  const firstLesson = lessonsCache.value[cls.id]?.[0]
  if (firstLesson && !activeLesson.value) {
    selectLesson(firstLesson)
  }
}

// ── Active lesson & resource ──────────────────────────────────────────────────
const activeLesson = ref<ClassLesson | null>(null)
const activeResource = ref<ClassLessonResource | null>(null)

function selectLesson(lesson: ClassLesson) {
  // Spread to new object so Vue detects the change even if same reference
  activeLesson.value = { ...lesson }
  activeResource.value = lesson.resources?.[0] ?? null
}

function selectResource(res: ClassLessonResource) {
  activeResource.value = { ...res }
}

// ── Auto-expand first class on load ──────────────────────────────────────────
watch(classes, async (cls) => {
  const first = cls[0]
  if (first && expandedClassId.value === null) {
    await toggleClass(first)
  }
}, { immediate: true })

// ── Resource rendering helpers ────────────────────────────────────────────────
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1] ?? null
  }
  return null
}

const isYouTube = (url: string) => !!getYouTubeId(url)

function resourceIcon(type: string) {
  return {
    video: 'mdi:play-circle-outline',
    document: 'mdi:file-document-outline',
    link: 'mdi:link-variant',
    zoom: 'mdi:video-outline',
    recording: 'mdi:record-circle-outline',
  }[type] ?? 'mdi:file-outline'
}

function resourceColor(type: string) {
  return {
    video: 'text-red-500',
    document: 'text-blue-500',
    link: 'text-violet-500',
    zoom: 'text-sky-500',
    recording: 'text-amber-500',
  }[type] ?? 'text-gray-400'
}

function resourceLabel(type: string) {
  return {
    video: 'Video',
    document: 'Dokumen',
    link: 'Tautan',
    zoom: 'Zoom',
    recording: 'Rekaman',
  }[type] ?? type
}

function formatTime(t?: string | null) {
  if (!t) return null
  return new Date(t).toLocaleString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

// Sidebar mobile toggle
const showSidebar = ref(false)
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-50 overflow-hidden">

    <!-- Top bar -->
    <div class="bg-white border-b border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3 shrink-0 z-20">
      <button @click="router.back()"
        class="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors shrink-0">
        <Icon icon="mdi:arrow-left" class="text-lg" />
      </button>
      <div class="flex-1 min-w-0">
        <p class="text-xs text-gray-400 truncate">{{ course?.nameCourse ?? '...' }}</p>
        <p class="font-bold text-gray-900 text-sm truncate">
          {{ activeLesson?.title ?? 'Pilih pertemuan' }}
        </p>
      </div>
      <!-- Mobile sidebar toggle -->
      <button @click="showSidebar = !showSidebar"
        class="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors shrink-0">
        <Icon icon="mdi:menu" class="text-lg" />
      </button>
    </div>

    <!-- Body -->
    <div class="flex flex-1 overflow-hidden relative">

      <!-- ── Sidebar ──────────────────────────────────────────────────────── -->
      <aside :class="[
        'w-72 bg-white border-r border-gray-100 flex flex-col overflow-hidden shrink-0 transition-all duration-200',
        'absolute md:relative inset-y-0 left-0 z-30',
        showSidebar ? 'translate-x-0 shadow-xl' : '-translate-x-full md:translate-x-0'
      ]">
        <!-- Sidebar header -->
        <div class="px-4 py-3 border-b border-gray-50 shrink-0">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Materi Kelas</p>
        </div>

        <div v-if="courseLoading" class="p-4 space-y-3 animate-pulse">
          <div v-for="n in 4" :key="n" class="h-10 bg-gray-100 rounded-xl" />
        </div>

        <div v-else class="flex-1 overflow-y-auto py-2">
          <!-- Class accordion -->
          <div v-for="cls in classes" :key="cls.id">
            <!-- Class header -->
            <button @click="toggleClass(cls)"
              :class="['w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors',
                expandedClassId === cls.id ? 'bg-primary/5' : '']">
              <div :class="['w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                expandedClassId === cls.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500']">
                <Icon icon="mdi:book-open-outline" class="text-sm" />
              </div>
              <div class="flex-1 min-w-0">
                <p :class="['text-sm font-semibold truncate', expandedClassId === cls.id ? 'text-primary' : 'text-gray-800']">
                  {{ cls.name }}
                </p>
                <p v-if="cls.description" v-html="cls.description" class="text-xs text-gray-400 truncate"></p>
              </div>
              <Icon v-if="loadingClass === cls.id" icon="mdi:loading" class="text-primary animate-spin shrink-0 text-sm" />
              <Icon v-else :icon="expandedClassId === cls.id ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                class="text-gray-400 shrink-0 text-sm" />
            </button>

            <!-- Lessons list -->
            <Transition name="slide-down">
              <div v-if="expandedClassId === cls.id" class="bg-gray-50/50">
                <div v-if="!lessonsCache[cls.id]" class="px-4 py-3 space-y-2 animate-pulse">
                  <div v-for="n in 3" :key="n" class="h-8 bg-gray-200 rounded-lg" />
                </div>
                <div v-else-if="(lessonsCache[cls.id] ?? []).length === 0" class="px-4 py-3 text-xs text-gray-400 italic">
                  Belum ada pertemuan.
                </div>
                <button v-for="lesson in (lessonsCache[cls.id] ?? [])" :key="lesson.id"
                  @click="selectLesson(lesson); showSidebar = false"
                  :class="['w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-primary/5 transition-colors border-l-2',
                    activeLesson?.id === lesson.id ? 'border-primary bg-primary/5' : 'border-transparent']">
                  <span :class="['w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5',
                    activeLesson?.id === lesson.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500']">
                    {{ lesson.lessonOrder }}
                  </span>
                  <div class="flex-1 min-w-0">
                    <p :class="['text-xs font-semibold truncate', activeLesson?.id === lesson.id ? 'text-primary' : 'text-gray-700']">
                      {{ lesson.title }}
                    </p>
                    <p v-if="lesson.resourceCount" class="text-[10px] text-gray-400">
                      {{ lesson.resourceCount }} materi
                    </p>
                  </div>
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </aside>

      <!-- Overlay for mobile sidebar -->
      <div v-if="showSidebar" @click="showSidebar = false"
        class="md:hidden absolute inset-0 bg-black/30 z-20" />

      <!-- ── Main content ──────────────────────────────────────────────────── -->
      <main class="flex-1 overflow-y-auto">

        <!-- No lesson selected -->
        <div v-if="!activeLesson" class="h-full flex items-center justify-center text-center p-8">
          <div class="space-y-3">
            <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Icon icon="mdi:book-open-page-variant-outline" class="text-3xl text-primary" />
            </div>
            <p class="font-semibold text-gray-600">Pilih pertemuan dari sidebar</p>
            <p class="text-sm text-gray-400">Klik kelas di sebelah kiri untuk melihat daftar pertemuan</p>
          </div>
        </div>

        <template v-else>
          <!-- Two-column: left = resource viewer, right = resource list -->
          <div class="flex flex-col lg:flex-row h-full">

            <!-- Resource viewer -->
            <div class="flex-1 flex flex-col min-h-0">

              <!-- Active resource display -->
              <div class="flex-1 bg-black flex items-center justify-center min-h-64 lg:min-h-0">

                <!-- YouTube embed -->
                <template v-if="activeResource && activeResource.type === 'video' && isYouTube(activeResource.url)">
                  <iframe
                    :src="`https://www.youtube.com/embed/${getYouTubeId(activeResource.url)}?rel=0&modestbranding=1`"
                    class="w-full aspect-video max-h-[70vh]"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  />
                </template>

                <!-- Non-YT video -->
                <template v-else-if="activeResource && activeResource.type === 'video'">
                  <video :src="activeResource.url" controls class="w-full max-h-[70vh]" />
                </template>

                <!-- Document / link / zoom / recording — show open button -->
                <template v-else-if="activeResource">
                  <div class="text-center space-y-4 p-8">
                    <div :class="['w-20 h-20 rounded-2xl flex items-center justify-center mx-auto',
                      activeResource.type === 'document' ? 'bg-blue-100'
                      : activeResource.type === 'zoom' ? 'bg-sky-100'
                      : activeResource.type === 'recording' ? 'bg-amber-100'
                      : 'bg-violet-100']">
                      <Icon :icon="resourceIcon(activeResource.type)"
                        :class="['text-4xl', resourceColor(activeResource.type)]" />
                    </div>
                    <div>
                      <p class="text-white font-bold text-lg">{{ activeResource.title }}</p>
                      <p class="text-gray-400 text-sm mt-1">{{ resourceLabel(activeResource.type) }}</p>
                    </div>
                    <a :href="activeResource.url" target="_blank" rel="noopener noreferrer"
                      :class="['inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-colors',
                        activeResource.type === 'document' ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : activeResource.type === 'zoom' ? 'bg-sky-500 hover:bg-sky-600 text-white'
                        : activeResource.type === 'recording' ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-violet-500 hover:bg-violet-600 text-white']">
                      <Icon :icon="activeResource.type === 'document' ? 'mdi:open-in-new'
                        : activeResource.type === 'zoom' ? 'mdi:video-outline'
                        : 'mdi:open-in-new'" />
                      {{ activeResource.type === 'document' ? 'Buka Dokumen'
                        : activeResource.type === 'zoom' ? 'Buka Zoom'
                        : activeResource.type === 'recording' ? 'Tonton Rekaman'
                        : 'Buka Tautan' }}
                    </a>
                  </div>
                </template>

                <!-- No resource -->
                <template v-else>
                  <div class="text-center space-y-3 p-8">
                    <Icon icon="mdi:file-question-outline" class="text-5xl text-gray-600 mx-auto" />
                    <p class="text-gray-400 text-sm">Tidak ada materi untuk pertemuan ini.</p>
                  </div>
                </template>
              </div>

              <!-- Lesson info below viewer -->
              <div class="bg-white border-t border-gray-100 px-5 py-4 shrink-0">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h2 class="font-extrabold text-gray-900 text-base">{{ activeLesson.title }}</h2>
                    <div v-if="activeLesson.startTime || activeLesson.endTime" class="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <Icon icon="mdi:clock-outline" />
                      <span v-if="activeLesson.startTime">{{ formatTime(activeLesson.startTime) }}</span>
                      <span v-if="activeLesson.startTime && activeLesson.endTime">–</span>
                      <span v-if="activeLesson.endTime">{{ formatTime(activeLesson.endTime) }}</span>
                    </div>
                  </div>
                  <span class="text-xs text-gray-400 shrink-0 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                    Pertemuan {{ activeLesson.lessonOrder }}
                  </span>
                </div>
                <div v-if="activeLesson.description"
                  class="mt-3 text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  v-html="activeLesson.description" />
              </div>
            </div>

            <!-- Resource list (right panel) -->
            <div class="w-full lg:w-72 bg-white border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col shrink-0">
              <div class="px-4 py-3 border-b border-gray-50 shrink-0">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Materi Pertemuan</p>
              </div>

              <div class="flex-1 overflow-y-auto py-2">
                <div v-if="!activeLesson.resources || activeLesson.resources.length === 0"
                  class="px-4 py-8 text-center text-xs text-gray-400 italic">
                  Belum ada materi.
                </div>
                <button v-for="res in activeLesson.resources" :key="res.id"
                  @click="selectResource(res)"
                  :class="['w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-l-2',
                    activeResource?.id === res.id ? 'border-primary bg-primary/5' : 'border-transparent']">
                  <div :class="['w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    activeResource?.id === res.id ? 'bg-primary/10' : 'bg-gray-100']">
                    <Icon :icon="resourceIcon(res.type)"
                      :class="['text-base', activeResource?.id === res.id ? 'text-primary' : resourceColor(res.type)]" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p :class="['text-xs font-semibold truncate', activeResource?.id === res.id ? 'text-primary' : 'text-gray-800']">
                      {{ res.title }}
                    </p>
                    <p class="text-[10px] text-gray-400">{{ resourceLabel(res.type) }}</p>
                  </div>
                  <!-- External link indicator for non-video -->
                  <Icon v-if="res.type !== 'video'" icon="mdi:open-in-new" class="text-gray-300 text-xs shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-down-enter-to, .slide-down-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
