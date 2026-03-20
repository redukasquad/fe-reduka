<script setup lang="ts">
// ResourceList — shows resources for a lesson (video, zoom, document, link, recording)
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { ResourceService } from '../../../services/resource.service'
import type { ResourceType } from '../../../types/entites/lessonResource'

const props = defineProps<{ lessonId: number }>()
const emit = defineEmits<{ (e: 'delete', id: number): void }>()

const { data, isLoading } = useQuery({
  queryKey: ['resources', props.lessonId],
  queryFn: () => ResourceService.findByLesson(props.lessonId),
  staleTime: 1000 * 60 * 2,
})

const resources = computed(() => data.value?.data ?? [])

const resourceMeta: Record<ResourceType, { icon: string; color: string }> = {
  video:     { icon: 'mdi:youtube',               color: 'text-red-500' },
  zoom:      { icon: 'mdi:video-outline',          color: 'text-blue-500' },
  recording: { icon: 'mdi:record-circle',          color: 'text-purple-500' },
  document:  { icon: 'mdi:file-document-outline',  color: 'text-orange-500' },
  link:      { icon: 'mdi:link-variant',           color: 'text-gray-500' },
}
</script>

<template>
  <div>
    <div v-if="isLoading" class="space-y-1">
      <div v-for="n in 2" :key="n" class="h-7 bg-gray-200 rounded animate-pulse" />
    </div>

    <div v-else-if="resources.length === 0" class="text-[11px] text-gray-400 italic">
      Belum ada materi.
    </div>

    <div v-else class="space-y-1">
      <div
        v-for="res in resources"
        :key="res.id"
        class="flex items-center gap-2 group"
      >
        <Icon
          :icon="resourceMeta[res.type as ResourceType]?.icon ?? 'mdi:link-variant'"
          :class="['text-base shrink-0', resourceMeta[res.type as ResourceType]?.color ?? 'text-gray-400']"
        />
        <a
          :href="res.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex-1 text-xs text-gray-700 hover:text-primary hover:underline truncate"
        >
          {{ res.title }}
        </a>
        <button
          @click="emit('delete', res.id)"
          class="p-0.5 rounded text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
          title="Hapus materi"
        >
          <Icon icon="mdi:close" class="text-xs" />
        </button>
      </div>
    </div>
  </div>
</template>
