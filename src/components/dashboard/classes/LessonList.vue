<script setup lang="ts">
// LessonList — shows lessons for a class, each expandable to show/add resources
import { computed, ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { toast } from 'vue3-toastify'
import { LessonService } from '../../../services/lesson'
import { ResourceService, type ResourceType } from '../../../services/resource'
import ResourceList from './ResourceList.vue'

const props = defineProps<{ classId: number }>()
const emit = defineEmits<{ (e: 'delete', id: number): void }>()

const queryClient = useQueryClient()

const { data, isLoading } = useQuery({
  queryKey: ['lessons', props.classId],
  queryFn: () => LessonService.findByClass(props.classId),
  staleTime: 1000 * 60 * 2,
})

const lessons = computed(() =>
  [...(data.value?.data ?? [])].sort((a, b) => a.lessonOrder - b.lessonOrder)
)

const timeFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit', month: 'short', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
})

// Expanded lesson → shows resources
const expandedLesson = ref<number | null>(null)
const toggleLesson = (id: number) => {
  expandedLesson.value = expandedLesson.value === id ? null : id
}

// Resource type meta
const resourceMeta: Record<ResourceType, { icon: string; label: string; color: string }> = {
  video:     { icon: 'mdi:youtube',                label: 'Video',     color: 'text-red-500' },
  zoom:      { icon: 'mdi:video-outline',           label: 'Zoom',      color: 'text-blue-500' },
  recording: { icon: 'mdi:record-circle',           label: 'Recording', color: 'text-purple-500' },
  document:  { icon: 'mdi:file-document-outline',   label: 'Dokumen',   color: 'text-orange-500' },
  link:      { icon: 'mdi:link-variant',            label: 'Link',      color: 'text-gray-500' },
}

// Add resource form
const showAddResource = ref<number | null>(null) // lessonId
const resType = ref<ResourceType>('video')
const resTitle = ref('')
const resUrl = ref('')

const resetResourceForm = () => {
  resTitle.value = ''
  resUrl.value = ''
  resType.value = 'video'
}

const { mutate: createResource, isPending: creatingResource } = useMutation({
  mutationFn: ({ lessonId, data }: { lessonId: number; data: any }) =>
    ResourceService.create(lessonId, data),
  onSuccess: (_, vars) => {
    queryClient.invalidateQueries({ queryKey: ['resources', vars.lessonId] })
    showAddResource.value = null
    resetResourceForm()
    toast.success('Materi berhasil ditambahkan')
  },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal menambahkan materi'),
})

const submitResource = (lessonId: number) => {
  if (!resTitle.value.trim()) return toast.error('Judul materi wajib diisi')
  if (!resUrl.value.trim()) return toast.error('URL wajib diisi')
  createResource({ lessonId, data: { type: resType.value, title: resTitle.value, url: resUrl.value } })
}

const { mutate: deleteResource } = useMutation({
  mutationFn: ({ id, lessonId: _lid }: { id: number; lessonId: number }) =>
    ResourceService.remove(id),
  onSuccess: (_, vars) => {
    queryClient.invalidateQueries({ queryKey: ['resources', vars.lessonId] })
    toast.success('Materi dihapus')
  },
  onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Gagal menghapus materi'),
})
</script>

<template>
  <div>
    <div v-if="isLoading" class="space-y-1.5">
      <div v-for="n in 2" :key="n" class="h-10 bg-gray-200 rounded animate-pulse" />
    </div>

    <div v-else-if="lessons.length === 0" class="text-xs text-gray-400 italic py-1">
      Belum ada lesson.
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="lesson in lessons"
        :key="lesson.id"
        class="border rounded-lg bg-white overflow-hidden"
      >
        <!-- Lesson row -->
        <div class="flex items-center gap-3 px-3 py-2 group">
          <button @click="toggleLesson(lesson.id)" class="flex items-center gap-3 flex-1 min-w-0 text-left">
            <span class="size-6 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-bold shrink-0">
              {{ lesson.lessonOrder }}
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">{{ lesson.title }}</p>
              <p v-if="lesson.startTime" class="text-[11px] text-gray-400">
                {{ timeFormatter.format(new Date(lesson.startTime)) }}
              </p>
            </div>
            <span class="text-[10px] text-gray-400 shrink-0">
              {{ lesson.resourceCount ?? 0 }} materi
            </span>
            <Icon
              :icon="expandedLesson === lesson.id ? 'mdi:chevron-up' : 'mdi:chevron-down'"
              class="text-gray-400 shrink-0 text-sm"
            />
          </button>
          <button
            @click="emit('delete', lesson.id)"
            class="p-1 rounded text-red-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
            title="Hapus lesson"
          >
            <Icon icon="mdi:delete-outline" class="text-sm" />
          </button>
        </div>

        <!-- Resources panel -->
        <div v-if="expandedLesson === lesson.id" class="border-t bg-gray-50/60 px-3 pb-3 pt-2 space-y-2">
          <ResourceList
            :lesson-id="lesson.id"
            @delete="(id) => deleteResource({ id, lessonId: lesson.id })"
          />

          <!-- Add resource toggle -->
          <button
            @click="showAddResource = showAddResource === lesson.id ? null : lesson.id; resetResourceForm()"
            class="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Icon :icon="showAddResource === lesson.id ? 'mdi:close' : 'mdi:plus-circle-outline'" />
            {{ showAddResource === lesson.id ? 'Batal' : 'Tambah Materi' }}
          </button>

          <!-- Add resource form -->
          <div v-if="showAddResource === lesson.id" class="bg-white border rounded-lg p-3 space-y-2">
            <!-- Type selector -->
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="(meta, type) in resourceMeta"
                :key="type"
                @click="resType = type as ResourceType"
                :class="[
                  'flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-colors',
                  resType === type
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-gray-200 text-gray-600 hover:border-primary/40'
                ]"
              >
                <Icon :icon="meta.icon" class="text-sm" />
                {{ meta.label }}
              </button>
            </div>
            <input
              v-model="resTitle"
              type="text"
              placeholder="Judul materi..."
              class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              v-model="resUrl"
              type="url"
              :placeholder="resType === 'zoom' ? 'https://zoom.us/j/...' : resType === 'video' ? 'https://youtube.com/...' : 'https://...'"
              class="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div class="flex justify-end gap-2">
              <button @click="showAddResource = null" class="px-3 py-1.5 rounded-lg border text-xs text-gray-600 hover:bg-gray-50">Batal</button>
              <button
                @click="submitResource(lesson.id)"
                :disabled="creatingResource"
                class="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {{ creatingResource ? 'Menyimpan...' : 'Simpan Materi' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
