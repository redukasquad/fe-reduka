<script setup lang="ts">
import { Image } from '@unpic/vue'
import { Icon } from '@iconify/vue'
import type { Course } from '../../types/entites/course'

defineProps<{ course: Course }>()

const dateFormatter = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
</script>

<template>
  <RouterLink
    :to="`/courses/${course.id}`"
    class="group flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
  >
    <div class="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
      <Image v-if="course.image" :src="course.image" :alt="course.nameCourse" class="w-full h-full object-cover" />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
        <Icon icon="mdi:book-open-outline" class="text-2xl" />
      </div>
    </div>

    <div class="flex-1 min-w-0">
      <h4 class="font-semibold text-gray-800 truncate group-hover:text-primary transition-colors text-sm">
        {{ course.nameCourse }}
      </h4>
      <div class="flex items-center gap-2 mt-1 flex-wrap">
        <span
          :class="course.isFree ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'"
          class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
        >
          {{ course.isFree ? 'Gratis' : 'Berbayar' }}
        </span>
        <span class="text-[11px] text-gray-400">
          {{ dateFormatter.format(new Date(course.startDate)) }}
        </span>
      </div>
    </div>

    <Icon icon="mdi:chevron-right" class="text-gray-300 group-hover:text-primary transition-colors text-xl shrink-0" />
  </RouterLink>
</template>
