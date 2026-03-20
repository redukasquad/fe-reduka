<script setup lang="ts">
import { Image } from '@unpic/vue'
import { Icon } from '@iconify/vue'
import type { Program } from '../../types/entites/program'

defineProps<{ program: Program }>()
</script>

<template>
  <RouterLink
    :to="`/programs/${program.ID}`"
    class="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
  >
    <!-- Thumbnail -->
    <div class="relative h-44 w-full overflow-hidden bg-gray-100">
      <Image
        v-if="program.imageProgram"
        :src="program.imageProgram"
        :alt="program.programName"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
        <Icon icon="mdi:image-off-outline" class="text-5xl" />
      </div>

      <!-- Course count badge -->
      <span
        v-if="program.courses?.length"
        class="absolute top-3 right-3 bg-primary text-primary-foreground text-[11px] font-bold px-2.5 py-1 rounded-full shadow"
      >
        {{ program.courses.length }} Course
      </span>
    </div>

    <!-- Content -->
    <div class="flex flex-col flex-1 p-5 gap-2">
      <h3 class="font-bold text-gray-800 text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
        {{ program.programName }}
      </h3>
      <p
        v-if="program.description"
        class="text-sm text-gray-500 line-clamp-2 flex-1"
        v-html="program.description"
      />
      <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <span class="text-xs text-gray-400">
          {{ new Date(program.CreatedAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) }}
        </span>
        <span class="text-xs font-semibold text-primary flex items-center gap-1">
          Lihat Detail <Icon icon="mdi:arrow-right" />
        </span>
      </div>
    </div>
  </RouterLink>
</template>
