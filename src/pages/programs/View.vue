<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { Icon } from '@iconify/vue'
import { Image } from '@unpic/vue'
import { ProgramService } from '../../services/program'
import ProgramCourseCard from '../../components/programs/ProgramCourseCard.vue'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

// Fetch detail program — includes courses via preload di backend
const { data, isLoading, isError } = useQuery({
  queryKey: ['program', id],
  queryFn: () => ProgramService.findOne(id),
  enabled: !!id,
  staleTime: 1000 * 60 * 5,
})

const program = computed(() => data.value?.data ?? null)
const courses = computed(() => program.value?.courses ?? [])
const freeCourses = computed(() => courses.value.filter(c => c.isFree).length)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading skeleton -->
    <div v-if="isLoading" class="max-w-4xl mx-auto px-4 py-10 space-y-6 animate-pulse">
      <div class="h-64 bg-gray-200 rounded-2xl" />
      <div class="h-6 bg-gray-200 rounded w-1/2" />
      <div class="h-4 bg-gray-100 rounded w-full" />
      <div class="h-4 bg-gray-100 rounded w-3/4" />
    </div>

    <!-- Error state -->
    <div v-else-if="isError" class="max-w-4xl mx-auto px-4 py-20 text-center text-red-500 space-y-3">
      <Icon icon="mdi:alert-circle-outline" class="text-6xl mx-auto" />
      <p class="text-xl font-semibold">Gagal memuat program.</p>
      <button @click="router.go(0)" class="text-sm text-primary hover:underline">Coba lagi</button>
    </div>

    <template v-else-if="program">
      <!-- Hero image -->
      <div class="relative w-full h-64 md:h-80 max-w-[90%] mx-auto shadow-md bg-gray-200 overflow-hidden mt-32">
        <Image
          v-if="program.imageProgram"
          :src="program.imageProgram"
          :alt="program.programName"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
          <Icon icon="mdi:image-off-outline" class="text-7xl" />
        </div>
        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        <!-- Back button -->
        <button
          @click="router.back()"
          class="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
        >
          <Icon icon="mdi:arrow-left" class="text-xl" />
        </button>

        <!-- Title overlay -->
        <div class="absolute bottom-6 left-6 right-6">
          <h1 class="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">
            {{ program.programName }}
          </h1>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <!-- Stats bar -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div class="bg-white rounded-xl border p-4 text-center">
            <p class="text-2xl font-bold text-primary">{{ courses.length }}</p>
            <p class="text-xs text-gray-500 mt-0.5">Total Course</p>
          </div>
          <div class="bg-green-50 rounded-xl border border-green-100 p-4 text-center">
            <p class="text-2xl font-bold text-green-600">{{ freeCourses }}</p>
            <p class="text-xs text-green-500 mt-0.5">Course Gratis</p>
          </div>
          <div class="bg-gray-50 rounded-xl border p-4 text-center col-span-2 sm:col-span-1">
            <p class="text-sm font-bold text-gray-700">
              {{ new Date(program.CreatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}
            </p>
            <p class="text-xs text-gray-400 mt-0.5">Dibuat Pada</p>
          </div>
        </div>

        <!-- Description -->
        <div v-if="program.description" class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Icon icon="mdi:text-box-outline" class="text-primary" />
            Tentang Program
          </h2>
          <div
            class="prose prose-sm max-w-none text-gray-700 leading-relaxed"
            v-html="program.description"
          />
        </div>

        <!-- Courses section — data sudah ada dari response /programs/:id (preloaded) -->
        <div class="space-y-4">
          <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Icon icon="mdi:book-open-variant" class="text-primary" />
            Course dalam Program Ini
            <span class="ml-auto text-sm font-normal text-gray-400">{{ courses.length }} course</span>
          </h2>

          <div v-if="courses.length === 0" class="py-10 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 space-y-2">
            <Icon icon="mdi:book-off-outline" class="text-4xl mx-auto" />
            <p class="text-sm">Belum ada course yang tersedia.</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ProgramCourseCard v-for="course in courses" :key="course.id" :course="course" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
