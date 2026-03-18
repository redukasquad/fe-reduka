<script setup lang="ts">
import { useRouter } from "vue-router";
import type { Course } from "../../../../types/entites/course"

const props = defineProps<{
  data: Course
}>()

const router = useRouter()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const handleView = (id: number) => {
  router.push({ name: 'tutor-courses-view', params: { id } })
}
</script>

<template>
  <Card class="overflow-hidden">

    <template #header>
      <img
        v-if="data.image"
        :src="data.image"
        :alt="data.nameCourse"
        class="w-full h-48 object-cover"
      />
      <div
        v-else
        class="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400"
      >
        No Image
      </div>
    </template>

    <template #title>
      <div class="flex justify-between items-start gap-2">
        <span class="font-semibold">
          {{ data.nameCourse }}
        </span>

        <Tag
          :value="data.isFree ? 'FREE' : 'PAID'"
          :severity="data.isFree ? 'success' : 'warning'"
        />
      </div>
    </template>

    <template #subtitle>
      <span class="text-sm text-gray-500">
        {{ data.program?.programName ?? "Tanpa Program" }}
      </span>
    </template>

    <template #content>
      <p v-html="data.description" class="text-sm text-gray-600 line-clamp-3" />

      <div class="mt-3 text-xs text-gray-500">
        {{ formatDate(data.startDate) }}
        —
        {{ formatDate(data.endDate) }}
      </div>

      <div class="mt-4 flex justify-end">
        <Button
          label="Detail"
          icon="pi pi-arrow-right"
          size="small"
          text
          @click="()=>handleView(data.id)"
        />
      </div>
    </template>

  </Card>
</template>